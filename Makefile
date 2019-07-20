.PHONY: bootstrap build cluster-create cluster-delete
#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)
PROJECT_ID=kubernetes-cicd-246207
ISTIO_VERSION=1.1.9
KNATIVE_VERSION=0.6.1
BASE_ZONE=cicd.benebsworth.com
DEFAULT_ZONE=default.cicd.benebsworth.com
TEKTON_ZONE=tekton-pipelines.cicd.benebsworth.com
TEKTON_PIPELINE_VERSION=v0.5.2
-include .credentials

define wait_for_deployment
	@printf "🌀 waiting for deployment $(2) to complete"; 
	@until kubectl get deployment -n $(1)  "$(2)" -o jsonpath='{.status.conditions[?(@.type=="Available")].status}' | grep -q True ; do printf "."; sleep 2 ; done;
	@printf "  ✅\n";
endef
define wait_for_ns_termination
	@printf "🌀 removing $(1) namespace";
	@while [ "$$(kubectl get namespace $(1) > /dev/null 2>&1; echo $$?)" = "0" ]; do printf "."; sleep 2; done;
	@printf " ✅\n";
endef
define wait_for_crds
	@printf "🌀 waiting for istio CRDs to synchronise"; 	
	@while [ $$(kubectl get customresourcedefinitions | grep istio.io | wc -l) -lt 50 ]; do printf "."; sleep 2; done;
	@printf " ✅\n";
endef
fetch.infra:
ifeq (,$(wildcard ./deploy/charts/istio-${ISTIO_VERSION}))
	@read -p "⚠️   Istio folder not found for v${ISTIO_VERSION}, Install Istio now?, Continue (Y/N): " confirm && echo $$confirm | grep -iq "^[yY]" || exit 1
	mkdir -p deploy/charts
	cd deploy/charts; curl -L https://git.io/getLatestIstio | ISTIO_VERSION=${ISTIO_VERSION} sh -
endif

## initialise project environment
init:

## create localubernetes cluster
local.cluster.create:
	minikube start --memory=13000 --cpus=7 \
  --kubernetes-version=v1.15.0 \
  --vm-driver=hyperkit \
  --disk-size=30g \
  --extra-config=apiserver.enable-admission-plugins="LimitRanger,NamespaceExists,NamespaceLifecycle,ResourceQuota,ServiceAccount,DefaultStorageClass,MutatingAdmissionWebhook"
	minikube addons enable registry
gke.cluster.create:
	time gcloud beta container clusters create kubernetes-cicd \
		--zone="australia-southeast1-a" \
		--machine-type="n1-standard-4" \
		--num-nodes="3" \
		--no-user-output-enabled \
		--scopes="https://www.googleapis.com/auth/cloud-platform" \
		--cluster-version 1.13.7-gke.8
	gcloud container clusters get-credentials kubernetes-cicd
gke.cluster.get-credentials:
	gcloud container clusters get-credentials kubernetes-cicd
## scale down cluster to 0, effectively pause mode
gke.cluster.pause:
	time gcloud -q container clusters resize kubernetes-cicd --num-nodes 0
gke.cluster.resume:
	time gcloud -q container clusters resize kubernetes-cicd --num-nodes 3
	gcloud container clusters get-credentials kubernetes-cicd
gke.cluster.delete:
	gcloud beta container clusters delete kubernetes-cicd --zone="australia-southeast1-a"
