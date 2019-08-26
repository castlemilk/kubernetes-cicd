#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

-include .credentials
-include local.parameters
-include ${CLUSTER}.parameters
-include common.mk 

## test backend app
unittest.backend:
	cd app/src/backend; go clean -testcache
	cd app/src/backend; go test ./... -mod=vendor -run=Unit -v

## integration test backend app
integrationtest.backend:
	cd app/src/backend; go clean -testcache	
	cd app/src/backend; go test ./... -mod=vendor -run=Integration -v

open.local:
	@BACKEND_ADDRESS=`kubectl get svc products-backend --namespace development --output 'jsonpath={.spec.clusterIP}'`; \
	if grep -i "api.demo.local" /etc/hosts; then \
		sudo sed -i -e "s/.*api.demo.local/$$BACKEND_ADDRESS api.demo.local/" /etc/hosts; \
	else \
		echo "$$BACKEND_ADDRESS api.demo.local" | sudo tee -a /etc/hosts; \
	fi
	@FRONTEND_ADDRESS=`kubectl get svc products-frontend --namespace development --output 'jsonpath={.spec.clusterIP}'`; \
	if grep -i "products.demo.local" /etc/hosts; then \
		sudo sed -i -e "s/.*products.demo.local/$$FRONTEND_ADDRESS products.demo.local/" /etc/hosts; \
	else \
		echo "$$FRONTEND_ADDRESS products.demo.local" | sudo tee -a /etc/hosts; \
	fi
	open http://products.demo.local

## start local development
local.dev:
	@eval $(minikube docker-env)
	kubectx minikube
	@kubectl create namespace dev --dry-run -o yaml | kubectl apply -f -
	ENV=local skaffold run -p local
	@kubectl wait -n dev deployment products-backend --for condition=available
	@BACKEND_ADDRESS=`kubectl get svc products-backend --namespace dev --output 'jsonpath={.spec.clusterIP}'`; \
	if grep -i "api.demo.local" /etc/hosts; then \
		sudo sed -i -e "s/.*api.demo.local/$$BACKEND_ADDRESS api.demo.local/" /etc/hosts; \
	else \
		echo "$$BACKEND_ADDRESS api.demo.local" | sudo tee -a /etc/hosts; \
	fi
	@FRONTEND_ADDRESS=`kubectl get svc products-frontend --namespace dev --output 'jsonpath={.spec.clusterIP}'`; \
	if grep -i "products.demo.local" /etc/hosts; then \
		sudo sed -i -e "s/.*products.demo.local/$$FRONTEND_ADDRESS products.demo.local/" /etc/hosts; \
	else \
		echo "$$FRONTEND_ADDRESS products.demo.local" | sudo tee -a /etc/hosts; \
	fi
	while [ "$$(curl -sSL -o /dev/null -w ''%{http_code}'' http://products.demo.local)" != "200" ]; do printf "."; sleep 1; done
	while [ "$$(curl -sSL -o /dev/null -w ''%{http_code}'' http://api.demo.local/api/v1/products)" != "200" ]; do printf "."; sleep 1; done
	open http://products.demo.local
	ENV=local skaffold dev -p local

staging.dev:
	@eval $(minikube docker-env)
	@kubectx gke_kubernetes-cicd-246207_australia-southeast1-a_kubernetes-cicd
	@kubectl create namespace np --dry-run -o yaml | kubectl apply -f -
	ENV=staging skaffold dev -p staging --cleanup=false --no-prune=true
	open http://products.np.cicd.benebsworth.com

prod.restart:
	@kubectx gke_kubernetes-cicd-246207_australia-southeast1-a_kubernetes-cicd
	skaffold run -p production-full

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

clean.skaffold:
	pkill -f skaffold

###Help
## Show help
help:
	@echo ''
	@echo '######################### APP MANAGER #########################'
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