#!/usr/bin/env bash

CURRENT_CONTEXT=$(kubectl config current-context)
echo -e "\033[01;31mWarning: this will permanently delete all yeti resources, existing model deployments, and in-cluster minio, postgresql DB data. Note that external DB and blob storage will not be deleted.\033[00m"
echo -e "\033[01;31mWarning: this also means that all resources under the \033[00m\033[01;32myeti\033[00m, \033[00m\033[01;32myeti-system\033[00m, \033[00m\033[01;32myeti-operators\033[00m, and \033[00m\033[01;32myeti-components\033[00m \033[01;31mnamespaces will be permanently deleted.\033[00m"
echo -e "\033[01;31mCurrent kubernetes context: \033[00m\033[01;32m$CURRENT_CONTEXT\033[00m"
read -p "Are you sure to delete yeti in cluster '$CURRENT_CONTEXT'? [y/n] " -n 1 -r
echo # move to a new line
read -p "(Double check) Are you sure to delete yeti in cluster '$CURRENT_CONTEXT'? [y/n] " -n 1 -r
echo # move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
fi

echo "Uninstalling yeti helm chart from cluster.."
set -x
helm list -n yeti-system | tail -n +2 | awk '{print $1}' | xargs -I{} helm -n yeti-system uninstall {}
set +x

echo "Uninstalling yeti-deployment helm chart from cluster.."
set -x
helm list -n yeti-deployment | tail -n +2 | awk '{print $1}' | xargs -I{} helm -n yeti-deployment uninstall {}
set +x

echo "Deleting all crd resources and mlDeployment.."
set -x
kubectl delete crd mldeployments.serving.yeti.ai
kubectl delete crd deployments.component.yeti.ai
set +x

echo "Removing additional yeti related namespaces and resources.."
set -x
kubectl delete namespace yeti
kubectl delete namespace yeti-deployment
kubectl delete namespace yeti-system
set +x

echo "Done"
