# 🐳☸️ Docker & Kubernetes Production Mastery Portal

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://devopsfaisal.github.io/docker-kubernetes-portal/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![CKA Exam Ready](https://img.shields.io/badge/CKA-Certified%20Kubernetes%20Administrator-brightgreen?style=for-the-badge&logo=linuxfoundation)](https://www.cncf.io/certification/cka/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

An enterprise-grade, single-page progressive web portal housing the complete **27-Day Production Engineering Curriculum (169 In-depth Lectures)**. 

Designed with modern glassmorphism aesthetics, dynamic **Mermaid.js** architecture blueprints, trilingual educational parity (**English**, **Hinglish**, **Arabic**), comprehensive CKA practice scenarios, and a built-in **interactive real-time browser terminal simulator** (`docker`, `kubectl`, `helm`, `etcdctl`).

---

## 🌟 Key Highlights & Architecture

### 1. 🖥️ Interactive Web Terminal Lab Simulator
- **Real-Time Virtual Cluster**: Simulates a multi-node Kubernetes cluster (`master-1`, `worker-1`, `worker-2`), container runtimes, Calico CNI networking, and default namespace services.
- **Docker CLI**: Run `docker run`, `docker ps`, `docker images`, `docker stop`, `docker rm`, `docker logs`, `docker network`, and `docker volume`.
- **Kubernetes CLI (`kubectl`)**: Supports `kubectl get nodes`, `kubectl get pods -A -o wide`, `kubectl run`, `kubectl describe`, `kubectl drain`, `kubectl uncordon`, and `kubectl top`.
- **ETCD & Helm**: Take snapshots with `etcdctl snapshot save /opt/backup.db`, view snapshot status, and manage releases with `helm list` and `helm repo list`.
- **Guided Lab Challenges**: 6 step-by-step interactive scenarios with real-time automated input validation and visual success banners.
- **Realistic Terminal UX**: Bash prompt, command history navigation ($\uparrow$ / $\downarrow$ arrows), Tab autocompletion, clear console, and quick-action toolbars.

### 2. 🌐 Trilingual Education Parity (3 Languages in Every Lecture Modal)
- **English (Technical Production)**: In-depth production documentation, edge-case troubleshooting, enterprise best practices, and security hardening.
- **Hinglish (Classroom Whiteboard Notes)**: Intuitive, conversational Hindi-English explanations with practical analogies.
- **Arabic (الملخص الشامل)**: Polished, professional Arabic technical summaries covering core architectural pillars.

### 3. 📐 Live Mermaid.js System Architecture
- Dynamic SVG architecture diagrams rendered directly in the browser.
- Covers Docker Container Isolation, Bridge vs Host Networking, Overlay Networks, Kubernetes Control Plane Internals, Pod Lifecycle, kube-proxy iptables routing, RBAC privilege chains, and StatefulSet headless service storage mapping.

### 4. 📋 Production Manifests & CLI Runbooks
- Syntax-highlighted, copyable YAML manifests for Pods, ReplicaSets, Deployments, DaemonSets, StatefulSets, Services (ClusterIP, NodePort, LoadBalancer), NetworkPolicies, RBAC Roles/RoleBindings, Ingress Controllers, PVC/PV/StorageClasses, and Helm charts.

### 5. 🎯 CKA Exam Readiness & Production Cheatsheets
- **Interactive Quiz Engine**: Multiple-choice CKA scenarios with live grading, instant feedback, and rationale explanations.
- **Searchable Cheatsheets**: Quick reference tables for Docker commands, Dockerfile instructions, Kubectl aliases, RBAC rules, and Disaster Recovery procedures.
- **Progress Tracking**: LocalStorage-persisted day/lecture completion tracking with visual progress percentage rings.

---

## 📂 Curriculum Breakdown (27 Days / 169 Lectures)

### 🐋 Part 1: Docker Enterprise Mastery (Days 01 – 14)
* **Day 01–03**: Containerization Foundations, Namespaces & cgroups, Docker Architecture & CLI, Container Lifecycle Management.
* **Day 04–06**: Storage Architecture, Bind Mounts, Docker Managed Volumes, Custom Bridge Networks, Container DNS & Port Forwarding.
* **Day 07–09**: Multi-Stage Dockerfile Engineering, Layer Caching Optimization, Security Hardening, Multi-Container Orchestration with Docker Compose.
* **Day 10–12**: Production Compose Stacks, Microservices Networking, Private Docker Registry Deployment, TLS Authentication & Push/Pull Workflows.
* **Day 13–14**: Docker Swarm Clustering, Swarm Overlay Networking, Rolling Updates, Zero-Downtime Deployments, Production Troubleshooting.

