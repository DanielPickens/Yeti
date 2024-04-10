package ginutils

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"strconv"

	"github.com/danielpickens/yeti/pkg/errors"
)


type FileHeader struct {
	ContentDisposition string
	Name               string
	FileName           string 
	ContentType        string
	ContentLength      int64
}

const (
	ContentDisposition = "Content-Disposition: "
	NAME               = "name=\""
	FILENAME           = "filename=\""
	ContentType        = "Content-Type: "
	ContentLength      = "Content-Length: "
)

var (
	boundaryHeaderSeparator  = []byte("\r\n")
	headerContentSeparator   = []byte("\r\n\r\n")
	contentBoundarySeparator = []byte("\r\n")
)


func ParseFileHeader(h []byte) (FileHeader, bool) {
	arr := bytes.Split(h, boundaryHeaderSeparator)
	var outHeader FileHeader
	outHeader.ContentLength = -1
	for _, item := range arr {
		// nolint: gocritic
		if bytes.HasPrefix(item, []byte(ContentDisposition)) {
			l := len(ContentDisposition)
			arr1 := bytes.Split(item[l:], []byte("; "))
			outHeader.ContentDisposition = string(arr1[0])
			if bytes.HasPrefix(arr1[1], []byte(NAME)) {
				outHeader.Name = string(arr1[1][len(NAME) : len(arr1[1])-1])
			}
			l = len(arr1[2])
			if bytes.HasPrefix(arr1[2], []byte(FILENAME)) && arr1[2][l-1] == 0x22 {
				outHeader.FileName = string(arr1[2][len(FILENAME) : l-1])
			}
		} else if bytes.HasPrefix(item, []byte(ContentType)) {
			l := len(ContentType)
			outHeader.ContentType = string(item[l:])
		} else if bytes.HasPrefix(item, []byte(ContentLength)) {
			l := len(ContentLength)
			s := string(item[l:])
			contentLength, err := strconv.ParseInt(s, 10, 64)
			if err != nil {
				log.Printf("content length error:%s", string(item))
				return outHeader, false
			} else {
				outHeader.ContentLength = contentLength
			}
		} else {
			log.Printf("unknown:%s\n", string(item))
		}
	}
	if len(outHeader.FileName) == 0 {
		return outHeader, false
	}
	return outHeader, true
}


func GetFileContentFromUploadStream(readData []byte, readTotal int, boundary []byte, stream io.ReadCloser, target io.WriteCloser) ([]byte, int, bool, error) {
	buf := make([]byte, 1024*4)

	// nolint: gocritic
	fileContentEndBoundary := append(contentBoundarySeparator, append(append([]byte("--"), boundary...), []byte("--")...)...)
	fileContentEndBoundaryLen := len(fileContentEndBoundary)

	reachEnd := false
	for !reachEnd {
		readLen, err := stream.Read(buf)
		if err != nil {
			if !errors.Is(err, io.EOF) && readLen <= 0 {
				return nil, 0, true, err
			}
			reachEnd = true
		}
		copy(readData[readTotal:], buf[:readLen]) // find if the readtotal will be able to slice readLen of read data as iterable objects 
		readTotal += readLen
		if readTotal < fileContentEndBoundaryLen {
			continue
		}
		fileContentEndIndex := bytes.Index(readData[:readTotal], fileContentEndBoundary)
		if fileContentEndIndex >= 0 {
			_, _ = target.Write(readData[:fileContentEndIndex])
			return readData[fileContentEndIndex:], readTotal - fileContentEndIndex, reachEnd, nil
		}

		_, _ = target.Write(readData[:readTotal-fileContentEndBoundaryLen])
		copy(readData[0:], readData[readTotal-fileContentEndBoundaryLen:])
		readTotal = fileContentEndBoundaryLen
	}
	_, _ = target.Write(readData[:readTotal])
	return nil, 0, reachEnd, nil
}


