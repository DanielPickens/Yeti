package consts

const (
	DefaultNewsURL                         = "https://raw.githubusercontent.com/danielpickens/yeti-homepage-news/main/news.json"
	DefaultETCDTimeoutSeconds              = 5
	DefaultETCDDialKeepaliveTimeSeconds    = 30
	DefaultETCDDialKeepaliveTimeoutSeconds = 10

	AppNameMaxLength     = 20
	AppCompNameMaxLength = 20
	AppCompMaxReplicas   = 10

	YataiDebugImg             = "yeti.ai/yeti-infras/debug"
	YataiKubectlNamespace     = "default"
	YataiKubectlContainerName = "main"
	YataiKubectlImage         eti-infras/k8s"

	TracingContextKey = "tracing-context"
	// nolint: gosec
	YataiApiTokenHeaderName = "X-YETI-API-TOKEN"

	BentoServicePort       = 3000
	BentoServicePortEnvKey = "PORT"

	NoneStr = "None"

	AmazonS3Endpoint = "s3.amazonaws.com"

	// nolint: gosec
	YataiK8sBotApiTokenName = "yeti-k8s-bot"
)