## configure DNS settings for IP assigned to ingress-gateway
gke.dns.update:
	@gcloud dns managed-zones create kubernetes-cicd --no-user-output-enabled --dns-name ${BASE_ZONE} --description="base zone" > /dev/null 2>&1 || echo " ✅   base zone ${BASE_ZONE} already exists"
	@gcloud dns managed-zones create default-namespace --no-user-output-enabled --dns-name ${DEFAULT_ZONE} --description="default namespace zone" > /dev/null 2>&1 || echo " ✅   default zone ${DEFAULT_ZONE} already exists"
	@gcloud dns managed-zones create tekton-namespace --no-user-output-enabled --dns-name ${TEKTON_ZONE} --description="tekton namespace zone" > /dev/null 2>&1 || echo " ✅  tekton zone ${TEKTON_ZONE} already exists"
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	gcloud dns record-sets transaction start --zone="default-namespace"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP. --name "*.${DEFAULT_ZONE}" --ttl=5 --type=A --zone="default-namespace"; \
	gcloud dns record-sets transaction execute --zone="default-namespace" > /dev/null 2>&1 || echo " ✅   recordsets for ${DEFAULT_ZONE} already exists" 
	rm -rf transaction.yaml
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	gcloud dns record-sets transaction start --zone="tekton-namespace"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP. --name "*.${TEKTON_ZONE}" --ttl=5 --type=A --zone="tekton-namespace"; \
	gcloud dns record-sets transaction execute --zone="tekton-namespace" || echo " ✅   recordsets for ${TEKTON_ZONE} already exists" 

local.cluster.patch:
	minikube addons enable registry
	@kubectl patch daemonset -n kube-system registry-proxy --type='json' -p='[ \
		{"op": "replace", "path": "/spec/selector/matchLabels", "value": { "kubernetes.io/minikube-addons": "registry-proxy", "addonmanager.kubernetes.io/mode":"Reconcile" } }, \
		{"op": "replace", "path": "/spec/template/metadata/labels", "value": { "kubernetes.io/minikube-addons": "registry-proxy", "addonmanager.kubernetes.io/mode":"Reconcile" } } \
		]'

local.istio.install: fetch.infra
	mkdir -p deploy/resources/istio/${ISTIO_VERSION}
	mkdir -p deploy/values/istio/${ISTIO_VERSION}/
	kubectl create namespace istio-system --dry-run -o yaml | kubectl apply -f -
	kubectl label namespace istio-system --overwrite istio-injection=disabled
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio-init --name istio-init --namespace istio-system > deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	$(call wait_for_crds)
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio --name istio --namespace istio-system  -f deploy/values/istio/${ISTIO_VERSION}/values.yaml > deploy/resources/istio/${ISTIO_VERSION}/istio.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio.yaml
gke.istio.install: fetch.infra
	mkdir -p deploy/resources/istio/${ISTIO_VERSION}
	mkdir -p deploy/values/istio/${ISTIO_VERSION}/
	kubectl create namespace istio-system --dry-run -o yaml | kubectl apply -f -
	kubectl label namespace istio-system --overwrite istio-injection=disabled
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio-init --name istio-init --namespace istio-system > deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	$(call wait_for_crds)
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio --name istio --namespace istio-system  -f deploy/values/istio/${ISTIO_VERSION}/values.yaml > deploy/resources/istio/${ISTIO_VERSION}/istio.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio.yaml

local.tekton.install:
	kubectl apply -f https://storage.googleapis.com/tekton-releases/latest/release.yaml
	
gke.tekton.install:
	kubectl apply -f https://github.com/tektoncd/pipeline/releases/download/${TEKTON_PIPELINE_VERSION}/release.yaml

gke.pipeline.create:
	@sed -e 's/_PROJECT_ID/${PROJECT_ID}/g' \
			-e 's/_GITHUB_STATUS_TOKEN/${GITHUB_STATUS_TOKEN}/g' \
			ci/gke/build.yaml | kubectl apply -n tekton-pipelines -f -
gke.pipeline.restart:
	kubectl delete -f ci/gke/build.yaml --ignore-not-found=true
	kubectl delete pipelinerun -n tekton-pipelines -l tekton.dev/pipeline=cicd-pipeline
	sed 's/_PROJECT_ID/${PROJECT_ID}/g' ci/gke/build.yaml | kubectl apply -n tekton-pipelines -f -

local.tekton-dashboard.install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd/
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/dashboard ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/dashboard.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/dashboard; git pull; kubectl apply -f config/release/gcr-tekton-dashboard.yaml
	

