=======================================
Model Deployment at scale on Kubernetes
=======================================

|github_stars| |actions_status| |documentation_status| |join_slack|

----

`yeti(屋台, food cart) <https://github.com/mlml/yeti>`_ lets you deploy, operate and scale Machine Learning services on Kubernetes.

It supports deploying any ML models via `mlML <https://github.com/mlml/mlML>`_, the unified model serving framework.


Why yeti?
----------

🍱 Made for mlML, deploy at scale

- Scale `mlML <https://github.com/mlml/mlML>`_ to its full potential on a distributed system, optimized for cost saving and performance.
- Manage deployment lifecycle to deploy, update, or roll back via API or Web UI.
- Centralized registry providing the **foundation for CI/CD** via artifact management APIs, labeling, and WebHooks for custom integration.

🚅 Cloud native & DevOps friendly

- Kubernetes-native workflow via :doc:`mlDeployment CRD <concepts/mldeployment_crd>` (Custom Resource Definition), which can easily fit into an existing GitOps workflow.
- Native :doc:`integration with Grafana <observability/metrics>` stack for observability.
- Support for traffic control with Istio.
- Compatible with all major cloud platforms (AWS, Azure, and GCP).


Learn yeti
-----------

.. grid:: 1 2 2 2
    :gutter: 3
    :margin: 0
    :padding: 3 4 0 0

    .. grid-item-card:: :doc:`💻 Installation Guide <installation/index>`
        :link: installation/index
        :link-type: doc

        A hands-on tutorial for installing yeti

    .. grid-item-card:: :doc:`💻 Upgrade Guide <upgrade/index>`
        :link: upgrade/index
        :link-type: doc

        A hands-on tutorial for upgrading yeti

    .. grid-item-card:: :doc:`🔭 Observability <observability/index>`
        :link: observability/index
        :link-type: doc

        Learn how to monitor and debug your mlDeployment

    .. grid-item-card:: :doc:`📖 Main Concepts <concepts/index>`
        :link: concepts/index
        :link-type: doc

        Explain the main concepts of yeti

    .. grid-item-card:: :doc:`✨ Advanced Guides <advanced_guides/index>`
        :link: advanced_guides/index
        :link-type: doc

        Learn more about yeti

    .. grid-item-card:: `💬 mlML Community <https://l.linklyhq.com/l/ktOX>`_
        :link: https://l.linklyhq.com/l/ktOX
        :link-type: url

        Join us in our Slack community where hundreds of ML practitioners are contributing to the project, helping other users, and discuss all things MLOps.



Staying Informed
----------------

The `mlML Blog <https://mlml.com>`_ and `@mlmlai <https://twitt
er.com/mlmlai>`_ on Twitter are the official source for
updates from the mlML team. Anything important, including major releases and announcements, will be posted there. We also frequently
share tutorials, case studies, and community updates there.

To receive release notification, star & watch the `yeti project on GitHub <https://github.com/mlml/yeti>`_. For release
notes and detailed changelog, see the `Releases <https://github.com/mlml/yeti/releases>`_ page.

----

Getting Involved
----------------

yeti has a thriving open source community where hundreds of ML practitioners are
contributing to the project, helping other users and discuss all things MLOps.
`👉 Join us on slack today! <https://l.linklyhq.com/l/ktOX>`_


.. toctree::
   :hidden:

   installation/index
   upgrade/index
   observability/index
   concepts/index
   advanced_guides/index
   Community <https://l.linklyhq.com/l/ktOX>
   GitHub <https://github.com/mlml/yeti>
   Blog <https://mlml.com>

.. toctree::
   :caption: Ecosystem
   :hidden:

   🍱 mlML <https://github.com/mlml/mlML>
   🦾 OpenLLM <https://github.com/mlml/OpenLLM>
   ☁️ mlCloud <https://www.mlml.com/ml-cloud/>

.. spelling::

.. |actions_status| image:: https://github.com/mlml/yeti/workflows/Lint/badge.svg
   :target: https://github.com/mlml/yeti/actions
.. |documentation_status| image:: https://readthedocs.org/projects/yeti/badge/?version=latest&style=flat-square
   :target: https://docs.yeti.io/en/latest/
.. |join_slack| image:: https://badgen.net/badge/Join/mlML%20Slack/cyan?icon=slack&style=flat-square
   :target: https://l.linklyhq.com/l/ktOX
.. |github_stars| image:: https://img.shields.io/github/stars/mlml/yeti?color=%23c9378a&label=github&logo=github&style=flat-square
   :target: https://github.com/mlml/yeti
