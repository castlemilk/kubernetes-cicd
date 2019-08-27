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