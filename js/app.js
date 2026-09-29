/**
 * Docker & Kubernetes Production Mastery Portal Controller
 * Full routing, lecture modals, Mermaid integration, themes & interactive views
 */

(function () {
  // Application State
  const appState = {
    course: 'docker', // 'docker' or 'k8s'
    activeView: 'lectures', // 'lectures', 'terminal', 'cheatsheets', 'quiz'
    activeFilter: 'all',
    searchQuery: '',
    currentDayId: 1,
    currentLang: localStorage.getItem('k8s_portal_preferred_lang') || 'en', // 'en', 'hi', 'ar'
    completedDays: new Set(JSON.parse(localStorage.getItem('k8s_portal_completed_days') || '[]')),
    theme: localStorage.getItem('k8s_portal_theme') || 'dark'
  };

  // DOM Elements
  const el = {
    html: document.documentElement,
    courseSwitcher: document.getElementById('course-switcher'),
    switchDocker: document.getElementById('switch-course-docker'),
    switchK8s: document.getElementById('switch-course-k8s'),
    navLectures: document.getElementById('nav-lectures'),
    navTerminal: document.getElementById('nav-terminal'),
    navCheatsheets: document.getElementById('nav-cheatsheets'),
    navQuiz: document.getElementById('nav-quiz'),
    mainLectures: document.getElementById('main-lectures-view'),
    mainTerminal: document.getElementById('main-terminal-view'),
    mainCheatsheets: document.getElementById('main-cheatsheets-view'),
    mainQuiz: document.getElementById('main-quiz-view'),
    modulesContainer: document.getElementById('modules-container'),
    cheatsheetsContainer: document.getElementById('cheatsheets-container'),
    quizContainer: document.getElementById('quiz-container'),
    searchInput: document.getElementById('search-input'),
    filterChips: document.getElementById('filter-chips'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    // Modal
    modalBackdrop: document.getElementById('lecture-modal-backdrop'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalDayPill: document.getElementById('modal-day-pill'),
    modalLectureTitle: document.getElementById('modal-lecture-title'),
    modalTabsBar: document.getElementById('modal-tabs-bar'),
    modalPrevBtn: document.getElementById('modal-prev-btn'),
    modalNextBtn: document.getElementById('modal-next-btn'),
    modalCompleteBtn: document.getElementById('modal-complete-btn'),
    modalLaunchTermBtn: document.getElementById('modal-launch-term-btn')
  };

  // Helper: Retrieve all lectures or filtered
  function getLectures() {
    return appState.course === 'docker' ? window.DOCKER_LECTURES : window.K8S_LECTURES;
  }

  function getModules() {
    return appState.course === 'docker' ? window.DOCKER_MODULES : window.K8S_MODULES;
  }

  // --------------------------------------------------------------------------
  // Theme Toggle
  // --------------------------------------------------------------------------
  function applyTheme(theme) {
    appState.theme = theme;
    el.html.setAttribute('data-theme', theme);
    localStorage.setItem('k8s_portal_theme', theme);
    if (el.themeToggleBtn) {
      el.themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
  }

  // --------------------------------------------------------------------------
  // View Router (Lectures, Terminal, Cheatsheets, Quiz)
  // --------------------------------------------------------------------------
  function switchView(viewName) {
    appState.activeView = viewName;

    // Nav classes
    document.querySelectorAll('.header-nav .nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-view') === viewName);
    });

    // View visibility
    el.mainLectures.style.display = viewName === 'lectures' ? 'block' : 'none';
    el.mainTerminal.style.display = viewName === 'terminal' ? 'block' : 'none';
    el.mainCheatsheets.style.display = viewName === 'cheatsheets' ? 'block' : 'none';
    el.mainQuiz.style.display = viewName === 'quiz' ? 'block' : 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'terminal' && window.initWebTerminal) {
      window.initWebTerminal();
    } else if (viewName === 'cheatsheets') {
      renderCheatsheets();
    } else if (viewName === 'quiz') {
      renderQuiz();
    }
  }

  // --------------------------------------------------------------------------
  // Course Switcher (Docker vs Kubernetes)
  // --------------------------------------------------------------------------
  function switchCourse(courseName) {
    appState.course = courseName;

    if (courseName === 'docker') {
      el.switchDocker.classList.add('active');
      el.switchK8s.classList.remove('active');
      document.documentElement.style.setProperty('--brand-color', 'var(--docker-blue)');
      document.documentElement.style.setProperty('--brand-glow', 'var(--docker-blue-glow)');
    } else {
      el.switchK8s.classList.add('active');
      el.switchDocker.classList.remove('active');
      document.documentElement.style.setProperty('--brand-color', 'var(--k8s-blue)');
      document.documentElement.style.setProperty('--brand-glow', 'var(--k8s-blue-glow)');
    }

    renderModules();
  }

  // --------------------------------------------------------------------------
  // Render Modules & Lectures Grid
  // --------------------------------------------------------------------------
  function renderModules() {
    if (!el.modulesContainer) return;

    const modules = getModules();
    const lectures = getLectures();
    const query = appState.searchQuery.toLowerCase();
    const filter = appState.activeFilter;

    let html = '';

    modules.forEach(mod => {
      // Filter lectures inside this module
      const modLectures = lectures.filter(lec => {
        if (lec.moduleId !== mod.id) return false;

        // Search query filter
        if (query) {
          const matchTitle = lec.title.toLowerCase().includes(query);
          const matchClean = lec.cleanTitle.toLowerCase().includes(query);
          const matchRaw = lec.rawMarkdown.toLowerCase().includes(query);
          if (!matchTitle && !matchClean && !matchRaw) return false;
        }

        // Category filter chips
        if (filter === 'architecture' && !lec.title.toLowerCase().includes('architecture') && !lec.cleanTitle.toLowerCase().includes('architecture') && !lec.mermaid) return false;
        if (filter === 'storage' && !lec.cleanTitle.toLowerCase().includes('storage') && !lec.cleanTitle.toLowerCase().includes('volume') && !lec.cleanTitle.toLowerCase().includes('overlay')) return false;
        if (filter === 'networking' && !lec.cleanTitle.toLowerCase().includes('network') && !lec.cleanTitle.toLowerCase().includes('cni') && !lec.cleanTitle.toLowerCase().includes('ingress')) return false;
        if (filter === 'security' && !lec.cleanTitle.toLowerCase().includes('security') && !lec.cleanTitle.toLowerCase().includes('rbac') && !lec.cleanTitle.toLowerCase().includes('secret')) return false;
        if (filter === 'cka' && !lec.cleanTitle.toLowerCase().includes('cka') && lec.dayNum !== 27) return false;

        return true;
      });

      if (modLectures.length === 0 && (query || filter !== 'all')) return;

      html += `
        <div class="module-card">
          <div class="module-header">
            <div class="module-title-wrap">
              <div class="module-icon-box" style="color: ${mod.color};">
                <i class="fa-solid fa-${mod.icon}"></i>
              </div>
              <div>
                <span class="module-badge" style="border-color:${mod.color}55; color:${mod.color}; background:${mod.color}15;">${mod.badge}</span>
                <h3 class="module-title">${mod.title}</h3>
                <p class="module-desc">${mod.desc}</p>
              </div>
            </div>
            <div class="module-meta">
              <span class="module-count">${modLectures.length} Days</span>
            </div>
          </div>

          <div class="lectures-grid">
            ${modLectures.map(lec => renderLectureCard(lec)).join('')}
          </div>
        </div>
      `;
    });

    if (!html) {
      html = `
        <div style="text-align:center; padding: 4rem 1rem; color:var(--text-muted);">
          <i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem; margin-bottom:1rem;"></i>
          <h3>No matching lectures found</h3>
          <p>Try searching for different keywords like 'Ingress', 'RBAC', 'Overlay2', 'ETCD' or click 'All Topics'.</p>
        </div>
      `;
    }

    el.modulesContainer.innerHTML = html;

    // Attach card click handlers
    el.modulesContainer.querySelectorAll('.lecture-card').forEach(card => {
      card.addEventListener('click', () => {
        const dayId = parseInt(card.getAttribute('data-day-id'), 10);
        openLectureModal(dayId);
      });
    });
  }

  function renderLectureCard(lec) {
    const isCompleted = appState.completedDays.has(lec.dayNum);
    const langBadge = appState.currentLang === 'hi'
      ? '<span class="feature-badge" style="color:var(--accent-amber); font-weight:700;"><span style="margin-right:2px;">🇮🇳</span> Hinglish Notes Ready</span>'
      : appState.currentLang === 'ar'
      ? '<span class="feature-badge" style="color:var(--accent-emerald); font-weight:700;"><span style="margin-right:2px;">🇸🇦</span> شرح عربي متاح</span>'
      : '<span class="feature-badge" style="color:var(--accent-cyan); font-weight:700;"><span style="margin-right:2px;">🇬🇧</span> Theory (EN)</span>';

    return `
      <div class="lecture-card" data-day-id="${lec.dayNum}">
        <div class="lecture-card-top">
          <span class="lecture-day-tag">DAY ${lec.dayNum.toString().padStart(2, '0')}</span>
          <span class="lecture-completion-status ${isCompleted ? 'completed' : ''}" title="${isCompleted ? 'Completed' : 'Click to study'}">
            <i class="fa-${isCompleted ? 'solid fa-circle-check' : 'regular fa-circle'}"></i>
          </span>
        </div>

        <h4 class="lecture-title">${lec.cleanTitle}</h4>
        <p class="lecture-preview-text">${lec.keyConcepts[0] ? lec.keyConcepts[0].replace(/<[^>]*>?/gm, '') : 'Comprehensive theory, architecture & hands-on lab.'}</p>

        <div class="lecture-card-bottom">
          <div class="lecture-features-badges">
            ${lec.mermaid ? '<span class="feature-badge" title="Has Architecture Diagram"><i class="fa-solid fa-diagram-project" style="color:var(--accent-cyan);"></i></span>' : ''}
            <span class="feature-badge" title="Estimated Study Duration"><i class="fa-regular fa-clock"></i> ${lec.duration}</span>
            ${langBadge}
          </div>

          <span class="open-lecture-btn">
            Study <i class="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Modal Controller & Tab Content Renderer
  // --------------------------------------------------------------------------
  function openLectureModal(dayNum) {
    appState.currentDayId = dayNum;
    const allLectures = [...window.DOCKER_LECTURES, ...window.K8S_LECTURES];
    const lec = allLectures.find(l => l.dayNum === dayNum);
    if (!lec) return;

    el.modalDayPill.textContent = `Day ${dayNum.toString().padStart(2, '0')}`;
    el.modalLectureTitle.textContent = lec.cleanTitle;

    // Update Mark Completed button state
    const isDone = appState.completedDays.has(dayNum);
    el.modalCompleteBtn.classList.toggle('active', isDone);
    el.modalCompleteBtn.innerHTML = isDone
      ? '<i class="fa-solid fa-circle-check"></i> Completed'
      : '<i class="fa-regular fa-circle"></i> Mark Completed';

    // Update Prev / Next buttons
    el.modalPrevBtn.disabled = dayNum <= 1;
    el.modalNextBtn.disabled = dayNum >= 27;

    // Render Panes
    renderModalPanes(lec);

    // Reset to preferred language tab
    if (appState.currentLang === 'hi') {
      activateModalTab('hinglish');
    } else if (appState.currentLang === 'ar') {
      activateModalTab('arabic');
    } else {
      activateModalTab('theory');
    }

    // Show Modal
    el.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderModalPanes(lec) {
    const paneTheory = document.getElementById('pane-theory');
    const paneHinglish = document.getElementById('pane-hinglish');
    const paneArabic = document.getElementById('pane-arabic');
    const paneLab = document.getElementById('pane-lab');
    const paneArch = document.getElementById('pane-arch');
    const paneCli = document.getElementById('pane-cli');
    const paneExam = document.getElementById('pane-exam');

    // 1. Theory Pane (English)
    paneTheory.innerHTML = `
      <div class="callout-box">
        <p><strong>📌 Module:</strong> ${lec.moduleName} &bull; <strong>⏱️ Study Time:</strong> ${lec.duration}</p>
        <p style="margin-top:0.35rem;">Master the theoretical foundations, system architecture, and production trade-offs for ${lec.cleanTitle}.</p>
      </div>

      <div class="content-section">
        <h3 class="content-heading"><i class="fa-solid fa-key" style="color:var(--accent-cyan);"></i> Core Key Concepts</h3>
        <ul class="key-concepts-list">
          ${lec.keyConcepts.map(c => `<li><i class="fa-solid fa-circle-check"></i> <div>${c}</div></li>`).join('')}
        </ul>
      </div>

      <div class="content-section">
        <h3 class="content-heading"><i class="fa-solid fa-book-open" style="color:var(--brand-color);"></i> Comprehensive Theoretical Breakdown</h3>
        <div style="color:var(--text-secondary); line-height:1.75; font-size:0.95rem;">
          ${formatMarkdownToHtml(lec.rawMarkdown)}
        </div>
      </div>
    `;

    // 2. Hinglish Notes Pane
    paneHinglish.innerHTML = `
      <div class="callout-box hinglish-box">
        <p><strong>🇮🇳 आसान भाषा में (Classroom Whiteboard Notes):</strong></p>
        <p style="margin-top:0.35rem;">Technical jargon ko chhod kar practical analogies aur takeaways ke sath concept ko samjhein.</p>
      </div>

      <div class="content-section">
        <h3 class="content-heading" style="color:var(--accent-amber);"><i class="fa-solid fa-chalkboard-user"></i> Conceptual Breakdown & Practical Analogies</h3>
        <div style="color:var(--text-secondary); line-height:1.8; font-size:0.95rem; margin-bottom:1.5rem;">
          ${lec.hinglishHtml || `
            <ul class="key-concepts-list">
              ${lec.keyConcepts.map(c => `<li><i class="fa-solid fa-lightbulb" style="color:var(--accent-amber);"></i> <div>${c}</div></li>`).join('')}
            </ul>
          `}
        </div>
      </div>

      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-badge"><i class="fa-solid fa-terminal"></i> Essential Practical Commands</span>
          <button class="copy-code-btn" onclick="copySnippet(this)"><i class="fa-regular fa-copy"></i> Copy</button>
        </div>
        <pre><code>${lec.labs || lec.commands}</code></pre>
      </div>
    `;

    // 3. Arabic Pane (العربية)
    paneArabic.innerHTML = `
      <div class="callout-box arabic-box">
        <p><strong>🇸🇦 النسخة العربية الكاملة (الشرح الميسر):</strong></p>
        <p style="margin-top:0.35rem;">شرح شامل ومفصل لمفاهيم اليوم باللغة العربية مع التركيز على المعايير الهندسية وأوامر التنفيذ المباشرة.</p>
      </div>

      <div class="content-section" style="direction:rtl; text-align:right;">
        <h3 class="content-heading" style="color:var(--accent-emerald);"><i class="fa-solid fa-book-bookmark"></i> المفاهيم الأساسية والأهداف</h3>
        <div style="color:var(--text-secondary); line-height:1.8; font-size:0.95rem; margin-bottom:1.5rem;">
          ${lec.arabicHtml || `
            <p>في هذا الدرس يتم دراسة وتطبيق: <strong>${lec.cleanTitle}</strong> ضمن منظومة الحاويات وإدارة البنية التحتية السحابية الحديثة.</p>
          `}
        </div>
      </div>

      <div class="code-block-wrapper" style="direction:ltr;">
        <div class="code-block-header">
          <span class="code-lang-badge"><i class="fa-solid fa-terminal"></i> أوامر التنفيذ والمختبر العملي</span>
          <button class="copy-code-btn" onclick="copySnippet(this)"><i class="fa-regular fa-copy"></i> Copy</button>
        </div>
        <pre><code>${lec.commands || lec.labs}</code></pre>
      </div>
    `;

    // 4. Hands-On Lab Pane
    paneLab.innerHTML = `
      <div class="content-section">
        <h3 class="content-heading"><i class="fa-solid fa-flask-vial" style="color:var(--accent-cyan);"></i> Production Lab Steps</h3>
        <p style="color:var(--text-secondary); margin-bottom:1rem;">Execute these commands step-by-step on your terminal or in the built-in Web Terminal simulator:</p>
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-lang-badge">BASH / CLI</span>
            <button class="copy-code-btn" onclick="copySnippet(this)"><i class="fa-regular fa-copy"></i> Copy</button>
          </div>
          <pre><code>${lec.labs || '# No direct script required for this section.'}</code></pre>
        </div>
      </div>
    `;

    // 5. Architecture Diagrams Pane (Mermaid)
    if (lec.mermaid) {
      paneArch.innerHTML = `
        <div class="content-section">
          <h3 class="content-heading"><i class="fa-solid fa-diagram-project" style="color:var(--accent-cyan);"></i> Architectural Workflow Diagram</h3>
          <p style="color:var(--text-secondary); margin-bottom:1.5rem;">Interactive data-flow and topological relationships rendered directly via Mermaid.js:</p>
          <div class="mermaid-container">
            <pre class="mermaid">${lec.mermaid}</pre>
          </div>
        </div>
      `;
    } else {
      paneArch.innerHTML = `
        <div style="text-align:center; padding:3rem; color:var(--text-muted);">
          <i class="fa-solid fa-diagram-project" style="font-size:2rem; margin-bottom:1rem;"></i>
          <p>Architectural diagram for this lecture is integrated directly in the Theory & Concepts section.</p>
        </div>
      `;
    }

    // 6. CLI & Manifests Pane
    paneCli.innerHTML = `
      <div class="content-section">
        <h3 class="content-heading"><i class="fa-solid fa-code" style="color:var(--brand-color);"></i> Declarative Blueprints & Manifests</h3>
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <span class="code-lang-badge">YAML / CONFIG</span>
            <button class="copy-code-btn" onclick="copySnippet(this)"><i class="fa-regular fa-copy"></i> Copy</button>
          </div>
          <pre><code>${lec.commands || lec.labs}</code></pre>
        </div>
      </div>
    `;

    // 7. Exam & Interview Q&A Pane
    paneExam.innerHTML = `
      <div class="content-section">
        <h3 class="content-heading"><i class="fa-solid fa-award" style="color:var(--accent-amber);"></i> CKA & Real-World Interview Q&A</h3>
        <p style="color:var(--text-secondary); margin-bottom:1.5rem;">Click any question to reveal the comprehensive technical answer and verification command:</p>
        <div class="qa-accordion">
          ${lec.qa.map((item, idx) => `
            <div class="qa-card ${idx === 0 ? 'open' : ''}">
              <div class="qa-question" onclick="toggleQa(this)">
                <span><strong>Q${idx + 1}:</strong> ${item.q}</span>
                <i class="fa-solid fa-chevron-down qa-icon"></i>
              </div>
              <div class="qa-answer">
                ${item.a}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Re-render Mermaid diagrams asynchronously
    setTimeout(() => {
      try {
        if (window.mermaid) {
          window.mermaid.run({ querySelector: '.mermaid' });
        }
      } catch (err) {
        console.warn('Mermaid rendering notice:', err);
      }
    }, 100);
  }

  function activateModalTab(tabName) {
    document.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `pane-${tabName}`);
    });
  }

  function closeModal() {
    el.modalBackdrop.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  // --------------------------------------------------------------------------
  // Cheatsheets Renderer
  // --------------------------------------------------------------------------
  function renderCheatsheets() {
    if (!el.cheatsheetsContainer) return;
    const data = window.CHEATSHEETS_DATA || [];

    el.cheatsheetsContainer.innerHTML = data.map(section => `
      <div class="module-card" style="padding:1.75rem;">
        <h3 style="font-family:'Outfit',sans-serif; font-size:1.3rem; margin-bottom:0.35rem; display:flex; align-items:center; gap:0.6rem;">
          <i class="${section.icon}" style="color:var(--accent-cyan);"></i> ${section.category}
        </h3>
        <p style="color:var(--text-secondary); font-size:0.88rem; margin-bottom:1.25rem;">${section.description}</p>
        
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width:55%;">CLI Command / Syntax</th>
                <th>Description & Production Effect</th>
              </tr>
            </thead>
            <tbody>
              ${section.items.map(item => `
                <tr>
                  <td><code style="background:#090D16; color:#38BDF8; padding:0.25rem 0.5rem; border-radius:4px; font-family:'Fira Code',monospace;">${item.cmd}</code></td>
                  <td>${item.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('');
  }

  // --------------------------------------------------------------------------
  // Exam Quiz Renderer
  // --------------------------------------------------------------------------
  function renderQuiz() {
    if (!el.quizContainer) return;
    const questions = window.QUIZ_DATA || [];

    el.quizContainer.innerHTML = questions.map((q, idx) => `
      <div class="quiz-card" data-quiz-id="${q.id}">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.75rem;">
          <span class="lecture-day-tag">${q.category}</span>
          <span style="font-size:0.82rem; color:var(--text-muted);">Question ${idx + 1} of ${questions.length}</span>
        </div>

        <h3 class="quiz-question-title">${q.question}</h3>

        <div class="quiz-options-list">
          ${q.options.map((opt, oIdx) => `
            <div class="quiz-option" data-option-idx="${oIdx}" onclick="handleQuizAnswer(${q.id}, ${oIdx}, ${q.correct})">
              <span style="font-weight:700; width:22px; height:22px; border-radius:50%; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:0.8rem;">
                ${String.fromCharCode(65 + oIdx)}
              </span>
              <span>${opt}</span>
            </div>
          `).join('')}
        </div>

        <div class="quiz-explanation" id="quiz-explanation-${q.id}">
          <i class="fa-solid fa-lightbulb" style="color:var(--accent-cyan); margin-right:6px;"></i> ${q.explanation}
        </div>
      </div>
    `).join('');
  }

  // Global Helpers for Inline onclick Handlers
  window.handleQuizAnswer = function (questionId, selectedIdx, correctIdx) {
    const card = document.querySelector(`.quiz-card[data-quiz-id="${questionId}"]`);
    if (!card) return;

    const options = card.querySelectorAll('.quiz-option');
    options.forEach((opt, idx) => {
      opt.style.pointerEvents = 'none';
      if (idx === correctIdx) {
        opt.classList.add('correct');
      } else if (idx === selectedIdx && selectedIdx !== correctIdx) {
        opt.classList.add('wrong');
      }
    });

    const exp = document.getElementById(`quiz-explanation-${questionId}`);
    if (exp) exp.classList.add('show');
  };

  window.toggleQa = function (headerEl) {
    const card = headerEl.parentElement;
    card.classList.toggle('open');
  };

  window.copySnippet = function (btn) {
    const wrapper = btn.closest('.code-block-wrapper');
    const code = wrapper ? wrapper.querySelector('pre code').innerText : '';
    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="color:#10B981;"></i> Copied!';
        setTimeout(() => { btn.innerHTML = orig; }, 2000);
      });
    }
  };

  function formatMarkdownToHtml(md) {
    if (!md) return '';
    let out = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    out = out.replace(/^### (.*$)/gim, '<h4 style="color:var(--text-primary); margin:1.25rem 0 0.5rem;">$1</h4>');
    out = out.replace(/^## (.*$)/gim, '<h3 style="color:var(--accent-cyan); margin:1.75rem 0 0.75rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.35rem;">$1</h3>');
    out = out.replace(/^# (.*$)/gim, '<h2 style="display:none;">$1</h2>');

    // Bold & italic
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code
    out = out.replace(/`([^`]+)`/g, '<code style="background:#090D16; color:#38BDF8; padding:0.15rem 0.4rem; border-radius:4px; font-family:\'Fira Code\',monospace;">$1</code>');

    // Horizontal rules
    out = out.replace(/^---$/gim, '<hr style="border:0; border-top:1px solid var(--border-subtle); margin:1.5rem 0;">');

    // Bullet lists
    out = out.replace(/^\s*[-*]\s+(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.35rem;">$1</li>');

    // Numbered lists
    out = out.replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-left:1.5rem; margin-bottom:0.35rem;">$1</li>');

    // Linebreaks
    out = out.replace(/\n\n/g, '<p style="margin-bottom:1rem;"></p>');

    return out;
  }

  // --------------------------------------------------------------------------
  // Event Listeners Initialization
  // --------------------------------------------------------------------------
  function initEvents() {
    // Theme toggle
    if (el.themeToggleBtn) {
      el.themeToggleBtn.addEventListener('click', () => {
        const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    }

    // Course Switcher
    if (el.switchDocker) {
      el.switchDocker.addEventListener('click', () => switchCourse('docker'));
    }
    if (el.switchK8s) {
      el.switchK8s.addEventListener('click', () => switchCourse('k8s'));
    }

    // Language Switcher Events
    function setLanguage(lang) {
      appState.currentLang = lang;
      localStorage.setItem('k8s_portal_preferred_lang', lang);

      // Update Header buttons
      document.querySelectorAll('#header-lang-switcher .lang-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });

      // Update Hero chips
      document.querySelectorAll('#hero-lang-box .hero-lang-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-lang') === lang);
      });

      // Update status text
      const displayEl = document.getElementById('current-lang-display');
      if (displayEl) {
        if (lang === 'hi') {
          displayEl.innerHTML = '<span style="color:var(--accent-amber);">🇮🇳 Hinglish Notes</span>';
        } else if (lang === 'ar') {
          displayEl.innerHTML = '<span style="color:var(--accent-emerald);">🇸🇦 النسخة العربية (Arabic)</span>';
        } else {
          displayEl.innerHTML = '<span style="color:var(--accent-cyan);">🇬🇧 English</span>';
        }
      }

      renderModules();
    }

    // Attach Header Lang Switcher
    document.querySelectorAll('#header-lang-switcher .lang-switch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // Attach Hero Lang Chips
    document.querySelectorAll('#hero-lang-box .hero-lang-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const lang = chip.getAttribute('data-lang');
        setLanguage(lang);
      });
    });

    // Set initial active state
    setLanguage(appState.currentLang);

    // Navigation Links
    document.querySelectorAll('.header-nav .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        switchView(targetView);
      });
    });

    // Search Input
    if (el.searchInput) {
      el.searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.trim();
        renderModules();
      });
    }

    // Filter Chips
    if (el.filterChips) {
      el.filterChips.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          el.filterChips.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          appState.activeFilter = chip.getAttribute('data-filter');
          renderModules();
        });
      });
    }

    // Modal Events
    if (el.modalCloseBtn) {
      el.modalCloseBtn.addEventListener('click', closeModal);
    }
    if (el.modalBackdrop) {
      el.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === el.modalBackdrop) closeModal();
      });
    }

    // Modal Tabs Bar
    if (el.modalTabsBar) {
      el.modalTabsBar.querySelectorAll('.modal-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          activateModalTab(tab);
        });
      });
    }

    // Prev / Next Day
    if (el.modalPrevBtn) {
      el.modalPrevBtn.addEventListener('click', () => {
        if (appState.currentDayId > 1) {
          openLectureModal(appState.currentDayId - 1);
        }
      });
    }
    if (el.modalNextBtn) {
      el.modalNextBtn.addEventListener('click', () => {
        if (appState.currentDayId < 27) {
          openLectureModal(appState.currentDayId + 1);
        }
      });
    }

    // Mark Completed
    if (el.modalCompleteBtn) {
      el.modalCompleteBtn.addEventListener('click', () => {
        const id = appState.currentDayId;
        if (appState.completedDays.has(id)) {
          appState.completedDays.delete(id);
        } else {
          appState.completedDays.add(id);
        }
        localStorage.setItem('k8s_portal_completed_days', JSON.stringify(Array.from(appState.completedDays)));

        const isDone = appState.completedDays.has(id);
        el.modalCompleteBtn.classList.toggle('active', isDone);
        el.modalCompleteBtn.innerHTML = isDone
          ? '<i class="fa-solid fa-circle-check"></i> Completed'
          : '<i class="fa-regular fa-circle"></i> Mark Completed';

        renderModules();
      });
    }

    // Launch in Terminal Button
    if (el.modalLaunchTermBtn) {
      el.modalLaunchTermBtn.addEventListener('click', () => {
        closeModal();
        switchView('terminal');
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.modalBackdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // App Initialization
  function initApp() {
    applyTheme(appState.theme);
    initEvents();
    renderModules();
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