gke.tekton-dashboard.install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd/
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/dashboard ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/dashboard.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/dashboard; git pull; kubectl apply -f config/release/gcr-tekton-dashboard.yaml
	kubectl apply -f deploy/resources/tekton-dashboard/
local.tekton-listener.install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/experimental/tekton-listener ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/experimental.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/experimental/tekton-listener; dep ensure
	cd $$GOPATH/src/github.com/tektoncd/experimental/tekton-listener; KO_DOCKER_REPO=docker.io/castlemilk ko apply -f config
local.tekton-webhook.install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/experimental/tekton-listener ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/experimental.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; git pull; kubectl delete --ignore-not-found=true -f config/release/gcr-tekton-webhooks-extension.yaml
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; git pull; kubectl apply -f config/release/gcr-tekton-webhooks-extension.yaml
	kubectl delete pod -l app=tekton-dashboard -n tekton-pipelines
	@kubectl patch svc -n tekton-pipelines webhooks-extension --type='json' -p='[{"op": "replace", "path": "/metadata/annotations/tekton-dashboard-bundle-location", "value": "web/extension.c526c42e.js" }]'

gke.tekton-webhook.install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/experimental/tekton-listener ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/experimental.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; kubectl delete --ignore-not-found=true -f config/release/gcr-tekton-webhooks-extension.yaml
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; git pull; kubectl apply -f config/release/gcr-tekton-webhooks-extension.yaml
	kubectl delete pod -l app=tekton-dashboard -n tekton-pipelines
	@kubectl patch svc -n tekton-pipelines webhooks-extension --type='json' -p='[{"op": "replace", "path": "/metadata/annotations/tekton-dashboard-bundle-location", "value": "web/extension.8fc66494.js" }]'
	kubectl apply -f https://raw.githubusercontent.com/tektoncd/experimental/master/webhooks-extension/config/extension-service.yaml -n tekton-pipelines
gke.tekton-webhook.update:
	# @kubectl patch svc -n tekton-pipelines webhooks-extension --type='json' -p='[{"op": "replace", "path": "/metadata/annotations/tekton-dashboard-bundle-location", "value": "web/extension.8fc66494.js" }]'
	kubectl apply -f https://raw.githubusercontent.com/tektoncd/experimental/master/webhooks-extension/config/extension-service.yaml -n tekton-pipelines
local.knative.install:
	@if [ "${KNATIVE_VERSION}" == "0.7.1" ]; then \
		kubectl apply --selector knative.dev/crd-install=true \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-post-1.14.yaml \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing/releases/download/v0.7.1/release.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/v0.7.1/github.yaml; \
		sleep 10; \
		kubectl apply --selector networking.knative.dev/certificate-provider!=cert-manager \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-post-1.14.yaml \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing/releases/download/v0.7.1/release.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/v0.7.1/github.yaml; \
	elif [ "${KNATIVE_VERSION}" == "0.6.1" ]; then \
		kubectl apply --selector knative.dev/crd-install=true \
			--filename https://github.com/knative/serving/releases/download/v0.6.1/serving.yaml \
			--filename https://github.com/knative/eventing/releases/download/v0.6.1/release.yaml \
			--filename https://github.com/knative/eventing-contrib/releases/download/v0.6.0/eventing-sources.yaml; \
			sleep 10; \
			kubectl apply --selector networking.knative.dev/certificate-provider!=cert-manager \
			--filename https://github.com/knative/serving/releases/download/v0.6.1/serving.yaml \
			--filename https://github.com/knative/eventing/releases/download/v0.6.1/release.yaml \
			--filename https://github.com/knative/eventing-contrib/releases/download/v0.6.0/eventing-sources.yaml; \
	fi

