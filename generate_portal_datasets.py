import os
import re
import json

notes_dir = "/Users/deadpool/.gemini/antigravity/scratch/Docker-Kubernetes-Notes"

# 1. Module mappings for Docker (Days 1 to 14)
DOCKER_MODULES = [
    {
        "id": 1,
        "title": "Module 1: Docker Fundamentals & Architecture",
        "badge": "Core Architecture",
        "icon": "cubes",
        "color": "#0DB7ED",
        "count": 3,
        "lectures": [1, 2, 3],
        "desc": "Evolution of deployment, Bare Metal vs VMs vs Containers, Linux namespaces & cgroups, Docker daemon, client-server REST API, and AWS EC2 lab installation."
    },
    {
        "id": 2,
        "title": "Module 2: Container & Image Lifecycle Management",
        "badge": "CLI & Lifecycle",
        "icon": "box-open",
        "color": "#38BDF8",
        "count": 2,
        "lectures": [4, 5],
        "desc": "Mastering image layers, docker pull/inspect/history/tag, container lifecycle (run, exec, logs, attach, stop, kill, rm), and foreground vs detached mode."
    },
    {
        "id": 3,
        "title": "Module 3: Storage Drivers & Declarative Image Builds",
        "badge": "Storage & Build",
        "icon": "hard-drive",
        "color": "#F59E0B",
        "count": 4,
        "lectures": [6, 7, 8, 9],
        "desc": "Overlay2 filesystem internals (LowerDir, UpperDir, MergedDir), Copy-on-Write (CoW), Dockerfile declarative instructions, Named Volumes, Bind Mounts, NFS integration, and Docker root migration."
    },
    {
        "id": 4,
        "title": "Module 4: Docker Networking & Advanced Multi-Stage Builds",
        "badge": "Networking & Optimization",
        "icon": "network-wired",
        "color": "#10B981",
        "count": 3,
        "lectures": [10, 11, 12],
        "desc": "Bridge (docker0), host, none, macvlan & ipvlan drivers, container DNS, port forwarding, multi-stage Dockerfile optimization, ARG vs ENV, and image hardening."
    },
    {
        "id": 5,
        "title": "Module 5: Multi-Container Orchestration & Private Registries",
        "badge": "Orchestration & Security",
        "icon": "layer-group",
        "color": "#8B5CF6",
        "count": 2,
        "lectures": [13, 14],
        "desc": "Docker Compose specification, multi-tier microservices stacks, private Docker registry with TLS and basic authentication, and image pushing/pulling."
    }
]

# 2. Module mappings for Kubernetes (Days 15 to 27)
K8S_MODULES = [
    {
        "id": 6,
        "title": "Module 6: Kubernetes Architecture & Core Primitives",
        "badge": "Control Plane & Pods",
        "icon": "dharmachakra",
        "color": "#326CE5",
        "count": 3,
        "lectures": [15, 16, 17],
        "desc": "Master node (API Server, etcd, Scheduler, Controller Manager) vs Worker node (kubelet, kube-proxy), Pods, ReplicationControllers, ReplicaSets, and Deployments (RollingUpdate & Rollback)."
    },
    {
        "id": 7,
        "title": "Module 7: Compute Governance & Advanced Scheduling",
        "badge": "Scheduling & Quotas",
        "icon": "compass",
        "color": "#6366F1",
        "count": 2,
        "lectures": [18, 19],
        "desc": "Resource requests & limits, millicores & mebibytes, OOMKilled exit code 137, LimitRange, ResourceQuota, Metrics Server, nodeName, nodeSelector, Taints & Tolerations, and Node/Pod Affinity."
    },
    {
        "id": 8,
        "title": "Module 8: Cluster Security & Core Networking",
        "badge": "Security & CNI",
        "icon": "shield-halved",
        "color": "#EC4899",
        "count": 3,
        "lectures": [20, 21, 22],
        "desc": "X.509 client certificate authentication, ServiceAccounts, RBAC (Role, ClusterRole, RoleBinding), Kubeconfig Contexts, Calico CNI (IPAM, BGP), ClusterIP, NodePort, Ingress Controller (Layer 7), CoreDNS, and Network Policies."
    },
    {
        "id": 9,
        "title": "Module 9: Decoupled Configuration & Clustered Storage",
        "badge": "Config & StatefulSets",
        "icon": "database",
        "color": "#F97316",
        "count": 2,
        "lectures": [23, 24],
        "desc": "ConfigMaps, Secrets, StatefulSets (ordered web-0 indexing), Headless Services, PersistentVolumes (PV), PersistentVolumeClaims (PVC), StorageClasses, and dynamic cloud provisioning (AWS EBS CSI)."
    },
    {
        "id": 10,
        "title": "Module 10: Workload Reliability, Observability & Helm",
        "badge": "Helm & Observability",
        "icon": "chart-line",
        "color": "#14B8A6",
        "count": 2,
        "lectures": [25, 26],
        "desc": "DaemonSets, Health Probes (Liveness, Readiness, Startup), Helm 3 package manager, Jenkins CI/CD deployment, Static Pods, Sidecars, InitContainers, Blue/Green & Canary rollouts, HPA, and Prometheus/Grafana."
    },
    {
        "id": 11,
        "title": "Module 11: Cluster Operations & CKA Practical Exam Mastery",
        "badge": "CKA Exam Prep",
        "icon": "award",
        "color": "#EAB308",
        "count": 1,
        "lectures": [27],
        "desc": "ETCD disaster recovery snapshot backup/restore, Bare-Metal MetalLB, private registry integration, worker node drain/cordon/uncordon, and all 17 CKA hands-on scenario walkthroughs."
    }
]

