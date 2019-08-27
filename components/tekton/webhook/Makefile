#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

TOPLVL=../../..
-include $(TOPLVL)/common.mk

## install webhook plugin
install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/experimental/tekton-listener ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/experimental.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; kubectl delete --ignore-not-found=true -f config/release/gcr-tekton-webhooks-extension.yaml
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; git stash; git pull origin master; kubectl apply -f config/release/gcr-tekton-webhooks-extension.yaml
	kubectl delete pod -l app=tekton-dashboard -n tekton-pipelines
	@kubectl patch svc -n tekton-pipelines webhooks-extension --type='json' -p='[{"op": "replace", "path": "/metadata/annotations/tekton-dashboard-bundle-location", "value": "web/extension.96c06bbb.js" }]'
	kubectl apply -f https://raw.githubusercontent.com/tektoncd/experimental/master/webhooks-extension/config/extension-service.yaml -n tekton-pipelines

## remove webhook plugin
uninstall:
	cd $$GOPATH/src/github.com/tektoncd/experimental/webhooks-extension; kubectl delete --ignore-not-found=true -f config/release/gcr-tekton-webhooks-extension.yaml

###Help
## Show help
help:
	@echo ''
	@echo '######################### TEKTON MANAGER #########################'
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