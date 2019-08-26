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

env:
	@echo "${DEFAULT_ZONE}"
## uninstall tekton dashboard
install:
	@mkdir -p $$GOPATH/src/github.com/tektoncd/
	@if [ ! -d $$GOPATH/src/github.com/tektoncd/dashboard ]; then \
		cd $$GOPATH/src/github.com/tektoncd; git clone git@github.com:tektoncd/dashboard.git; \
	fi
	cd $$GOPATH/src/github.com/tektoncd/dashboard; git pull; kubectl apply -f config/release/gcr-tekton-dashboard.yaml
	kubectl apply -f resources/tekton-dashboard/

## install tekton dashboard
uninstall:
	cd $$GOPATH/src/github.com/tektoncd/dashboard; kubectl delete -f config/release/gcr-tekton-dashboard.yaml

###Help
## Show help
help:
	@echo ''
	@echo '######################### TEKTON DASHBOARD MANAGER #########################'
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