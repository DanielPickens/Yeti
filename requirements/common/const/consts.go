package consts

const (
	DefaultNewsURL                         = "https://raw.githubusercontent.com/danielpickens/yeti-homepage-news/main/news.json"
	DefaultETCDTimeoutSeconds              = 5
	DefaultETCDDialKeepaliveTimeSeconds    = 30
	DefaultETCDDialKeepaliveTimeoutSeconds = 10

	AppNameMaxLength     = 20
	AppCompNameMaxLength = 20
	AppCompMaxReplicas   = 10

	yetiDebugImg             = "yeti.ai/yeti-infras/debug"
	yetiKubectlNamespace     = "default"
	yetiKubectlContainerName = "main"
	yetiKubectlImage         eti-infras/k8s"

	TracingContextKey = "tracing-context"
	// nolint: gosec
	yetiApiTokenHeaderName = "X-YETI-API-TOKEN"

	mlServicePort       = 3000
	mlServicePortEnvKey = "PORT"

	NoneStr = "None"

	AmazonS3Endpoint = "s3.amazonaws.com"

	// nolint: gosec
	yetiK8sBotApiTokenName = "yeti-k8s-bot"
)
