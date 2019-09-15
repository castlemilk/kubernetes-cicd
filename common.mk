-include env/local.parameters.default
-include env/local.credentials.default
-include env/${CLUSTER}.parameters
-include env/${CLUSTER}.credentials


-include $(TOPLVL)/env/local.parameters.default
-include $(TOPLVL)/env/local.credentials.default
-include $(TOPLVL)/env/${CLUSTER}.parameters
-include $(TOPLVL)/env/${CLUSTER}.credentials


# will auto-resolve the directory to change into based off top-level makefile target
# e.g. components.istio.install -> make -c components/istio/ install
# where there will be a makefile target in this resolved directory
MAKET=$(MAKE) -C $(dir $(subst .,/,$(MAKECMDGOALS))) $(notdir $(subst .,/,$(MAKECMDGOALS))) 


define wait_for_deployment
	@printf "🌀   waiting for deployment $(2) to complete";                                         ions[?(@.type=="Available")].status}' | grep -q True ; do printf "."; sleep 2 ; done;
	@printf "  ✅\n";
endef

define log_environment
	@printf "🧬   ${CLUSTER} environment selected \n"
endef

define gcp_create_dns_entry
	@GATEWAY_IP=`kubectl get svc istio-ingressgateway --namespace istio-system --output jsonpath="{.status.loadBalancer.ingress[*]['ip']}"`; \
	printf "📇  Creating record for $(1) --> $$GATEWAY_IP in zone $(2) \n"; \
	CURRENT_IP=`gcloud dns record-sets list --zone="$(2)" --name="$(1)" --format=json | jq -r ".[0].rrdatas[0]"`; \
	gcloud dns record-sets transaction start --zone="$(2)"; \
	gcloud dns record-sets transaction remove $$CURRENT_IP --name "$(1)" --ttl=5 --type=A --zone="$(2)"; \
	gcloud dns record-sets transaction add $$GATEWAY_IP --name "$(1)" --ttl=5 --type=A --zone="$(2)"; \
	gcloud dns record-sets transaction execute --zone="$(2)"
	@rm -rf transaction.yaml
endef

define wait_for_ns_termination
	
	@printf "🌀   removing $(1) namespace";
	@while [ "$$(kubectl get namespace $(1) > /dev/null 2>&1; echo $$?)" = "0" ]; do printf "."; sleep 2; done;
	@printf " ✅\n";
endef

define wait_for_crds
	@printf "🌀   waiting for istio CRDs to synchronise"; 	
	@while [ $$(kubectl get customresourcedefinitions | grep istio.io | wc -l) -lt 20 ]; do printf "."; sleep 2; done;
	@printf " ✅\n";
endef