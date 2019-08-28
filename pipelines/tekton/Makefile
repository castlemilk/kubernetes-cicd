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

## create tekton pipeline
create:
	sed \
		-e 's/_PROJECT_ID/${PROJECT_ID}/g' \
		-e 's/_GITHUB_STATUS_TOKEN/${GITHUB_STATUS_TOKEN}/g' \
		${CLUSTER}/cicd.yaml | kubectl apply -n tekton-pipelines -f -

## delete tekton pipeline
delete:
	sed \
		-e 's/_PROJECT_ID/${PROJECT_ID}/g' \
		-e 's/_GITHUB_STATUS_TOKEN/${GITHUB_STATUS_TOKEN}/g' \
		${CLUSTER}/cicd.yaml | kubectl delete -n tekton-pipelines -f -

## re-create pipeline
recreate: delete create

###Help
## Show help
help:
	@echo ''
	@echo '######################### PIPELINE MANAGER #########################'
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