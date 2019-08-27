#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

TOPLVL=../..
-include $(TOPLVL)/common.mk

## install knative stack
install:
	kubectl apply --selector knative.dev/crd-install=true \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving.yaml \
		--filename https://github.com/knative/eventing/releases/download/${KNATIVE_VERSION}/release.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/monitoring.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-alpha-crds.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/${KNATIVE_VERSION}/github.yaml
	sleep 10
	kubectl apply \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving.yaml \
		--filename https://github.com/knative/eventing/releases/download/${KNATIVE_VERSION}/release.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/monitoring.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-alpha-crds.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/${KNATIVE_VERSION}/github.yaml

	kubectl apply -f resources/ingress
## check knative status
status:
	kubectl get pods --namespace knative-serving 
	kubectl get pods --namespace knative-build
	kubectl get pods --namespace knative-eventing
	kubectl get pods --namespace knative-sources
	kubectl get pods --namespace knative-monitoring

uninstall:
	kubectl delete --ignore-not-found=true \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving.yaml \
		--filename https://github.com/knative/eventing/releases/download/${KNATIVE_VERSION}/release.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/monitoring.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-alpha-crds.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/${KNATIVE_VERSION}/github.yaml
	sleep 10
	kubectl delete --selector knative.dev/crd-install=true --ignore-not-found=true \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving.yaml \
		--filename https://github.com/knative/eventing/releases/download/${KNATIVE_VERSION}/release.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/monitoring.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-alpha-crds.yaml \
		--filename https://github.com/knative/serving/releases/download/${KNATIVE_VERSION}/serving-beta-crds.yaml \
		--filename https://github.com/knative/eventing-contrib/releases/download/${KNATIVE_VERSION}/github.yaml
	@kubectl delete --ignore-not-found=true namespace knative-serving 
	@kubectl delete --ignore-not-found=true namespace knative-build
	@kubectl delete --ignore-not-found=true namespace knative-eventing 
	@kubectl delete --ignore-not-found=true namespace knative-sources
	@kubectl delete --ignore-not-found=true namespace knative-monitoring 
	$(call wait_for_ns_termination,knative-serving)
	$(call wait_for_ns_termination,knative-build)
	$(call wait_for_ns_termination,knative-eventing)
	$(call wait_for_ns_termination,knative-sources)
	$(call wait_for_ns_termination,knative-monitoring)
	kubectl delete --ignore-not-found=true services.serving --all-namespaces 


	###Help
## Show help
help:
	@echo ''
	@echo '######################### KNATIVE MANAGER #########################'
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