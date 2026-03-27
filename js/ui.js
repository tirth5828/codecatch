/**
 * ui.js
 * All DOM interactions — toggle cards, code panel, explanation panel, modal.
 */

const UI = (() => {

  /* ── Score display ──────────────────────────── */

  function updateScore(state) {
    document.getElementById('sc-caught').textContent = state.caught;
    document.getElementById('sc-missed').textContent = state.missed;
    document.getElementById('sc-streak').textContent = state.streak;
    document.getElementById('hdr-level').textContent = state.level;

    const pct = (state.xp / CONFIG.XP_PER_LEVEL) * 100;
    document.getElementById('xp-bar').style.width = pct + '%';
    document.getElementById('xp-txt').textContent  = `${state.xp} / ${CONFIG.XP_PER_LEVEL}`;
  }

  /* ── Overlay ────────────────────────────────── */

  function showOverlay(show) {
    document.getElementById('overlay').classList.toggle('gone', !show);
  }

  /* ── Streak label ───────────────────────────── */

  function showStreak(count, x, y) {
    const el = document.createElement('div');
    el.className = 'streak-lbl';
    el.style.left  = x + 'px';
    el.style.top   = (y - 55) + 'px';
    el.style.color = count >= 7 ? 'var(--ac2)' : 'var(--ye)';
    el.textContent = count >= 7 ? `${count}× 🔥 INSANE!` : `${count}× STREAK!`;
    document.getElementById('game-panel').appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  /* ── Achievement toast ──────────────────────── */

  let toastTimer = null;

  function showAchievement(a) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-icon').textContent = a.icon;
    document.getElementById('toast-name').textContent = a.name;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  /* ── Red flash ──────────────────────────────── */

  function flashRed() {
    const panel = document.getElementById('game-panel');
    panel.style.boxShadow = 'inset 0 0 60px rgba(255,77,109,0.3)';
    setTimeout(() => { panel.style.boxShadow = ''; }, 350);
  }

  /* ── Toggle cards ───────────────────────────── */

  function buildToggles(onToggle) {
    const grid = document.getElementById('toggle-grid');
    grid.innerHTML = '';

    FEATURES_DEF.forEach(f => {
      const locked  = f.unlock > 0;
      const isOn    = ['gravity','wind','trail'].includes(f.id);

      const card = document.createElement('div');
      card.className  = 'tcard' + (isOn ? ' on' : '') + (locked ? ' locked' : '');
      card.id         = 'tc-' + f.id;
      card.dataset.id = f.id;

      card.innerHTML = `
        <div class="t-top">
          <span class="t-label">${f.label}</span>
          <span class="t-dot"></span>
        </div>
        <div class="t-desc">${f.desc}</div>
        ${locked ? `<div class="t-unlock">Catch ${f.unlock} to unlock</div>` : ''}
      `;

      card.addEventListener('click', () => {
        if (card.classList.contains('locked')) return;
        onToggle(f.id);
        card.classList.toggle('on');
        syncCodeBlock(f.id);
      });

      grid.appendChild(card);
    });
  }

  function syncCodeBlock(featureId) {
    const card   = document.getElementById('tc-' + featureId);
    const isOn   = card.classList.contains('on');
    const block  = document.getElementById('cb-' + featureId);
    if (!block) return;
    const tag    = block.querySelector('.cb-tag');

    block.classList.toggle('dim', !isOn);
    block.classList.toggle('hi', isOn);
    if (tag && CONTENT[featureId] && !CONTENT[featureId].tag) {
      tag.textContent = isOn ? 'ACTIVE' : 'INACTIVE';
      tag.classList.toggle('off', !isOn);
    }
  }

  function unlockFeature(id) {
    const card = document.getElementById('tc-' + id);
    if (!card || !card.classList.contains('locked')) return;
    card.classList.remove('locked');
    const unl = card.querySelector('.t-unlock');
    if (unl) unl.remove();
  }

  /* ── Code panel ─────────────────────────────── */

  function buildCodePanel() {
    const panel = document.getElementById('code-panel');
    panel.innerHTML = '';

    Object.entries(CONTENT).forEach(([key, data]) => {
      const isCore   = data.tag === 'CORE';
      const defaultOn = ['gravity','wind','trail','loop','collision'].includes(key);

      const block = document.createElement('div');
      block.id        = 'cb-' + key;
      block.className = 'cb' + (defaultOn || isCore ? ' hi' : ' dim');

      const tagClass = isCore ? 'cb-tag core' : (defaultOn ? 'cb-tag' : 'cb-tag off');
      const tagText  = isCore ? 'CORE' : (defaultOn ? 'ACTIVE' : 'INACTIVE');

      block.innerHTML = `
        <div class="cb-hdr">
          <span>${data.label}</span>
          <span class="${tagClass}">${tagText}</span>
        </div>
        <div class="cb-body">
          <pre>${buildSnippet(data.snippet)}</pre>
        </div>
      `;

      block.addEventListener('click', e => {
        if (e.target.classList.contains('ed')) return;
        openModal(key);
        highlightBlock(key);
      });

      panel.appendChild(block);
    });

    // Wire up editable inputs after render
    wireEditableInputs();
  }

  function buildSnippet(template) {
    if (!template) return '';
    // Replace <span class="ed" ...> placeholders with real inputs
    return template.replace(
      /<span class="ed" data-key="([^"]+)" data-min="([^"]+)" data-max="([^"]+)"(?:\s+data-int="([^"]+)")?>([^<]+)<\/span>/g,
      (_, key, min, max, isInt, val) => {
        const extra = isInt ? ' data-int="1"' : '';
        return `<input class="ed" data-key="${key}" data-min="${min}" data-max="${max}"${extra} value="${val}" title="Edit ${key} (${min}–${max})">`;
      }
    );
  }

  function wireEditableInputs() {
    document.querySelectorAll('.ed').forEach(input => {
      input.addEventListener('change', e => {
        e.stopPropagation();
        applyEditableChange(input);
      });
      input.addEventListener('click', e => e.stopPropagation());
      input.addEventListener('mousedown', e => e.stopPropagation());
    });
  }

  function applyEditableChange(input) {
    const key   = input.dataset.key;
    const isInt = !!input.dataset.int;
    const min   = parseFloat(input.dataset.min);
    const max   = parseFloat(input.dataset.max);
    let val     = isInt ? parseInt(input.value) : parseFloat(input.value);

    if (isNaN(val)) { input.value = CONFIG[key]; return; }
    val = Math.min(max, Math.max(min, val));
    input.value = val;

    if (key in CONFIG) {
      CONFIG[key] = val;
      // Mark that user has edited code
      Game.getState().edited = true;
      Game._achSet && document.dispatchEvent(new Event('check-ach'));
    }
  }

  function highlightBlock(key) {
    document.querySelectorAll('.cb').forEach(b => b.classList.remove('sel'));
    const block = document.getElementById('cb-' + key);
    if (block) {
      block.classList.add('sel');
      block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ── Explanation panel ──────────────────────── */

  function updateExplainPanel(key) {
    const d = CONTENT[key];
    if (!d) return;

    document.getElementById('ex-prompt').style.display = 'none';
    const cont = document.getElementById('ex-content');
    cont.style.display = 'block';
    cont.innerHTML = `
      <div class="ex-concept">📚 ${d.concept}</div>
      <div class="ex-title">${d.title}</div>
      ${d.sections.map(s => s.isAnalogy
        ? `<div class="ex-analogy">${s.text}</div>`
        : `<div class="ex-body-text"><strong class="ex-sec-label">${s.label}</strong><br>${s.text}</div>`
      ).join('')}
    `;
  }

  /* ── Modal ──────────────────────────────────── */

  function openModal(key) {
    updateExplainPanel(key);
    const d = CONTENT[key];
    if (!d) return;

    document.getElementById('modal-fname').textContent   = d.fname;
    document.getElementById('modal-concept').textContent = d.concept;
    document.getElementById('modal-ctitle').textContent  = d.title;

    // Build line-numbered code
    const lines = (d.fullCode || '').split('\n');
    document.getElementById('modal-code').innerHTML = lines.map(line => {
      const safe = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const coloured = syntaxHighlight(safe);
      return `<div class="ln">${coloured}</div>`;
    }).join('');

    // Explanation pane
    const pane = document.getElementById('modal-explain');
    pane.innerHTML = `
      <div class="me-section">
        <div class="me-label">CS Concepts</div>
        <div class="me-chips">
          ${(d.chips || []).map((c, i) => `<span class="me-chip${i < 3 ? ' hl' : ''}">${c}</span>`).join('')}
        </div>
      </div>
      ${d.sections.map(s => s.isAnalogy
        ? `<div class="me-section"><div class="me-label">${s.label}</div><div class="me-analogy">${s.text}</div></div>`
        : `<div class="me-section"><div class="me-label">${s.label}</div><div class="me-text">${s.text}</div></div>`
      ).join('')}
    `;

    document.getElementById('code-modal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('code-modal').classList.remove('open');
  }

  function syntaxHighlight(line) {
    // Comment (must go first — matches everything after //)
    if (/^\s*\/\//.test(line) || line.includes('//')) {
      const idx = line.indexOf('//');
      const code = line.slice(0, idx);
      const comment = `<span class="cm">${line.slice(idx)}</span>`;
      return applyTokens(code) + comment;
    }
    return applyTokens(line);
  }

  function applyTokens(code) {
    return code
      .replace(/\b(const|let|var|function|return|if|else|for|while|true|false|new|this|of|in)\b/g,
        m => `<span class="kw">${m}</span>`)
      .replace(/\b([A-Z][A-Z0-9_]{2,})\b/g,
        m => `<span style="color:var(--tn)">${m}</span>`)
      .replace(/\b(\d+\.?\d*)\b/g,
        m => `<span style="color:var(--tn)">${m}</span>`)
      .replace(/(["'`])([^"'`]*)\1/g,
        m => `<span class="st">${m}</span>`)
      .replace(/\b([a-z][a-zA-Z]+)\s*\(/g,
        m => `<span class="fn">${m.replace('(', '')}</span>(`)
      .replace(/\b(ball|balls|features|state|canvas|ctx)\b/g,
        m => `<span class="vr">${m}</span>`);
  }

  return {
    updateScore, showOverlay, showStreak, showAchievement, flashRed,
    buildToggles, unlockFeature, syncCodeBlock,
    buildCodePanel, openModal, closeModal,
  };

})();