gke.knative.install:
	@if [ "${KNATIVE_VERSION}" == "0.7.1" ]; then \
		kubectl apply --selector knative.dev/crd-install=true \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-post-1.14.yaml \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing/releases/download/v0.7.1/release.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/v0.7.1/github.yaml; \
		sleep 10; \
		kubectl apply --selector networking.knative.dev/certificate-provider!=cert-manager \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-post-1.14.yaml \
		--filename https://github.com/knative/serving/releases/download/v0.7.1/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing/releases/download/v0.7.1/release.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/v0.7.1/github.yaml; \
	elif [ "${KNATIVE_VERSION}" == "0.6.1" ]; then \
		kubectl apply --selector knative.dev/crd-install=true \
			--filename https://github.com/knative/serving/releases/download/v0.6.1/serving.yaml \
			--filename https://github.com/knative/eventing/releases/download/v0.6.1/release.yaml \
			--filename https://github.com/knative/eventing-contrib/releases/download/v0.6.0/eventing-sources.yaml; \
			sleep 10; \
			kubectl apply --selector networking.knative.dev/certificate-provider!=cert-manager \
			--filename https://github.com/knative/serving/releases/download/v0.6.1/serving.yaml \
			--filename https://github.com/knative/eventing/releases/download/v0.6.1/release.yaml \
			--filename https://github.com/knative/eventing-contrib/releases/download/v0.6.0/eventing-sources.yaml; \
	fi

local.knative.status:
	kubectl get pods --namespace knative-serving 
	kubectl get pods --namespace knative-build
	kubectl get pods --namespace knative-eventing
	kubectl get pods --namespace knative-sources
	kubectl get pods --namespace knative-monitoring
## build project
build.webapp:
	go build -o webapp/bin/webapp ./webapp/cmd/webapp
docker.login:
	gcloud components install docker-credential-gcr
	docker-credential-gcr configure-docker
	gcloud auth configure-docker
## run project
run.webapp:
	webapp/bin/webapp

## start slidepack
run.slides:
	cd slides; npm run start

## install tekton to target cluster
tekton.install:
	kubectl create clusterrolebinding cluster-admin-binding --clusterrole cluster-admin --user ben.ebsworth@digio.com.au --dry-run -o yaml | kubectl apply -f -
	sleep 3
	kubectl apply -f https://storage.googleapis.com/tekton-releases/latest/release.yaml
docker.registry.create:
	docker run -d -p 5000:5000 --name registry-srv -e REGISTRY_STORAGE_DELETE_ENABLED=true registry:2
clean.skaffold:
	pkill -f skaffold

cluster.gke.install:
	time gcloud container clusters create dev-xp \
		--zone="australia-southeast1-a" \
		--machine-type="n1-standard-2" \
		--num-nodes="3" \
		--project="${PROJECT_ID}" \
		--no-user-output-enabled \
		--scopes="https://www.googleapis.com/auth/cloud-platform"

clean.knative:
	# kubectl delete --ignore-not-found namespace knative-serving 
	kubectl delete --ignore-not-found namespace knative-eventing
	kubectl delete --ignore-not-found namespace knative-sources 
	kubectl delete --ignore-not-found namespace knative-monitoring
	kubectl delete --ignore-not-found namespace knative-build

clean:
	kubectl delete --ignore-not-found namespace istio-system
	kubectl delete --ignore-not-found namespace knative-serving 
	kubectl delete --ignore-not-found namespace knative-eventing
	kubectl delete --ignore-not-found namespace knative-sources 
	kubectl delete --ignore-not-found namespace knative-monitoring
	kubectl delete --ignore-not-found namespace knative-build

###Help
## Show help
help:
	@echo ''
	@echo '######################### TRAINING MANAGER #########################'
	@echo ''
	@echo ''
	@echo 'Usage:'
	@echo ''
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk '/(^[a-zA-Z\-\.\_0-9]+:)|(^###[a-zA-Z]+)/ { \
		header = match($$1, /^###(.*)/); \
		if (header) { \
			title = substr($$1, 4, length($$1)); \
			printf "${CYAN}%s${RESET}\n", title; \
		} \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")-1); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW}%-$(TARGET_MAX_CHAR_NUM)s${RESET} ${GREEN}%s${RESET}\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)