def parse_markdown_file(file_path, day_num):
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        text = f.read()

    # Extract title
    title_match = re.search(r"^#\s+(.+)$", text, re.MULTILINE)
    raw_title = title_match.group(1).strip() if title_match else f"Day {day_num}"
    clean_title = re.sub(r"^📘\s*Day\s*\d+\s*[—\-:]*\s*(Lecture\s*\d+\s*:\s*)?", "", raw_title).strip()
    if clean_title.startswith(f"Day {day_num}:"):
        clean_title = clean_title.replace(f"Day {day_num}:", "").strip()

    # Extract mermaid diagram
    mermaid_match = re.search(r"```mermaid\n(.*?)\n```", text, re.DOTALL)
    mermaid_code = mermaid_match.group(1).strip() if mermaid_match else ""

    # Extract CLI/code blocks
    code_blocks = re.findall(r"```(yaml|bash|dockerfile|docker|json|sh)\n(.*?)\n```", text, re.DOTALL)
    commands_code = ""
    labs_code = ""
    for lang, block in code_blocks:
        if lang in ["bash", "sh"]:
            labs_code += f"# {lang.upper()}\n{block.strip()}\n\n"
        else:
            commands_code += f"# {lang.upper()}\n{block.strip()}\n\n"

    # Extract Q&A
    qa_list = []
    # format: 1. **Question?**\n - Answer
    qa_matches = re.findall(r"\d+\.\s+\*\*(.+?)\*\*\s*\n\s*[-*]\s*(.+?)(?=\n\d+\.|\n##|\Z)", text, re.DOTALL)
    for q, a in qa_matches:
        qa_list.append({"q": q.strip(), "a": a.strip()})

    # Find key concepts
    concepts = []
    concept_matches = re.findall(r"[-*]\s+\*\*([^:]+):\*\*\s*([^\n]+)", text)
    for c_title, c_desc in concept_matches[:5]:
        concepts.append(f"<strong>{c_title.strip()}:</strong> {c_desc.strip()}")

    # Determine module
    is_docker = day_num <= 14
    target_modules = DOCKER_MODULES if is_docker else K8S_MODULES
    mod = next((m for m in target_modules if day_num in m["lectures"]), target_modules[0])

    return {
        "id": day_num,
        "dayNum": day_num,
        "title": f"Day {day_num:02d}: {clean_title}",
        "cleanTitle": clean_title,
        "duration": "1h 45m" if day_num > 10 else "2h 15m",
        "moduleId": mod["id"],
        "moduleName": mod["title"],
        "moduleBadge": mod["badge"],
        "color": mod["color"],
        "icon": mod["icon"],
        "rawMarkdown": text,
        "mermaid": mermaid_code,
        "commands": commands_code.strip() or labs_code.strip(),
        "labs": labs_code.strip() or commands_code.strip(),
        "keyConcepts": concepts if concepts else [
            f"Core production concepts for Day {day_num}",
            "Enterprise infrastructure standards & automation",
            "Reliability and high-availability patterns"
        ],
        "qa": qa_list if qa_list else [
            {"q": f"What is the key takeaway of Day {day_num}?", "a": clean_title},
            {"q": "How does this apply in a production environment?", "a": "Ensures zero-downtime, fault-tolerance, and scalable cloud-native workloads."}
        ]
    }

