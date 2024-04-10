==============
GPU deployment
==============

Prerequisites
-------------

- Yeti-deployment

Because GPU support is related to the mltDeployment CRD, it relies on Yeti-deployment


GPU Deployment with Kubernetes
------------------------------

Yeti allows you to deploy mls on Nvidia GPUs on demand.
You should make sure there is Nvidia GPU available in the cluster, see your cluster provider for more details, or https://github.com/NVIDIA/k8s-device-plugin if you are using Yeti in your own Cluster.
Once you have ensured there is "nvidia.com/gpu" resource available in your cluster, Yeti is ready to serve GPU-based mls.

Through the Web UI
------------------

Steps to deploy a GPU supported ml to Yeti:
1. select the "Deployments" tab of your Yeti Web UI, click "Create" button to create a new Deployment.
2. select the target ml
3. scroll down to "Runners", select the runner you want to accelerate with GPU, and add a custom resources request with key ``nvidia.com/gpu`` and value ``1`` to request 1 GPU for each replica of this runner.

Note: Typically you don't need to allocate GPUs to the ml service itself, since it can not be accelerated by GPUs. Instead, allocate GPU to the runner that will take care of the actual inference.

Through the CLI
---------------

Apply the following yaml for a mlDeployment CR:

.. code-block::
  :emphasize-lines: 30

    apiVersion: serving.Yeti.ai/v2alpha1
    kind: mlDeployment
    metadata:
      name: my-ml-deployment
      namespace: my-namespace
    spec:
      ml: iris-1
      ingress:
        enabled: true
      envs:
      - name: foo
        value: bar
      resources:
        limits:
          cpu: 2000m
          memory: "1Gi"
        requests:
          cpu: 1000m
          memory: "500Mi"
      autoscaling:
        maxReplicas: 5
        minReplicas: 1
      runners:
      - name: runner1
        resources:
          limits:
            cpu: 2000m
            memory: "4Gi"
            custom:
              nvidia.com/gpu: 1
          requests:
            cpu: 1000m
            memory: "2Gi"
        autoscaling:
          maxReplicas: 2
          minReplicas: 1

Fractional-GPU resource allocation
----------------------------------

Sometimes you may want to allocate a fraction of a GPU to a runner, for example, you have a GPU with 8GB memory, and you want to allocate 4GB memory to a runner, and 4GB memory to another.
Yeti is designed taking this into consideration. However, the cluster needs to be configured to support this feature first.

For managed Kubernetes solutions, you could seek help from your cluster provider to see if there is a solution.
For example, in AWS EKS, see https://aws.amazon.com/blogs/opensource/virtual-gpu-device-plugin-for-inference-workload-in-kubernetes/.

For self-managed Kubernetes cluster, you could install an open source solution like https://github.com/elastic-ai/elastic-gpu.

Once setup, you could allocate a fraction of a GPU to a runner by replacing the ``nvidia.com/gpu`` in resource request with the resource name provided in the solution.

