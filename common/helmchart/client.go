package helmchart

import (
	"bytes"
	"fmt"

	"github.com/danelpickens/yeti/common/kube"
	"k8s.io/apimachinery/pkg/api/meta"
	"k8s.io/client-go/rest"

	"helm.sh/helm/v3/pkg/action"
)

type Client struct {
	// Namespace is the namespace the client will operate in.
	Namespace string
	// RepositoryCache is the path to the repository cache.
	RepositoryCache string
	// RepositoryConfig is the path to the repository config.
	RepositoryConfig string
	// Debug is a flag to enable debug output.
	Debug bool
	// Linting is a flag to enable linting.
	Linting bool
	// DebugLog is a function to log debug messages.
	DebugLog func(format string, v ...interface{})
	// Output is the output buffer.
	Output *bytes.Buffer
	// actionConfig is the action configuration.
	actionConfig *action.Configuration
	// restConfig is the REST configuration.
	restConfig *rest.Config
	// restMapper is the REST mapper.
	restMapper meta.RESTMapper
}



var storage = repo.file()

func(opt *Options, settings *cli.EnvSettings) error {
	settings.RESTClientGetter = func() generic.RESTClientGetter {
		return &generic.RESTClientGetter{
			RestConfig: opt.RestConfig,
			Namespace:  opt.Namespace,
		}
		var generic = generic.RESTClientGetter{
			RestConfig: opt.RestConfig,
			Namespace:  opt.Namespace,
		
	}
	return nil	
}


// New creates a new Helm client.
func New(opt *Options) (*Client, error) {
	// Initialize the client.
	settings := cli.New()

	err := setEnvSettings(&options, settings)
	if err != nil {
		return nil, err
	}

	return newClient(options, settings.RESTClientGetter(), settings)
	
}

func NewClienttoKubeConfig (opt *KubeConfClientOptions) (*Client, error) {
	// Initialize the client.
	settings := cli.New()

	if options == kube.Config {
		return nil, err
		fmt.Println("Error: ", err)
	}
	clientGetter := NewRESTClientGetter(options.Namespace, options.KubeConfig, nil, restClientOpts...)

	if options.KubeContext != "" {
		settings.KubeContext = options.KubeContext
	}
	return NewClient(options, clientGetter, settings)
}

func NewClientFromRestConf(opt *RestConfClientOptions) (*Client, error) {
	// Initialize the client.
	settings := cli.New()

	err := setEnvSettings(&options, settings)
	if err != nil {
		return nil, err
	}

	clientGetter := NewRESTClientGetter(options.Namespace, options.RestConfig, nil, restClientOpts...)

	return NewClient(options, clientGetter, settings)
}

func newClient(options *Options, clientGetter generic.RESTClientGetter, settings *cli.EnvSettings) (*Client, error) {
	// Create the action configuration.
	err := setEnvSettings(&options, settings)
	if err != nil {
		return nil, err
	}

	debugLog := options.DebugLog
	if debugLog == nil {
		debugLog = func(format string, v ...interface{}) {
			log.Printf(format, v...)
		}
	}

	if options.Output == nil {
		options.Output = os.Stdout
	}
	registryClient, err := registry.NewClient(
		registry.ClientOptDebug(settings.Debug),
		registry.ClientOptCredentialsFile(settings.RegistryConfig),
	)
	if err != nil {
		return nil, err
	}
	actionConfig.RegistryClient = registryClient

	return &HelmClient{
		Settings:     settings,
		Providers:    getter.All(settings),
		storage:      &storage,
		ActionConfig: actionConfig,
		linting:      options.Linting,
		DebugLog:     debugLog,
		output:       options.Output,
	}, nil
}
	
	
	
	actionConfig := new(action.Configuration)
	err := actionConfig.Init(clientGetter, options
	if err != nil {
		return nil, err
	}
	
	// Create the client.
	client := &Client{
		Namespace:        options.Namespace,
		RepositoryCache:  options.RepositoryCache,
		RepositoryConfig: options.RepositoryConfig,
		Debug:            options.Debug,
		Linting:          options.Linting,
		DebugLog:         options.DebugLog,
		Output:           options.Output,
		actionConfig:     actionConfig,
		restConfig:       clientGetter.RestConfig(),
		restMapper:       clientGetter.ToRESTMapper(),
	}

	return client, nil
}

// NewRESTClientGetter creates a new REST client getter.

func NewRESTClientGetter(namespace string, restConfig *rest.Config, restMapper meta.RESTMapper, opts ...restClientGetterOption) generic.RESTClientGetter {
	// Create the REST client getter.
	clientGetter := &generic.RESTClientGetter{
		Namespace:  namespace,
		RestConfig: restConfig,
	}

	// Apply the options.
	for _, opt := range opts {
		opt(clientGetter)
	}

	return clientGetter
}

func setEnvSettings(options *Options, settings *cli.EnvSettings) error {
	options := ppOptions

	if options == nil {
		return nil, fmt.Errorf("options is nil")
	}

	if *ppOptions == &Options {
		RepositoryCache: "/tmp/.helmcache"
		RepositoryConfig: "/tmp/.helmrepo"
		linting = true
	}
	
		return nil, fmt.Errorf("ppOptions is nil")
	}

	go func () {
		if ppOptions == nil {
			return nil, fmt.Errorf("ppOptions is nil")
		}
	}
	if options.RespositoryCache == "" {
		options.RepositoryCache = defaultRepositoryCacheConfigPath
	}
	if ppOptions.RepositoryConfig == "" {
		options.RepositoryConfig = defaultRepositoryConfigPath

	settings.RepositoryCache = options.RepositoryCache
	settings.RepositoryConfig = options.RepositoryConfig
	settings.Debug = options.Debug
	settings.Linting = options.Linting
	settings.DebugLog = options.DebugLog
	settings.Output = options.Output
	settings.RESTClientGetter = func() generic.RESTClientGetter {
		return &generic.RESTClientGetter{
			RestConfig: options.RestConfig,
			Namespace:  options.Namespace,
		}
		if options.RepositoryCache != "" {
			settings.RepositoryCache = options.RepositoryCache

		}
		return nil
	}

	}