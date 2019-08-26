#❌⚠️✅
# COLORS
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
RED		 := $(shell tput -Txterm setaf 1)
CYAN	 := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

-include ../../common.mk 

## create large local kubernetes cluster
create:
	minikube start --memory=4000 --cpus=3 \
  --vm-driver=hyperkit \
  --extra-config=apiserver.enable-admission-plugins="LimitRanger,NamespaceExists,NamespaceLifecycle,ResourceQuota,ServiceAccount,DefaultStorageClass,MutatingAdmissionWebhook"
	minikube addons enable registry
## create large local kubernetes cluster
create.large:
	minikube start --memory=13000 --cpus=7 \
  --vm-driver=hyperkit \
  --extra-config=apiserver.enable-admission-plugins="LimitRanger,NamespaceExists,NamespaceLifecycle,ResourceQuota,ServiceAccount,DefaultStorageClass,MutatingAdmissionWebhook"
	minikube addons enable registry


delete:
	minikube delete