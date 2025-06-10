#!/bin/bash
kubectl get namespaces --no-headers | awk '/^job-/ {print $1}' | xargs -n1 -P0 kubectl delete namespace --ignore-not-found &>/dev/null &