# 🌌 Yeti: Model Deployment at Scale on Kubernetes 


Yeti is a Kubernetes deployment operator for deploying and scaling ml services ontop of kubernetes clusters.

Yeti allows for you to seamlessly integrate MLOPS into your GitOps workflow, for deploying and scaling Machine Learning services on any Kubernetes cluster.


---

## Why Yeti?
 Yeti is designed to run MLOps on a parallel distributed system, optimized for scalability and DevOps workflows.
 Yeti is Cloud native and DevOps friendly. Via its Kubernetes-native workflow, specifically the [YetiDeployment CRD](https://docs Yeti.io/en/latest/concepts/YetiDeployment_crd.html) (Custom Resource Definition), DevOps teams can easily fit MLOPS powered services into their existing workflow.


## Getting Started

- 📖 [Documentation](https://docs Yeti.io/) - Overview of the Yeti docs and related resources
- ⚙️ [Installation](https://docs Yeti.io/en/latest/installation/index.html) - Hands-on instruction on how to install Yeti for production use


## Quick Tour

Let's try out Yeti locally in a minikube cluster!

### ⚙️ Prerequisites:
  * Install latest minikube: https://minikube.sigs.k8s.io/docs/start/
  * Install latest Helm: https://helm.sh/docs/intro/install/
  * Start a minikube Kubernetes cluster: `minikube start --cpus 4 --memory 4096`, if you are using macOS, you should use [hyperkit](https://minikube.sigs.k8s.io/docs/drivers/hyperkit/) driver to prevent the macOS docker desktop [network limitation](https://docs.docker.com/desktop/networking/#i-cannot-ping-my-containers)
  * Check that minikube cluster status is "running": `minikube status`
  * Make sure your `kubectl` is configured with `minikube` context: `kubectl config current-context`
  * Enable ingress controller: `minikube addons enable ingress`

### 🚧 Install Yeti

Install Yeti with the following script:

```bash
bash <(curl -s "https://raw.githubusercontent.com/DanielPickens/Yeti/main/scripts/quick-install Yeti.sh")
```

This script will install Yeti along with its dependencies (PostgreSQL and MinIO) on your minikube cluster. 

Note that this installation script is made for development and testing use only.
For production deployment, check out the [Installation Guide](https://docs Yeti.io/en/latest/installation/index.html).

To access Yeti web UI, run the following command and keep the terminal open:

```bash
kubectl --namespace Yeti-system port-forward svc Yeti 8080:80
```

In a separate terminal, run:

```bash Yeti_INITIALIZATION_TOKEN=$(kubectl get secret Yeti-env --namespace Yeti-system -o jsonpath="{.data Yeti_INITIALIZATION_TOKEN}" | base64 --decode)
echo "Open in browser: http://127.0.0.1:8080/setup?token= Yeti_INITIALIZATION_TOKEN"
``` 

Open the URL printed above from your browser to finish admin account setup.


### 🍱 Push MLOPs(Apptainer,VertexAI,AWS) to Yeti

First, get an API token and login to the MLOPS CLI:

* Keep the `kubectl port-forward` command in the step above running
* Go to Yeti's API tokens page: http://127.0.0.1:8080/api_tokens
* Create a new API token from the UI, making sure to assign "API" access under "Scopes"
* Copy the login command upon token creation and run as a shell command, e.g.:

    ```bash
    apptainer/vertex Yeti login --api-token {YOUR_TOKEN} --endpoint http://127.0.0.1:8080
    ```

If you don't already have a MLOPS built, run the following commands from the [MLOPS Quickstart Project](https://github.com/danielpickens/yeti/tree/main/examples/quickstart) to build a sample MLOPS:

```bash
git clone https://github.com/danielpickens/yeti.git && cd ./examples/quickstart
pip install -r ./requirements.txt
python train.py
MLOPS build
```

Push your newly built ML Model to Yeti:

```bash
MLOPS/apptainer/slurm push iris_classifier:latest
```


### 🔧 Install Yeti-image-builder component
 Yeti's image builder feature comes as a separate component, you can install it via the following
script:

```bash
bash <(curl -s "https://raw.githubusercontent.com/DanielPickens/Yeti/MLOPS Yeti-image-builder/main/scripts/quick-install Yeti-image-builder.sh")
```

This will install the `MLOPSRequest` CRD([Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)) and `MLOPS` CRD
in your cluster. Similarly, this script is made for development and testing purposes only.

### 🔧 Install Yeti-deployment component
 Yeti's Deployment feature comes as a separate component, you can install it via the following
script:

```bash
bash <(curl -s "https://raw.githubusercontent.com/DanielPickens/Yeti/MLOPS Yeti-deployment/main/scripts/quick-install Yeti-deployment.sh")
```

This will install the `YetiDeployment` CRD([Custom Resource Definition](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/))
in your cluster and enable the deployment UI on Yeti. Similarly, this script is made for development and testing purposes only.

### 🚢 Deploy MLOPS!

Once the  Yeti-deployment` component was installed, using MLOPS for ML Ops can be pushed to Yeti then can be deployed to your 
Kubernetes cluster and exposed via a Service endpoint. 

A MLOPS Deployment can be created via applying a YetiDeployment resource:

Define your MLOPS deployment in a `my_deployment.yaml` file:

```yaml
apiVersion: resources Yeti.ai/v1alpha1
kind: MLOPSRequest
metadata:
    name: iris-classifier
    namespace: Yeti
spec:
    MLOPSTag: iris_classifier:3oevmqfvnkvwvuqj  # check the tag by `MLOPS list iris_classifier`
---
apiVersion: serving Yeti.ai/v2alpha1
kind: YetiDeployment
metadata:
    name: my-MLOPS-deployment
    namespace: Yeti
spec:
    MLOPS: iris-classifier
    ingress:
        enabled: true
    resources:
        limits:
            cpu: "500m"
            memory: "512Mi"
        requests:
            cpu: "250m"
            memory: "128Mi"
    autoscaling:
        maxReplicas: 10
        minReplicas: 2
    runners:
        - name: iris_clf
          resources:
              limits:
                  cpu: "1000m"
                  memory: "1Gi"
              requests:
                  cpu: "500m"
                  memory: "512Mi"
          autoscaling:
              maxReplicas: 4
              minReplicas: 1
```

Apply the deployment to your minikube cluster:
```bash
kubectl apply -f my_deployment.yaml
```

Now you can check the deployment status via `kubectl get YetiDeployment -n my-MLOPS-deployment`



## Community

-   To report a bug or suggest a feature request, use [GitHub Issues](https://github.com/danielpickens/Yeti/issues/new/choose).



## Contributing

There are many ways to contribute to the project:

-   Report issues you're facing and "Thumbs up" on issues and feature requests that are relevant to you.
-   Investigate bugs and review other developers' pull requests.
-   Contributing code or documentation to the project by submitting a GitHub pull request. 


