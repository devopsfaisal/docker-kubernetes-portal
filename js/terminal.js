/**
 * KR Network Cloud - Interactive Web Terminal Simulator
 * Realistic Docker, Kubernetes (kubectl), Helm & ETCD Lab Engine
 */

(function () {
  // Virtual Cluster State
  const state = {
    currentPrompt: 'root@k8s-master:~# ',
    history: [],
    historyIndex: -1,
    nodes: [
      { name: 'master-1', status: 'Ready', roles: 'control-plane', age: '14d', version: 'v1.29.0', internalIp: '192.168.1.10', os: 'Ubuntu 22.04 LTS' },
      { name: 'worker-1', status: 'Ready', roles: '<none>', age: '14d', version: 'v1.29.0', internalIp: '192.168.1.11', os: 'Ubuntu 22.04 LTS' },
      { name: 'worker-2', status: 'Ready', roles: '<none>', age: '14d', version: 'v1.29.0', internalIp: '192.168.1.12', os: 'Ubuntu 22.04 LTS' }
    ],
    pods: [
      { name: 'coredns-768b85b76-4j8z9', namespace: 'kube-system', ready: '1/1', status: 'Running', restarts: '0', age: '14d', ip: '10.244.0.3', node: 'master-1' },
      { name: 'calico-node-w28k1', namespace: 'kube-system', ready: '1/1', status: 'Running', restarts: '0', age: '14d', ip: '192.168.1.10', node: 'master-1' },
      { name: 'calico-node-x77a2', namespace: 'kube-system', ready: '1/1', status: 'Running', restarts: '0', age: '14d', ip: '192.168.1.11', node: 'worker-1' },
      { name: 'web-frontend-5c6d48-3a9b', namespace: 'default', ready: '1/1', status: 'Running', restarts: '0', age: '2d', ip: '10.244.1.15', node: 'worker-1' },
      { name: 'web-frontend-5c6d48-7x4m', namespace: 'default', ready: '1/1', status: 'Running', restarts: '0', age: '2d', ip: '10.244.2.18', node: 'worker-2' },
      { name: 'mysql-db-0', namespace: 'default', ready: '1/1', status: 'Running', restarts: '0', age: '5d', ip: '10.244.1.22', node: 'worker-1' }
    ],
    services: [
      { name: 'kubernetes', namespace: 'default', type: 'ClusterIP', clusterIp: '10.96.0.1', externalIp: '<none>', ports: '443/TCP', age: '14d' },
      { name: 'mysql-service', namespace: 'default', type: 'ClusterIP', clusterIp: '10.96.142.88', externalIp: '<none>', ports: '3306/TCP', age: '5d' },
      { name: 'web-frontend-svc', namespace: 'default', type: 'NodePort', clusterIp: '10.96.205.12', externalIp: '<none>', ports: '80:30080/TCP', age: '2d' }
    ],
    dockerContainers: [
      { id: 'e3b0c44298fc', image: 'nginx:alpine', command: '"/docker-entrypoint.…"', created: '3 hours ago', status: 'Up 3 hours', ports: '0.0.0.0:80->80/tcp', name: 'prod-web' },
      { id: '8a129d44a2b1', image: 'redis:alpine', command: '"docker-entrypoint.s…"', created: '1 day ago', status: 'Up 1 day', ports: '6379/tcp', name: 'cache-redis' }
    ],
    dockerImages: [
      { repo: 'nginx', tag: 'alpine', id: '9a6b986a6d6e', created: '2 weeks ago', size: '23.5MB' },
      { repo: 'redis', tag: 'alpine', id: '72b0c4921ab0', created: '3 weeks ago', size: '32.1MB' },
      { repo: 'ubuntu', tag: '22.04', id: 'a8780b506fa4', created: '1 month ago', size: '77.8MB' },
      { repo: 'mysql', tag: '5.7', id: '5195076672a7', created: '2 months ago', size: '448MB' }
    ],
    etcdSnapshots: []
  };

  // Practice Challenges & Scenarios
  const scenarios = [
    {
      id: 'sc-1',
      title: 'Lab 1: Docker Container Lifecycle',
      desc: 'Run an interactive Nginx container on port 8080 and verify running containers.',
      targetCmd: 'docker run -d -p 8080:80 --name test-nginx nginx:alpine',
      solution: 'Type: docker run -d -p 8080:80 --name test-nginx nginx:alpine followed by docker ps'
    },
    {
      id: 'sc-2',
      title: 'Lab 2: Inspect Kubernetes Cluster Nodes',
      desc: 'Query cluster topology to check node status, roles and versions.',
      targetCmd: 'kubectl get nodes -o wide',
      solution: 'Type: kubectl get nodes OR kubectl get nodes -o wide'
    },
    {
      id: 'sc-3',
      title: 'Lab 3: Pod Microservices Discovery',
      desc: 'List all pods across all namespaces sorted by node location.',
      targetCmd: 'kubectl get pods -A -o wide',
      solution: 'Type: kubectl get pods -A -o wide'
    },
    {
      id: 'sc-4',
      title: 'Lab 4: Create a Production Pod',
      desc: 'Imperatively deploy a secure API pod named backend-api using nginx:alpine.',
      targetCmd: 'kubectl run backend-api --image=nginx:alpine',
      solution: 'Type: kubectl run backend-api --image=nginx:alpine'
    },
    {
      id: 'sc-5',
      title: 'Lab 5: Safe Node Maintenance (Drain)',
      desc: 'Evict running pods from worker-1 safely to prepare for kernel patching.',
      targetCmd: 'kubectl drain worker-1 --ignore-daemonsets',
      solution: 'Type: kubectl drain worker-1 --ignore-daemonsets'
    },
    {
      id: 'sc-6',
      title: 'Lab 6: ETCD Disaster Recovery Backup',
      desc: 'Take an instant cryptographic snapshot of the etcd database state.',
      targetCmd: 'etcdctl snapshot save /opt/backup.db',
      solution: 'Type: etcdctl snapshot save /opt/backup.db'
    }
  ];

  // Helper formatting functions
  function formatTable(headers, rows) {
    const colWidths = headers.map((h, i) => {
      const maxRowLen = rows.reduce((max, r) => Math.max(max, (r[i] || '').length), 0);
      return Math.max(h.length, maxRowLen) + 3;
    });

    let headerLine = headers.map((h, i) => h.padEnd(colWidths[i])).join('');
    let output = `<span style="color:#38BDF8; font-weight:700;">${headerLine}</span>\n`;

    rows.forEach(r => {
      let rowLine = r.map((cell, i) => (cell || '').padEnd(colWidths[i])).join('');
      output += `${rowLine}\n`;
    });

    return output;
  }

  // Core Command Handler
  function executeCommand(rawInput) {
    const input = rawInput.trim();
    if (!input) return '';

    state.history.push(input);
    state.historyIndex = state.history.length;

    const parts = input.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Standard Linux Utilities
    if (cmd === 'clear') {
      const screen = document.getElementById('terminal-screen-output');
      if (screen) screen.innerHTML = '';
      return null;
    }

    if (cmd === 'help') {
      return `<span style="color:#10B981; font-weight:bold;">KR Network Cloud Interactive Terminal</span>
Available command suites:
  • <span style="color:#0DB7ED;">docker</span>     : run, ps, images, stop, rm, volume, network, build
  • <span style="color:#326CE5;">kubectl</span>    : get (nodes, pods, svc, deploy), describe, run, delete, drain, uncordon, top
  • <span style="color:#8B5CF6;">helm</span>       : list, repo list, search, install, status
  • <span style="color:#F59E0B;">etcdctl</span>    : snapshot save, snapshot status, snapshot restore
  • <span style="color:#94A3B8;">system</span>     : clear, whoami, uname -a, date, history, cat, ls
Type any valid Docker or Kubernetes command or select a practice lab on the left!`;
    }

    if (cmd === 'whoami') return 'root';
    if (cmd === 'uname' && (args[0] === '-a' || args[0] === '-r')) return 'Linux k8s-master-prod 5.15.0-101-generic #111-Ubuntu SMP x86_64 GNU/Linux';
    if (cmd === 'date') return new Date().toUTCString();
    if (cmd === 'history') return state.history.map((h, i) => `  ${(i + 1).toString().padStart(4, ' ')}  ${h}`).join('\n');
    if (cmd === 'ls') return 'certs  config  deployment.yaml  pod.yaml  pvc.yaml  rbac.yaml';
    if (cmd === 'cat') {
      if (args[0] === 'pod.yaml') {
        return `apiVersion: v1\nkind: Pod\nmetadata:\n  name: demo-app\nspec:\n  containers:\n  - name: web\n    image: nginx:alpine\n    ports:\n    - containerPort: 80`;
      }
      return `cat: ${args[0] || 'file'}: No such file or directory`;
    }

    // ------------------------------------------------------------------------
    // Docker CLI Handler
    // ------------------------------------------------------------------------
    if (cmd === 'docker') {
      const sub = args[0] ? args[0].toLowerCase() : '';

      if (!sub || sub === '--help') {
        return `Usage:  docker [OPTIONS] COMMAND\nA self-sufficient runtime for containers.\nCommands: run, ps, images, stop, start, rm, rmi, build, volume, network, exec`;
      }

      if (sub === 'ps') {
        const showAll = args.includes('-a');
        const headers = ['CONTAINER ID', 'IMAGE', 'COMMAND', 'CREATED', 'STATUS', 'PORTS', 'NAMES'];
        const rows = state.dockerContainers.map(c => [c.id, c.image, c.command, c.created, c.status, c.ports, c.name]);
        return formatTable(headers, rows);
      }

      if (sub === 'images') {
        const headers = ['REPOSITORY', 'TAG', 'IMAGE ID', 'CREATED', 'SIZE'];
        const rows = state.dockerImages.map(img => [img.repo, img.tag, img.id, img.created, img.size]);
        return formatTable(headers, rows);
      }

      if (sub === 'run') {
        const nameIdx = args.indexOf('--name');
        const name = nameIdx !== -1 && args[nameIdx + 1] ? args[nameIdx + 1] : `container-${Math.random().toString(36).substring(2, 6)}`;
        const image = args[args.length - 1].includes(':') ? args[args.length - 1] : `${args[args.length - 1]}:latest`;
        const newId = Math.random().toString(16).substring(2, 14);

        state.dockerContainers.unshift({
          id: newId,
          image: image,
          command: '"/docker-entrypoint.…"',
          created: 'Just now',
          status: 'Up 1 second',
          ports: '0.0.0.0:8080->80/tcp',
          name: name
        });

        return `<span style="color:#10B981;">${newId}47a599bdf934f8e6c7104b901a1c</span>\nContainer <strong style="color:#38BDF8;">${name}</strong> started successfully!`;
      }

      if (sub === 'stop') {
        const target = args[1];
        if (!target) return 'docker stop requires at least 1 argument.';
        const found = state.dockerContainers.find(c => c.id.startsWith(target) || c.name === target);
        if (found) {
          found.status = 'Exited (0) Just now';
          return `<span style="color:#F59E0B;">${target}</span> stopped.`;
        }
        return `Error: No such container: ${target}`;
      }

      if (sub === 'rm') {
        const target = args[1];
        const idx = state.dockerContainers.findIndex(c => c.id.startsWith(target) || c.name === target);
        if (idx !== -1) {
          state.dockerContainers.splice(idx, 1);
          return `<span style="color:#EF4444;">${target}</span> removed.`;
        }
        return `Error: No such container: ${target}`;
      }

      if (sub === 'volume' && args[1] === 'ls') {
        return formatTable(['DRIVER', 'VOLUME NAME'], [['local', 'app-storage'], ['local', 'mysql-data'], ['local', 'redis-cache']]);
      }

      if (sub === 'network' && args[1] === 'ls') {
        return formatTable(['NETWORK ID', 'NAME', 'DRIVER', 'SCOPE'], [
          ['f9a12c842b10', 'bridge', 'bridge', 'local'],
          ['a82c4019db45', 'host', 'host', 'local'],
          ['71b9c32145e0', 'none', 'null', 'local'],
          ['e140d892a7c4', 'custom-app-net', 'bridge', 'local']
        ]);
      }

      return `docker: '${sub}' is not a docker command. See 'docker --help'`;
    }

    // ------------------------------------------------------------------------
    // Kubectl CLI Handler
    // ------------------------------------------------------------------------
    if (cmd === 'kubectl' || cmd === 'k') {
      const sub = args[0] ? args[0].toLowerCase() : '';

      if (!sub) return 'kubectl controls the Kubernetes cluster manager.\nFind more information at: https://kubernetes.io/docs/reference/kubectl/';

      if (sub === 'get') {
        const resource = args[1] ? args[1].toLowerCase() : '';
        const allNs = args.includes('-A') || args.includes('--all-namespaces');
        const wide = args.includes('-o') && (args[args.indexOf('-o') + 1] === 'wide');

        // Get Nodes
        if (['nodes', 'node', 'no'].includes(resource)) {
          if (wide) {
            const headers = ['NAME', 'STATUS', 'ROLES', 'AGE', 'VERSION', 'INTERNAL-IP', 'OS-IMAGE'];
            const rows = state.nodes.map(n => [n.name, n.status, n.roles, n.age, n.version, n.internalIp, n.os]);
            return formatTable(headers, rows);
          }
          const headers = ['NAME', 'STATUS', 'ROLES', 'AGE', 'VERSION'];
          const rows = state.nodes.map(n => [n.name, n.status, n.roles, n.age, n.version]);
          return formatTable(headers, rows);
        }

        // Get Pods
        if (['pods', 'pod', 'po'].includes(resource)) {
          let filtered = allNs ? state.pods : state.pods.filter(p => p.namespace === 'default');
          if (wide) {
            const headers = allNs ? ['NAMESPACE', 'NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE', 'IP', 'NODE'] : ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE', 'IP', 'NODE'];
            const rows = filtered.map(p => allNs ? [p.namespace, p.name, p.ready, p.status, p.restarts, p.age, p.ip, p.node] : [p.name, p.ready, p.status, p.restarts, p.age, p.ip, p.node]);
            return formatTable(headers, rows);
          }
          const headers = allNs ? ['NAMESPACE', 'NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'] : ['NAME', 'READY', 'STATUS', 'RESTARTS', 'AGE'];
          const rows = filtered.map(p => allNs ? [p.namespace, p.name, p.ready, p.status, p.restarts, p.age] : [p.name, p.ready, p.status, p.restarts, p.age]);
          return formatTable(headers, rows);
        }

        // Get Services
        if (['services', 'service', 'svc'].includes(resource)) {
          const headers = ['NAME', 'TYPE', 'CLUSTER-IP', 'EXTERNAL-IP', 'PORT(S)', 'AGE'];
          const rows = state.services.map(s => [s.name, s.type, s.clusterIp, s.externalIp, s.ports, s.age]);
          return formatTable(headers, rows);
        }

        // Get Deployments
        if (['deployments', 'deployment', 'deploy'].includes(resource)) {
          return formatTable(
            ['NAME', 'READY', 'UP-TO-DATE', 'AVAILABLE', 'AGE'],
            [['web-frontend', '2/2', '2', '2', '2d'], ['auth-service', '1/1', '1', '1', '4d']]
          );
        }

        // Get Namespaces
        if (['namespaces', 'namespace', 'ns'].includes(resource)) {
          return formatTable(['NAME', 'STATUS', 'AGE'], [['default', 'Active', '14d'], ['kube-system', 'Active', '14d'], ['kube-public', 'Active', '14d'], ['production', 'Active', '10d']]);
        }

        return `error: the server doesn't have a resource type "${resource}"`;
      }

      // Imperative Pod Run
      if (sub === 'run') {
        const podName = args[1];
        if (!podName) return 'error: a pod name must be specified';
        state.pods.push({
          name: podName,
          namespace: 'default',
          ready: '1/1',
          status: 'Running',
          restarts: '0',
          age: '1s',
          ip: `10.244.1.${Math.floor(Math.random() * 80 + 30)}`,
          node: 'worker-1'
        });
        return `<span style="color:#10B981;">pod/${podName} created</span>`;
      }

      // Node Drain
      if (sub === 'drain') {
        const nodeName = args[1];
        const targetNode = state.nodes.find(n => n.name === nodeName);
        if (!targetNode) return `Error: node "${nodeName}" not found`;
        targetNode.status = 'Ready,SchedulingDisabled';
        return `node/${nodeName} cordoned\nevicting pod default/web-frontend-5c6d48-3a9b\npod/web-frontend-5c6d48-3a9b evicted\n<span style="color:#10B981;">node/${nodeName} drained successfully</span>`;
      }

      // Node Uncordon
      if (sub === 'uncordon') {
        const nodeName = args[1];
        const targetNode = state.nodes.find(n => n.name === nodeName);
        if (!targetNode) return `Error: node "${nodeName}" not found`;
        targetNode.status = 'Ready';
        return `<span style="color:#10B981;">node/${nodeName} uncordoned</span>`;
      }

      // Top command
      if (sub === 'top') {
        if (args[1] === 'nodes' || args[1] === 'node') {
          return formatTable(['NAME', 'CPU(cores)', 'CPU%', 'MEMORY(bytes)', 'MEMORY%'], [
            ['master-1', '210m', '10%', '1120Mi', '28%'],
            ['worker-1', '450m', '22%', '2410Mi', '61%'],
            ['worker-2', '380m', '19%', '1980Mi', '50%']
          ]);
        }
        if (args[1] === 'pods' || args[1] === 'pod') {
          return formatTable(['NAME', 'CPU(cores)', 'MEMORY(bytes)'], [
            ['mysql-db-0', '150m', '512Mi'],
            ['web-frontend-5c6d48-3a9b', '45m', '128Mi'],
            ['web-frontend-5c6d48-7x4m', '40m', '120Mi']
          ]);
        }
      }

      return `kubectl: command executed successfully against API server.`;
    }

    // ------------------------------------------------------------------------
    // ETCDCTL CLI Handler
    // ------------------------------------------------------------------------
    if (cmd === 'etcdctl') {
      if (args[0] === 'snapshot' && args[1] === 'save') {
        const path = args[2] || '/opt/backup.db';
        return `{"level":"info","ts":"${new Date().toISOString()}","caller":"snapshot/v3_snapshot.go:68","msg":"created temporary db file","path":"${path}.part"}
1.25 MiB / 1.25 MiB [========================================================================] 100.00% 0s
<span style="color:#10B981; font-weight:bold;">Snapshot saved at ${path}</span>`;
      }
      return 'etcdctl: version 3.5.9. API version: 3.5';
    }

    // ------------------------------------------------------------------------
    // Helm CLI Handler
    // ------------------------------------------------------------------------
    if (cmd === 'helm') {
      if (args[0] === 'list') {
        return formatTable(['NAME', 'NAMESPACE', 'REVISION', 'UPDATED', 'STATUS', 'CHART', 'APP VERSION'], [
          ['jenkins', 'devops', '1', '2026-09-29 18:20:10 UTC', 'deployed', 'jenkins-5.1.2', '2.440.1'],
          ['prometheus', 'monitoring', '2', '2026-09-28 11:15:02 UTC', 'deployed', 'prometheus-25.8.0', 'v2.48.1']
        ]);
      }
      if (args[0] === 'repo' && args[1] === 'list') {
        return formatTable(['NAME', 'URL'], [
          ['bitnami', 'https://charts.bitnami.com/bitnami'],
          ['jenkins', 'https://charts.jenkins.io'],
          ['prometheus-community', 'https://prometheus-community.github.io/helm-charts']
        ]);
      }
      return 'Helm - The Kubernetes Package Manager (v3.13.2)';
    }

    return `bash: ${cmd}: command not found. Type 'help' to see available tools.`;
  }

  // Initialize Terminal UI and Event Listeners
  function initTerminal() {
    const screen = document.getElementById('terminal-screen-output');
    const inputField = document.getElementById('terminal-cli-input');
    const clearBtn = document.getElementById('terminal-clear-btn');
    const scenariosList = document.getElementById('terminal-scenarios-list');

    if (!inputField || !screen) return;

    // Render Scenarios Sidebar
    if (scenariosList) {
      scenariosList.innerHTML = scenarios.map((sc, i) => `
        <div class="scenario-btn ${i === 0 ? 'active' : ''}" data-scenario-id="${sc.id}">
          <div class="scenario-btn-title"><i class="fa-solid fa-terminal" style="color:var(--accent-cyan); margin-right:4px;"></i> ${sc.title}</div>
          <div class="scenario-btn-desc">${sc.desc}</div>
        </div>
      `).join('');

      scenariosList.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          scenariosList.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const scId = btn.getAttribute('data-scenario-id');
          const targetSc = scenarios.find(s => s.id === scId);
          if (targetSc) {
            appendOutput(`\n<span style="color:#F59E0B; font-weight:700;">[CHALLENGE LOADED]</span> <strong style="color:#FFFFFF;">${targetSc.title}</strong>\n<span style="color:#94A3B8;">Goal: ${targetSc.desc}</span>\n<span style="color:#38BDF8;">💡 Tip: ${targetSc.solution}</span>\n`);
            inputField.value = targetSc.targetCmd;
            inputField.focus();
          }
        });
      });
    }

    function appendOutput(html) {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = html;
      screen.appendChild(line);
      screen.scrollTop = screen.scrollHeight;
    }

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = inputField.value;
        appendOutput(`<span class="terminal-prompt">${state.currentPrompt}</span> <span class="terminal-command-line">${val}</span>`);
        inputField.value = '';

        const result = executeCommand(val);
        if (result !== null && result !== '') {
          appendOutput(result);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (state.historyIndex > 0) {
          state.historyIndex--;
          inputField.value = state.history[state.historyIndex] || '';
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          inputField.value = state.history[state.historyIndex] || '';
        } else {
          state.historyIndex = state.history.length;
          inputField.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const current = inputField.value.trim();
        const autoCompletions = [
          'kubectl get nodes', 'kubectl get pods -A', 'kubectl get svc', 'kubectl top nodes',
          'docker ps', 'docker images', 'docker run -d -p 80:80 nginx:alpine',
          'etcdctl snapshot save /opt/backup.db', 'helm list'
        ];
        const match = autoCompletions.find(c => c.startsWith(current));
        if (match) inputField.value = match;
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        screen.innerHTML = '';
      });
    }
  }

  window.initWebTerminal = initTerminal;
})();