print("[*] Processing all 27 markdown files...")
all_days = []
file_mapping = {
    1: "Day-01-Course-Introduction.md",
    2: "Day-02-Container-Introductions.md",
    3: "Day-03-AWS-Lab-Setup-Docker-Installation.md",
    4: "Day-04-Docker-Basics-Image-Commands.md",
    5: "Day-05-Docker-Basics-Container-Commands.md",
    6: "Day-06-Docker-Storage-Overlay2.md",
    7: "Day-07-Dockerfile-and-Image-Build.md",
    8: "Day-08-Docker-Persistent-Storage.md",
    9: "Day-09-Advanced-Storage-NFS-and-DataRoot.md",
    10: "Day-10-Docker-Networking-Bridge-and-Ports.md",
    11: "Day-11-Docker-Advanced-Networking-Drivers.md",
    12: "Day-12-Dockerfile-Multi-Stage-Builds.md",
    13: "Day-13-Docker-Compose-Multi-Container.md",
    14: "Day-14-Private-Docker-Registry.md",
    15: "Day-15-Kubernetes-Architecture-and-Pods.md",
    16: "Day-16-Kubernetes-Controllers-ReplicaSet.md",
    17: "Day-17-Kubernetes-Deployments-and-Rollouts.md",
    18: "Day-18-Kubernetes-Resource-Management.md",
    19: "Day-19-Kubernetes-Pod-Scheduling.md",
    20: "Day-20-Kubernetes-Security-and-RBAC.md",
    21: "Day-21-Kubernetes-Pod-Networking-and-Services.md",
    22: "Day-22-Kubernetes-Ingress-CoreDNS-and-NetworkPolicies.md",
    23: "Day-23-Kubernetes-ConfigMaps-Secrets-StatefulSets.md",
    24: "Day-24-Kubernetes-Persistent-Storage-and-Volumes.md",
    25: "Day-25-Kubernetes-DaemonSets-Probes-and-Helm.md",
    26: "Day-26-Kubernetes-Advanced-Patterns-and-Observability.md",
    27: "Day-27-Kubernetes-Cluster-Administration-and-CKA-Scenarios.md"
}

docker_lectures = []
k8s_lectures = []

for day in range(1, 28):
    fname = file_mapping[day]
    fpath = os.path.join(notes_dir, fname)
    if os.path.exists(fpath):
        parsed = parse_markdown_file(fpath, day)
        if day <= 14:
            docker_lectures.append(parsed)
        else:
            k8s_lectures.append(parsed)

print(f"[+] Parsed {len(docker_lectures)} Docker days and {len(k8s_lectures)} Kubernetes days.")

# Write js/dockerData.js
js_dir = "/Users/deadpool/.gemini/antigravity/scratch/krcloud-docker-kubernetes-portal/js"
with open(os.path.join(js_dir, "dockerData.js"), "w", encoding="utf-8") as f:
    f.write("/**\n * KR Network Cloud - Docker Mastery Dataset (Days 01 to 14)\n */\n\n")
    f.write(f"window.DOCKER_MODULES = {json.dumps(DOCKER_MODULES, indent=2)};\n\n")
    f.write(f"window.DOCKER_LECTURES = {json.dumps(docker_lectures, indent=2)};\n")
print("[+] Generated js/dockerData.js successfully.")

# Write js/k8sData.js
with open(os.path.join(js_dir, "k8sData.js"), "w", encoding="utf-8") as f:
    f.write("/**\n * KR Network Cloud - Kubernetes Masterclass Dataset (Days 15 to 27)\n */\n\n")
    f.write(f"window.K8S_MODULES = {json.dumps(K8S_MODULES, indent=2)};\n\n")
    f.write(f"window.K8S_LECTURES = {json.dumps(k8s_lectures, indent=2)};\n")
print("[+] Generated js/k8sData.js successfully.")
