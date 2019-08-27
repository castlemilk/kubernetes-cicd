#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

TOPLVL = ../..

-include $(TOPLVL)/common.mk

## fetch depdencies
fetch.infra:
ifeq (,$(wildcard ./charts/istio-${ISTIO_VERSION}))
	@read -p "⚠️   Istio folder not found for v${ISTIO_VERSION}, Install Istio now?, Continue (Y/N): " confirm && echo $$confirm | grep -iq "^[yY]" || exit 1
	@mkdir -p deploy/charts
	@cd charts; curl -L https://git.io/getLatestIstio | ISTIO_VERSION=${ISTIO_VERSION} sh -
	@echo "✅  chart (version: ${ISTIO_VERSION}) downloaded"
else
	@echo "✅  chart (version: ${ISTIO_VERSION}) downloaded already"
endif

## install istio
install: fetch.infra
	mkdir -p resources/${CLUSTER}/${ISTIO_VERSION}
	mkdir -p values/${CLUSTER}/${ISTIO_VERSION}/
	kubectl create namespace istio-system --dry-run -o yaml | kubectl apply -f -
	kubectl label namespace istio-system --overwrite istio-injection=disabled
	helm template charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio-init --name istio-init --namespace istio-system > resources/${CLUSTER}/${ISTIO_VERSION}/istio-init.yaml
	kubectl delete jobs --all -n istio-system
	kubectl apply -f resources/${CLUSTER}/${ISTIO_VERSION}/istio-init.yaml
	$(call wait_for_crds)
	helm template charts/istio-${ISTIO_VERSION}/install/kubernetes/helm/istio --name istio --namespace istio-system  -f values/${CLUSTER}/${ISTIO_VERSION}/values.yaml > resources/${CLUSTER}/${ISTIO_VERSION}/istio.yaml
	kubectl apply -f resources/${CLUSTER}/${ISTIO_VERSION}/istio.yaml

## uninstall istio from cluster
uninstall:
	$(call wait_for_ns_termination,istio-system)
###Help
## Show help
help:
	@echo ''
	@echo '######################### ISTIO MANAGER #########################'
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