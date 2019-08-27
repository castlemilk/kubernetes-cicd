#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

-include ../../common.mk
-include ../../env/${CLUSTER}.parameters
## create GKE cluster
create:
	time gcloud beta container clusters create kubernetes-cicd \
		--zone="australia-southeast1-a" \
		--machine-type="n1-standard-4" \
		--num-nodes="3" \
		--no-user-output-enabled \
		--scopes="https://www.googleapis.com/auth/cloud-platform" \
		--cluster-version 1.13.7-gke.8
	gcloud container clusters get-credentials kubernetes-cicd

## get GKE credentials and context
get-credentials:
	gcloud container clusters get-credentials kubernetes-cicd

## scale down cluster to 0, effectively pause mode
pause:
	time gcloud -q container clusters resize kubernetes-cicd --num-nodes 0

## scale the gke cluster's worker nodes up, enabling Pod's to be scheduled
resume:
	time gcloud -q container clusters resize kubernetes-cicd --num-nodes 3
	gcloud container clusters get-credentials kubernetes-cicd
	sleep 30
	kubectl scale deployment -n knative-serving webhook --replicas 2
	kubectl scale deployment -n knative-serving webhook --replicas 1

## delete gke cluster
destroy:
	gcloud beta container clusters delete kubernetes-cicd --zone="australia-southeast1-a"

## configure DNS settings for IP assigned to ingress-gateway
dns.update:
	@gcloud dns managed-zones create kubernetes-cicd --no-user-output-enabled --dns-name ${BASE_ZONE} --description="base zone" > /dev/null 2>&1 || echo " ✅   base zone ${BASE_ZONE} already exists"
	@gcloud dns managed-zones create default-namespace --no-user-output-enabled --dns-name ${DEFAULT_ZONE} --description="default namespace zone" > /dev/null 2>&1 || echo " ✅   default zone ${DEFAULT_ZONE} already exists"
	@gcloud dns managed-zones create tekton-namespace --no-user-output-enabled --dns-name ${TEKTON_ZONE} --description="tekton namespace zone" > /dev/null 2>&1 || echo " ✅  tekton zone ${TEKTON_ZONE} already exists"
	@gcloud dns managed-zones create non-prod-namespace --no-user-output-enabled --dns-name ${NP_ZONE} --description="tekton non-prod zone" > /dev/null 2>&1 || echo " ✅  tekton zone ${NP_ZONE} already exists"
	@gcloud dns managed-zones create prod-namespace --no-user-output-enabled --dns-name ${PROD_ZONE} --description="tekton production zone" > /dev/null 2>&1 || echo " ✅  tekton zone ${PROD_ZONE} already exists"
	rm -rf transaction.yaml
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	gcloud dns record-sets transaction start --zone="default-namespace"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP --name "*.${DEFAULT_ZONE}." --ttl=5 --type=A --zone="default-namespace"; \
	gcloud dns record-sets transaction execute --zone="default-namespace" > /dev/null 2>&1 || echo " ✅   recordsets for ${DEFAULT_ZONE} already exists" 
	rm -rf transaction.yaml
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	gcloud dns record-sets transaction start --zone="tekton-namespace"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP --name "*.${TEKTON_ZONE}." --ttl=5 --type=A --zone="tekton-namespace"; \
	gcloud dns record-sets transaction execute --zone="tekton-namespace" > /dev/null 2>&1 || echo " ✅   recordsets for ${TEKTON_ZONE} already exists" 
	rm -rf transaction.yaml
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	gcloud dns record-sets transaction start --zone="non-prod-namespace"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP --name "*.${NP_ZONE}." --ttl=5 --type=A --zone="non-prod-namespace"; \
	gcloud dns record-sets transaction execute --zone="non-prod-namespace" > /dev/null 2>&1 || echo " ✅   recordsets for ${NP_ZONE} already exists"
	rm -rf transaction.yaml
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	gcloud dns record-sets transaction start --zone="prod-namespace"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP --name "*.${PROD_ZONE}." --ttl=5 --type=A --zone="prod-namespace"; \
	gcloud dns record-sets transaction execute --zone="prod-namespace" > /dev/null 2>&1 || echo " ✅   recordsets for ${PROD_ZONE} already exists" 
###Help
## Show help
help:
	@echo ''
	@echo '######################### GKE CLUSTER MANAGER #########################'
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