/**
 * KR Network Cloud - Docker & Kubernetes Exam Quiz Bank
 */

window.QUIZ_DATA = [
  {
    "id": 1,
    "category": "Docker",
    "question": "What is the primary difference between a Docker Image and a Docker Container?",
    "options": [
      "A container is a read-only template, while an image is the live running process.",
      "An image is an immutable read-only blueprint; a container is a live running instance with a thin writable layer.",
      "Images use hypervisors, while containers use bare metal.",
      "Containers can only run on Linux, while images can run anywhere."
    ],
    "correct": 1,
    "explanation": "Docker images are immutable, multi-layered read-only blueprints. When you run an image, Docker adds a thin read-write Container layer on top using the storage driver (like overlay2)."
  },
  {
    "id": 2,
    "category": "Docker",
    "question": "Which Linux kernel feature provides process isolation (PID, Network, Mount) for Docker containers?",
    "options": [
      "Control Groups (cgroups)",
      "Linux Namespaces",
      "SELinux Enforcing Mode",
      "Systemd unit files"
    ],
    "correct": 1,
    "explanation": "Linux Namespaces provide workspace isolation (PID, NET, MNT, IPC, UTS, USER). Control Groups (cgroups) provide resource metering and limits (CPU, RAM, I/O)."
  },
  {
    "id": 3,
    "category": "Docker",
    "question": "In a Dockerfile, what is the key difference between CMD and ENTRYPOINT?",
    "options": [
      "CMD commands execute at build time, while ENTRYPOINT executes at runtime.",
      "ENTRYPOINT defines the fixed executable, while CMD provides default parameters that are easily overridden via CLI arguments.",
      "CMD requires JSON syntax, while ENTRYPOINT only supports shell form.",
      "There is no difference; they are interchangeable aliases."
    ],
    "correct": 1,
    "explanation": "ENTRYPOINT sets the default binary/command that will always run. CMD provides default arguments that are appended to ENTRYPOINT, but can be easily overridden by passing flags to `docker run`."
  },
  {
    "id": 4,
    "category": "Kubernetes",
    "question": "What causes a Pod to terminate with 'Exit Code 137' (OOMKilled)?",
    "options": [
      "The container failed its livenessProbe check 3 times consecutively.",
      "The container exceeded its configured memory limit, causing the Linux kernel OOM killer to terminate the process.",
      "The node was drained by a cluster administrator using `kubectl drain`.",
      "The container application encountered an unhandled syntax exception."
    ],
    "correct": 1,
    "explanation": "Exit Code 137 (128 + signal 9 SIGKILL) is sent by the Linux Out-Of-Memory (OOM) killer when a container consumes more RAM than specified in `resources.limits.memory`."
  },
  {
    "id": 5,
    "category": "Kubernetes",
    "question": "Why is there no 'User' API resource in Kubernetes (e.g., `kubectl get users` does not exist)?",
    "options": [
      "Kubernetes does not support human authentication.",
      "Human users are authenticated externally via signed X.509 client certificates or Identity Providers (OIDC/LDAP), and are not stored in etcd.",
      "Users are always created dynamically as ServiceAccounts in the kube-system namespace.",
      "User resources were deprecated in Kubernetes v1.20."
    ],
    "correct": 1,
    "explanation": "Kubernetes does not manage or store human users in etcd. Users are authenticated externally via validated X.509 certificates signed by the cluster CA or via tokens from external IdPs (Google, Okta, Active Directory)."
  },
  {
    "id": 6,
    "category": "Kubernetes",
    "question": "What is the crucial operational difference between a livenessProbe and a readinessProbe?",
    "options": [
      "Liveness probes only test TCP ports, while readiness probes test HTTP paths.",
      "A failing liveness probe restarts the container; a failing readiness probe temporarily isolates the pod by removing its IP from Service Endpoints.",
      "Readiness probes are mandatory, while liveness probes are optional.",
      "A failing readiness probe terminates the entire worker node."
    ],
    "correct": 1,
    "explanation": "Liveness probes detect deadlocks and restart broken containers. Readiness probes detect whether an application is warmed up and ready to serve traffic without killing the process."
  },
  {
    "id": 7,
    "category": "Kubernetes",
    "question": "What happens if a developer creates an Ingress resource in a cluster where no Ingress Controller is installed?",
    "options": [
      "The API server rejects the manifest with an HTTP 422 Unprocessable Entity error.",
      "The Ingress resource is saved in etcd, but no traffic routing occurs because no controller exists to configure reverse proxy rules.",
      "kube-proxy automatically configures iptables to route HTTP traffic.",
      "A default NGINX pod is automatically spun up by the control plane."
    ],
    "correct": 1,
    "explanation": "An Ingress is merely a declarative specification. Without an active Ingress Controller daemon (like ingress-nginx or Traefik) watching the API, nothing implements the routing rules."
  },
  {
    "id": 8,
    "category": "Kubernetes",
    "question": "What is the function of a Headless Service (`spec.clusterIP: None`)?",
    "options": [
      "It disables DNS resolution for backing pods entirely.",
      "It bypasses kube-proxy VIP load balancing, directly returning individual pod IP addresses in CoreDNS A-records for stateful peer discovery.",
      "It exposes pods on host network interfaces without port mapping.",
      "It allocates an external public IP address without creating a cloud load balancer."
    ],
    "correct": 1,
    "explanation": "Headless Services (clusterIP: None) allow clients or clustered StatefulSets (like Cassandra, Kafka, or MySQL replication) to discover and connect directly to individual pod IPs via CoreDNS."
  },
  {
    "id": 9,
    "category": "Kubernetes",
    "question": "How are Static Pods managed in a Kubernetes cluster?",
    "options": [
      "They are managed by the ReplicaSet controller in the default namespace.",
      "They are managed directly by the local `kubelet` daemon from YAML manifests in `/etc/kubernetes/manifests/`, without API server control.",
      "They are created through Helm charts with release name 'static'.",
      "They are injected into the kernel using eBPF modules."
    ],
    "correct": 1,
    "explanation": "Static Pods are supervised directly by the kubelet on that specific node. Core control plane components (etcd, apiserver, scheduler, controller-manager) are bootstrapped as Static Pods."
  },
  {
    "id": 10,
    "category": "Kubernetes",
    "question": "Which command takes an instantaneous, consistent snapshot backup of the etcd database state?",
    "options": [
      "kubectl backup etcd /opt/snapshot.db",
      "ETCDCTL_API=3 etcdctl snapshot save /opt/snapshot.db --cacert=... --cert=... --key=...",
      "kubeadm snapshot etcd --output=/opt/snapshot.db",
      "etcd-dump -d /var/lib/etcd -o /opt/snapshot.db"
    ],
    "correct": 1,
    "explanation": "ETCDCTL_API=3 etcdctl snapshot save with the appropriate TLS certificate, key, and CA flags generates a cryptographic snapshot of the etcd key-value store."
  }
];
