.PHONY: talk.start test.example
#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

-include common.mk 

# run resolved task
run:
	$(MAKET)

all.gstack.local: components.kubernetes.minikube.create components.istio.install components.knative.install components.tekton.pipeline.install components.tekton.dashboard.install components.tekton.triggers.install

all.gstack.gke: components.kubernetes.gke.create components.istio.install components.knative.install components.tekton.pipeline.install components.tekton.dashboard.install components.tekton.triggers.install

###Kubernetes
## install minikube based kubernetes cluster
components.kubernetes.minikube.create: run

## destroy minikube based kubernetes cluster
components.kubernetes.minikube.destroy: run

## install gke based kubernetes cluster
components.kubernetes.gke.create: run

## destroy gke based kubernetes cluster (careful)
components.kubernetes.gke.destroy: run

## pause cluster (scale workers down)
components.kubernetes.gke.pause: run

## resume cluster (scale workers up)
components.kubernetes.gke.resume: run

## install eks based kubernetes cluster
components.kubernetes.eks.create: run

## destroy eks based kubernetes cluster
components.kubernetes.eks.destroy: run

###Istio
## install istio
components.istio.install: run

## uninstall istio
components.istio.uninstall: run

###Knative
## install knative
components.knative.install: run

## uninstall knative
components.knative.uninstall: run

###Tekton
## install tekton pipelines
components.tekton.pipeline.install: run

## uninstall tekton pipelines
components.tekton.pipeline.uninstall: run

## install tekton dashboard
components.tekton.dashboard.install: run

## uninstall tekton dashboard
components.tekton.dashboard.uninstall: run

## install tekton dashboard webhook plugin
components.tekton.webhook.install: run

## uninstall tekton dashboard webhook plugin
components.tekton.webhook.uninstall: run

## install tekton triggers 
components.tekton.triggers.install: run

## uninstall tekton triggers
components.tekton.triggers.uninstall: run

###Pipelines

## create tekton cicd pipeline
pipelines.tekton.create: run

## delete tekton cicd pipeline
pipelines.tekton.delete: run

###Application-Development
## run integration tests against dependencies
app.backend-integrationtest: run

## run linting/formatting
app.lint: run
## run unit tests
app.backend-unittest: run

## start local development deployment
app.local-development: run

## start staging development deployment
app.staging-development: run

## deploy to prod directly (careful)
app.production-deploy: run


###Talk
## start talk locally
talk.start: run

## build talk bundle.js
talk.build: run
###Help
## Show help
help:
	@echo ''
	@echo '######################### CICD FRAMEWORK MANAGER #########################'
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