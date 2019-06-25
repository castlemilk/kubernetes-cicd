.PHONY: bootstrap build cluster-create cluster-delete
#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)
PROJECT_ID=developer-experience-239709
ISTIO_VERSION=1.1.9

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

local.istio.install: fetch.infra
	mkdir -p deploy/resources/istio/${ISTIO_VERSION}
	mkdir -p deploy/values/istio/${ISTIO_VERSION}/
	kubectl create namespace istio-system --dry-run -o yaml | kubectl apply -f -
	kubectl label namespace istio-system --overwrite istio-injection=disabled
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio-init --name istio-init --namespace istio-system > deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio-init.yaml
	helm template deploy/charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio --name istio --namespace istio-system  -f deploy/values/istio/${ISTIO_VERSION}/values.yaml > deploy/resources/istio/${ISTIO_VERSION}/istio.yaml
	kubectl apply -f deploy/resources/istio/${ISTIO_VERSION}/istio.yaml

local.knative.install:
	kubectl apply --selector knative.dev/crd-install=true \
	--filename https://github.com/knative/serving/releases/download/v0.6.1/serving.yaml \
	--filename https://github.com/knative/eventing/releases/download/v0.6.0/release.yaml \
	--filename https://github.com/knative/eventing-sources/releases/download/v0.6.0/eventing-sources.yaml \
	--filename https://github.com/knative/serving/releases/download/v0.6.0/monitoring.yaml \
	--filename https://raw.githubusercontent.com/knative/serving/v0.6.1/third_party/config/build/clusterrole.yaml
	sleep 10;
	kubectl apply --selector networking.knative.dev/certificate-provider!=cert-manager \
	--filename https://github.com/knative/serving/releases/download/v0.6.1/serving.yaml \
	--filename https://github.com/knative/eventing/releases/download/v0.6.0/release.yaml \
	--filename https://github.com/knative/eventing-sources/releases/download/v0.6.0/eventing-sources.yaml \
	--filename https://github.com/knative/serving/releases/download/v0.6.1/monitoring.yaml \
	--filename https://raw.githubusercontent.com/knative/serving/v0.6.1/third_party/config/build/clusterrole.yaml

local.knative.status:
	kubectl get pods --namespace knative-serving 
	kubectl get pods --namespace knative-build
	kubectl get pods --namespace knative-eventing
	kubectl get pods --namespace knative-sources
	kubectl get pods --namespace knative-monitoring
## build project
build.webapp:
	go build -o webapp/bin/webapp ./webapp/cmd/webapp

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