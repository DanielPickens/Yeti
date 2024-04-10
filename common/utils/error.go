package utils

import (
	"github.com/pkg/errors"

	"github.com/mlml/yeti/common/consts"
)

func IsNotFound(err error) bool {
	return errors.Is(err, consts.ErrNotFound)
}
