# Kubernetes-Centric CI/CD

This repository captures the talk and demonstration carried presented at Container Camp 2019 AU. The aim is to cover the current Kubernetes ecosystem, which enables an entirely Kubernetes based CI and CD solution to be implemented. We also discuss the benefits of this and why you should care.

## Technologies

In this talk and demonstration we utilise the following technologies

### Tekton

<img width=86 height=86 align="left" src="docs/assets/tekton.png">

The Tekton Pipelines project provides Kubernetes-style resources for declaring CI/CD-style pipelines. Superseding Knative build, tekton provides more sophisticated capability and a focused community project independent of Knative. 

&nbsp;

### Knative

<img width=86 height=86 align="left" src="docs/assets/knative.png">

Knative components build on top of Kubernetes, abstracting away the complex details and enabling developers to focus on what matters. Built by codifying the best practices shared by successful real-world implementations, Knative solves the "boring but difficult" parts of building, deploying, and managing cloud native services so you don't have to.

&nbsp;

### Kustomize

<img width=86 height=86 align="left" src="docs/assets/kustomize.png">

For the management of Kubernetes resources, kustomize provides a template-free mechanism for bundling and mutating resources based off environment and other contexts. Effectively providing a similar capability to templating tooling such as Helm, with less cognitive complexity or abstracted templating.

&nbsp;

### Kaniko

<img width=86 height=86 align="left" src="docs/assets/kaniko.png"> 

Kaniko enables the build of OCI compliant containers without using the Docker daemon. The Kaniko executor also runs in user-space, avoiding privileged escalation, normally required for a Docker daemon based build. As Kaniko is just a binary tool, we can run it within a Kubernetes cluster with ease.