### ☸️ Part 2: Kubernetes Masterclass & CKA Scenarios (Days 15 – 27)
* **Day 15–16**: Kubernetes Distributed Architecture, Control Plane Internals (`etcd`, `kube-apiserver`, `kube-scheduler`, `kube-controller-manager`), Worker Components (`kubelet`, `kube-proxy`, Containerd), Multi-Node Cluster Initialization with `kubeadm`.
* **Day 17–19**: Core Workloads: Pods, ReplicaSets, Deployments (RollingUpdate & Recreate Strategies), DaemonSets, Jobs, and CronJobs.
* **Day 20–21**: Cluster Networking Deep Dive: ClusterIP, NodePort, LoadBalancer, Calico CNI, Pod-to-Pod Cross-Node Routing, Ingress Controllers (NGINX), Path & Host-based Ingress Rules.
* **Day 22–23**: Enterprise Storage: PersistentVolumes (PV), PersistentVolumeClaims (PVC), Dynamic StorageClasses (NFS/EBS), StatefulSets & Headless Services (`ClusterIP: None`).
* **Day 24–25**: Security & Governance: Role-Based Access Control (RBAC), ServiceAccounts, ClusterRoles, NetworkPolicies (Calico Network Hardening), Secrets & ConfigMaps.
* **Day 26–27**: Production Operations & CKA Master Challenges: ETCD Backup & Restore, Cluster Upgrades via `kubeadm`, Node Drain/Cordon, Metrics Server & Prometheus Observability, Helm Package Management, and all 17 CKA Practical Exam Scenarios.

---

## 🚀 Quick Start (Local Run)

The portal is a pure static web application with zero external runtime dependencies. You can run it with any standard HTTP server:

```bash
# Navigate to the portal directory
cd docker-kubernetes-portal

# Start a local python server
python3 -m http.server 8000

# Open in your web browser:
# http://localhost:8000
```

---

## 🌐 Deploy to GitHub Pages in 3 Simple Steps

To deploy this portal directly under your personal GitHub domain (e.g. `https://devopsfaisal.github.io/docker-kubernetes-portal/`):

### Step 1: Create a New GitHub Repository
1. Log in to [GitHub](https://github.com/).
2. Click **New Repository**.
3. Name the repository: `docker-kubernetes-portal` (or any custom name).
4. Leave it **Public** without initializing with README (we already have everything prepared).

### Step 2: Push the Portal from Your Terminal
Run the following commands:

```bash
cd docker-kubernetes-portal

# Link to your remote GitHub repository using SSH
git remote add origin git@github.com:devopsfaisal/docker-kubernetes-portal.git

# Push the code to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub: `https://github.com/devopsfaisal/docker-kubernetes-portal`.
2. Click **Settings** (top navigation bar) -> Click **Pages** (left sidebar).
3. Under **Build and deployment** -> **Source**: Select **Deploy from a branch**.
4. Under **Branch**: Select `main` and folder `/ (root)`.
5. Click **Save**.
6. Within 60 seconds, your site will be live at:
   **`https://devopsfaisal.github.io/docker-kubernetes-portal/`**

---

## 💻 Tech Stack & Zero-Dependency Design

| Layer | Technologies Used |
| :--- | :--- |
| **Markup & Semantics** | HTML5, Semantic Elements, ARIA Roles, Accessibility-Compliant Modal Dialogs |
| **Styling & Theming** | CSS3 Modern Variables, Glassmorphism, Responsive CSS Grid & Flexbox, Dark/Light Themes |
| **Scripting & Engine** | Vanilla ES6+ JavaScript, Client-side State Engine, Virtual Terminal Emulator, DOM Virtualization |
| **Diagrams & Visuals** | [Mermaid.js 10](https://mermaid.js.org/) for dynamic architecture charts |
| **Typography & Icons** | [Google Fonts](https://fonts.google.com/) (Inter, Outfit, Fira Code), [FontAwesome 6](https://fontawesome.com/) |
| **Hosting & CI/CD** | GitHub Pages (100% Static, SSL/TLS Enabled, CDN Accelerated) |

---

## 👨‍💻 Author & Acknowledgements
- **Curated & Built for**: **devopsfaisal** (`https://devopsfaisal.github.io/`)
- **License**: MIT Open Source License. Free to use, fork, and share for educational and production reference.
