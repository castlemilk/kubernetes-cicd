# Install Tekton

We provide some common entrypoints for the installation and running of pipelines both on a lcoal cluster like minikube and a remote cluster option like GKE.

## Install Controller

Install the **Tekton** controller by running the following (from the root of `kubernetes-cicd`):

```bash
make components.tekton.controller.install
```

## Install Dashboard

The dashboard will be made available through the defined INGRESS_DRIVER value. If INGRESS_DRIVER=istio, a `VirtualService`, `Gateway` and `DestinationRule` resource will be created to enable connectivity to the running dashboard. 

TODO: Alternatively if setting INGRESS_DRIVER=ingress, a standard `Ingress` resource will be used to allow connectivity.

Install the **Tekton** [dashboard](https://github.com/tektoncd/dashboard) by running the following (from the root of `kubernetes-cicd`)

```bash
make components.tekton.dashboard.install
```

## Install Webhook Extension

Install the **Tekton** [webhook plugin](https://github.com/tektoncd/experimental/tree/master/webhooks-extension) for the dashboard by running the following (from the root of `kubernetes-cicd`)

```bash
make components.tekton.webhook.install
```

## Install demo CI/CD pipeline

A reference CI/CD pipeline is available and can be installed via the following entrypoint:

```bash
make pipelines.tekton.gke.create [CLUSTER=[local|gke]]
```

> Where CLUSTER is used to define which pipeline configuration is used.
