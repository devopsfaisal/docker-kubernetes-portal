/**
 * Docker & Kubernetes Production Cheatsheet Data
 */

window.CHEATSHEETS_DATA = [
  {
    "category": "Docker CLI Essentials",
    "icon": "fa-brands fa-docker",
    "description": "Daily-use Docker commands for container and image lifecycle operations.",
    "items": [
      { "cmd": "docker run -d -p 8080:80 --name web nginx:alpine", "desc": "Run container in detached background mode with port forwarding host 8080 -> container 80" },
      { "cmd": "docker ps -a", "desc": "List all containers (both active running and stopped/exited)" },
      { "cmd": "docker exec -it <container_id> sh", "desc": "Open an interactive terminal shell inside a live running container" },
      { "cmd": "docker logs -f --tail 100 <container_id>", "desc": "Stream real-time STDOUT/STDERR logs of a container" },
      { "cmd": "docker stop $(docker ps -q)", "desc": "Gracefully stop all currently running containers in one command" },
      { "cmd": "docker system prune -a --volumes -f", "desc": "Deep purge: remove all stopped containers, unused networks, dangling images & anonymous volumes" },
      { "cmd": "docker inspect <container_id>", "desc": "Display low-level JSON configuration, IP address, environment variables and mounts" }
    ]
  },
  {
    "category": "Dockerfile Directive Reference",
    "icon": "fa-solid fa-file-code",
    "description": "Standard instructions for constructing lean, secure container images.",
    "items": [
      { "cmd": "FROM <image>:<tag> AS <stage>", "desc": "Specifies base image and optionally names build stage for multi-stage builds" },
      { "cmd": "RUN <command>", "desc": "Executes commands during build time and commits a new read-only image layer" },
      { "cmd": "CMD [\"executable\", \"param1\"]", "desc": "Default arguments provided to the container entrypoint (easily overridden via CLI)" },
      { "cmd": "ENTRYPOINT [\"executable\"]", "desc": "Configures a container that will run as an executable; parameters are appended" },
      { "cmd": "WORKDIR /app", "desc": "Sets the active working directory for RUN, CMD, ENTRYPOINT, COPY and ADD" },
      { "cmd": "COPY --chown=app:app . /app", "desc": "Copies files from host context with proper non-root ownership permissions" },
      { "cmd": "EXPOSE <port>", "desc": "Documents the network port on which the container listens at runtime" }
    ]
  },
  {
    "category": "Kubectl Imperative Masterclass",
    "icon": "fa-solid fa-dharmachakra",
    "description": "High-velocity kubectl commands for cluster administration and CKA exam efficiency.",
    "items": [
      { "cmd": "kubectl get pods -A -o wide", "desc": "List all pods across all namespaces with IP address and node placement columns" },
      { "cmd": "kubectl run nginx --image=nginx:alpine --dry-run=client -o yaml > pod.yaml", "desc": "Instantly generate clean, error-free Pod YAML manifest without deploying" },
      { "cmd": "kubectl create deploy web --image=nginx --replicas=3", "desc": "Imperatively deploy a 3-replica Deployment" },
      { "cmd": "kubectl expose deploy web --port=80 --target-port=8080 --type=NodePort", "desc": "Expose a deployment externally via a NodePort Service" },
      { "cmd": "kubectl rollout status deploy/web", "desc": "Monitor live progress of a rolling deployment update" },
      { "cmd": "kubectl rollout undo deploy/web --to-revision=1", "desc": "Immediately rollback deployment to a specified prior stable revision" },
      { "cmd": "kubectl top nodes --sort-by=cpu", "desc": "Monitor real-time node CPU and RAM consumption sorted by highest load" }
    ]
  },
  {
    "category": "Kubernetes RBAC & Security",
    "icon": "fa-solid fa-shield-halved",
    "description": "Role-Based Access Control commands and permission auditing.",
    "items": [
      { "cmd": "kubectl create role pod-reader --verb=get,list,watch --resource=pods -n dev", "desc": "Create a namespace-scoped Role with read-only verbs on pods" },
      { "cmd": "kubectl create rolebinding dev-bind --role=pod-reader --user=john -n dev", "desc": "Bind role to user john strictly inside dev namespace" },
      { "cmd": "kubectl create clusterrolebinding admin-bind --clusterrole=admin --user=sara", "desc": "Grant cluster-wide admin privileges to user sara" },
      { "cmd": "kubectl auth can-i create deployments --as=john -n dev", "desc": "Test whether user john has authorization to perform an API action" },
      { "cmd": "kubectl create secret docker-registry regcred --docker-server=... --docker-username=...", "desc": "Create imagePullSecret for private registry authentication" }
    ]
  },
  {
    "category": "CKA Cluster Recovery & Maintenance",
    "icon": "fa-solid fa-triangle-exclamation",
    "description": "Disaster recovery, node maintenance, and cluster troubleshooting commands.",
    "items": [
      { "cmd": "ETCDCTL_API=3 etcdctl snapshot save /tmp/backup.db --cacert=... --cert=... --key=...", "desc": "Take cryptographic backup snapshot of etcd cluster state" },
      { "cmd": "ETCDCTL_API=3 etcdctl snapshot status /tmp/backup.db --write-out=table", "desc": "Verify snapshot file integrity, total revisions and hash" },
      { "cmd": "kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data --force", "desc": "Safely evict all workloads from a node prior to OS upgrades or maintenance" },
      { "cmd": "kubectl uncordon <node-name>", "desc": "Mark a cordoned node as schedulable again after maintenance is completed" },
      { "cmd": "journalctl -u kubelet -n 100 --no-pager", "desc": "Inspect systemd kubelet agent logs on a NotReady worker node" }
    ]
  }
];
