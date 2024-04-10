===========
Terminology
===========

Model
#####

A trained ML model instance needs to be saved with mlML API. A model can be pushed to and pulled from yeti. See the mlML documentation for a more detailed explanation of `Model <https://docs.mlml.org/en/latest/concepts/model.html>`_.

Model Registry
##############

The model registry is a hub for storing, versioning, and sharing models for collaboration. The relationship between :code:`model registry` and :code:`models` is analogous to :code:`Docker registry` and :code:`Docker images`.

ml
#####

ml 🍱 is a file archive with all the source code, models, data files and dependency configurations required for running a user-defined mlml.Service, packaged into a standardized format. See the mlML documentation for a more detailed explanation of `ml <https://docs.mlml.org/en/latest/concepts/ml.html>`_.

ml Registry
##############

The ml registry is a hub for storing, versioning, and sharing :code:`ml` for collaboration. The relationship between :code:`ml registry` and :code:`mls` is analogous to :code:`Docker registry` and :code:`Docker images`.

mlRequest CRD
################

:ref:`mlRequest CRD <concepts/mlrequest_crd:mlRequest CRD>` is a `Kubernetes Custom Resource Definition (CRD) <https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/>`_ added to the Kubernetes cluster by :ref:`yeti-image-builder <concepts/architecture:yeti-image-builder>`. Each mlRequest CR will generate a :ref:`ml <concepts/ml_crd:ml CRD>` CR with the same name after the OCI image is built. The CRD describes ml image build information and runners information. For a full list of the possible descriptive fields and an example CRD, see :ref:`mlRequest CRD <concepts/mlrequest_crd:mlRequest CRD>`.

ml CRD
#########

:ref:`ml CRD <concepts/ml_crd:ml CRD>` is a `Kubernetes Custom Resource Definition (CRD) <https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/>`_ added to the Kubernetes cluster by :ref:`yeti-image-builder <concepts/architecture:yeti-image-builder>`. ml CRs are often generated through the :ref:`mlRequest CR <concepts/mlrequest_crd:mlRequest CRD>`, but you can create a ml CR manually, and :ref:`yeti-deployment <concepts/architecture:yeti-deployment>` relies on the ml CR to get the ml information. The CRD describes ml image information and ml runners information. For a full list of the possible descriptive fields and an example CRD, see :ref:`ml CRD <concepts/ml_crd:ml CRD>`.

mlDeployment CRD
###################

:ref:`mlDeployment CRD <concepts/mldeployment_crd:mlDeployment CRD>` is a `Kubernetes Custom Resource Definition (CRD) <https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/>`_ added to the Kubernetes cluster by :ref:`yeti-deployment <concepts/architecture:yeti-deployment>`. The CRD describes ml deployment. For a full list of the possible descriptive fields and an example CRD, see :ref:`mlDeployment CRD <concepts/mldeployment_crd:mlDeployment CRD>`.