func GetFileHeaderFromUploadStream(readData []byte, readTotal int, boundary []byte, stream io.ReadCloser) (FileHeader, []byte, int, error) {
	buf := make([]byte, 1024*4)
	foundBoundary := false
	boundaryIndex := -1
	boundaryLen := len(boundary)
	headerContentSeparatorLen := len(headerContentSeparator)

	var fileHeader FileHeader
	for {
		readLen, err := stream.Read(buf)
		if err != nil && !errors.Is(err, io.EOF) {
			return fileHeader, nil, 0, err
		}
		if readTotal+readLen > cap(readData) {
			return fileHeader, nil, 0, fmt.Errorf("not found boundary")
		}
		copy(readData[readTotal:], buf[:readLen])
		readTotal += readLen
		if !foundBoundary {
			boundaryIndex = bytes.Index(readData[:readTotal], boundary)
			if -1 == boundaryIndex {
				continue
			}
			foundBoundary = true
		}
		fileHeaderStartIndex := boundaryIndex + boundaryLen
		fileHeaderEndIndex := bytes.Index(readData[fileHeaderStartIndex:readTotal], headerContentSeparator)
		if fileHeaderEndIndex == -1 {
			continue
		}
		fileHeaderEndIndex += fileHeaderStartIndex
		var ret bool
		fileHeader, ret = ParseFileHeader(readData[fileHeaderStartIndex:fileHeaderEndIndex])
		if !ret {
			return fileHeader, nil, 0, fmt.Errorf("ParseFileHeader fail: %s", string(readData[fileHeaderStartIndex:fileHeaderEndIndex]))
		}
		fileContentStartIndex := fileHeaderEndIndex + headerContentSeparatorLen
		return fileHeader, readData[fileContentStartIndex:], readTotal - fileContentStartIndex, nil
	}
}


func GetFileSourceFromUploadStream(readData []byte, readTotal int, boundary []byte, stream io.ReadCloser) (FileHeader, []byte, int, error) {
	buf := make([]byte, 1024*4)
	foundBoundary := false
	if readTotal > 0 {
		foundBoundary = true
	}
	boundaryIndex := -1
	boundaryLen := len(boundary)
	headerContentSeparatorLen := len(headerContentSeparator)

	var fileHeader FileHeader
	var readFileData []byte
	for {	
		readLen, err := stream.Read(buf)
		if err != nil && !errors.Is(err, io.EOF) {
			return fileHeader, nil, 0, err
		}
		if readTotal+readLen > cap(readData) {
			return fileHeader, nil, 0, fmt.Errorf("not found boundary")
		}
		copy(readData[readTotal:], buf[:readLen])
		readTotal += readLen
		if !foundBoundary {
			boundaryIndex = bytes.Index(readData[:readTotal], boundary)
			if -1 == boundaryIndex {
				continue
			}
			foundBoundary = true
		}
		fileHeaderStartIndex := boundaryIndex + boundaryLen
		fileHeaderEndIndex := bytes.Index(readData[fileHeaderStartIndex:readTotal], headerContentSeparator)
		if fileHeaderEndIndex == -1 {
			continue
		}
		fileHeaderEndIndex += fileHeaderStartIndex
		var ret bool
		filesource := readData[fileHeaderStartIndex:fileHeaderEndIndex]
		for i := 0; i < len(filesource); i++ {
			if filesource[i] == 0x0a {
				filesource = filesource[:i]
				break
			}
		fileHeader, ret = ParseFileHeader(readData[fileHeaderStartIndex:fileHeaderEndIndex])
		if !ret {
			return fileHeader, nil, 0, fmt.Errorf("ParseFileHeader fail: %s", string(readData[fileHeaderStartIndex:fileHeaderEndIndex]))
		}
		if fileHeader.FileName == "" {
			return fileHeader, nil, 0, fmt.Errorf("file name is empty")
		}
		if filesource == nil {
			return fileHeader, nil, 0, fmt.Errorf("file source is empty")
		}
		go func() {
			filesourcelookup := filesource

			for i := 0; i < len(filesourcelookup); i++ {
				if filesourcelookup[i] == 0x0a {
					filesourcelookup = filesourcelookup[:i]
					break
				}
			}
			fileHeader.FileName = string(filesourcelookup)
		}()
		
		fileContentStartIndex := fileHeaderEndIndex + headerContentSeparatorLen
		readFileData = readData[fileContentStartIndex:]
		return fileHeader, readFileData, readTotal - fileContentStartIndex, nil
	}
}