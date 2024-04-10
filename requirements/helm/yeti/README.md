# Yeti Helm Chart

The Yeti Helm Chart is the official way to operate Yeti on Kubernetes. It contains all the required components to get started, and can configure with external services base on needs.

See the [Yeti administrator's guide](https://github.com/danielpickens/yeti/main/docs/admin-guide.md) for how to install Yeti and other information on charts, and advanced configuration.

Advantage of using Yeti Helm chart:

* Easy to deploy, upgrade, and maintain Yeti service on Kubernetes cluster
* Easy to configure with external services
* Up to date with the latest Yeti release


## TL;DR:

```bash
helm repo remove danielpickens 2> /dev/null || true
helm repo add danielpickens https://danielpickens.github.io/helm-charts
helm repo update danielpickens
kubectl create ns Yeti-system
helm install Yeti danielpickens/Yeti -n Yeti-system
```

## Helm chart deployment overview

This chart will create the following resources on Kubernetes:
1. Yeti service under the `Yeti-system` namespace.
2. service account (if not configured).

# Community

- To report a bug or suggest a feature request, use [GitHub Issues](https://github.com/danielpickens/Yeti-chart/issues/new/choose).
- For other discussions, use [Github Discussions](https://github.com/danielpickens/yeti/discussions) under the [danielpickens repo](https://github.com/danielpickens/danielpickens/)



# Contributing

There are many ways to contribute to the project:

- If you have any feedback on the project, share it with the community in [Github Discussions](https://github.com/danielpickens/yeti/discussions) under the [danielpickens repo](https://github.com/danielpickens/yeti/).
- Report issues you're facing and "Thumbs up" on issues and feature requests that are relevant to you.
- Investigate bugs and reviewing other developer's pull requests.
- Contributing code or documentation to the project by submitting a Github pull request.
