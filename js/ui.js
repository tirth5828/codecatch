// ui.js — all DOM interactions.
// Depends on: config.js, state.js, content.js (CFG, S, FEAT_DEF, ACHS, CONTENT)
// physics.js helpers (syncCodeTag) and renderer indirectly called here.

// ── Toast ─────────────────────────────────────
var toastTimer;
function showToast(icon, name) {
  document.getElementById('t-ico').textContent = icon;
  document.getElementById('t-nm').textContent  = name;
  var t = document.getElementById('toast');
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2800);
}

// ── Streak label ──────────────────────────────
function showStreak(x, y) {
  var el = document.createElement('div');
  el.className   = 'streak-lbl';
  el.style.left  = x+'px';
  el.style.top   = (y-55)+'px';
  el.style.color = S.streak>=7 ? 'var(--ac2)' : 'var(--ye)';
  el.textContent = S.streak>=7 ? S.streak+'× 🔥 INSANE!' : S.streak+'× STREAK!';
  gp.appendChild(el);
  setTimeout(function(){ el.remove(); }, 900);
}

// ── Red flash ─────────────────────────────────
function flashRed() {
  gp.style.boxShadow = 'inset 0 0 60px rgba(255,77,109,.3)';
  setTimeout(function(){ gp.style.boxShadow = ''; }, 350);
}

// ── Toggle cards ──────────────────────────────
function buildToggles() {
  var grid = document.getElementById('tgrid');
  FEAT_DEF.forEach(function(f) {
    var on     = ['gravity','wind','trail'].indexOf(f.id) >= 0;
    var locked = f.unlock > 0;
    var card   = document.createElement('div');
    card.id        = 'tc-'+f.id;
    card.className = 'tcard' + (on?' on':'') + (locked?' locked':'');
    card.innerHTML =
      '<div class="t-row"><span class="t-nm">'+f.label+'</span><span class="t-dot"></span></div>'+
      '<div class="t-desc">'+f.desc+'</div>'+
      (locked ? '<div class="t-unl">Catch '+f.unlock+'</div>' : '');
    card.addEventListener('click', function() {
      if (card.classList.contains('locked')) return;
      S.feat[f.id] = !S.feat[f.id];
      card.classList.toggle('on', S.feat[f.id]);
      if (f.id === 'multi') S.balls = [];
      syncCodeTag(f.id);
    });
    grid.appendChild(card);
  });
}

function syncCodeTag(id) {
  var cb  = document.getElementById('cb-'+id);
  var tag = document.getElementById('tag-'+id);
  if (!cb || !tag) return;
  var on = S.feat[id];
  cb.classList.toggle('dim', !on);
  cb.classList.toggle('hi',   on);
  tag.textContent = on ? 'ACTIVE' : 'INACTIVE';
  tag.className   = on ? 'cb-tag' : 'cb-tag off';
}

// ── Code panel ────────────────────────────────
function buildCodePanel() {
  var panel = document.getElementById('cp');
  panel.innerHTML =
    '<div class="cp-lbl">Live Code — click to expand · <span class="tn">edit orange values</span></div>';

  Object.keys(CONTENT).forEach(function(key) {
    var d       = CONTENT[key];
    var isCore  = d.tag === 'CORE';
    var defOn   = ['loop','gravity','wind','trail','collision'].indexOf(key) >= 0;
    var block   = document.createElement('div');
    block.id        = 'cb-'+key;
    block.className = 'cb' + ((defOn || isCore) ? ' hi' : ' dim');

    var tagClass = isCore ? 'cb-tag core' : (defOn ? 'cb-tag' : 'cb-tag off');
    var tagText  = isCore ? 'CORE'        : (defOn ? 'ACTIVE' : 'INACTIVE');
    var tagId    = isCore ? ''            : 'id="tag-'+key+'"';

    block.innerHTML =
      '<div class="cb-hdr">'+
        '<span>'+d.label+'</span>'+
        '<span '+tagId+' class="'+tagClass+'">'+tagText+'</span>'+
      '</div>'+
      '<div class="cb-body"><pre>'+d.snippet+'</pre></div>';

    block.addEventListener('click', function(e) {
      if (e.target.tagName === 'INPUT') return;
      openModal(key);
      highlightBlock(key);
      showExplain(key);
    });

    panel.appendChild(block);
  });

  wireEdits();
}

function highlightBlock(key) {
  document.querySelectorAll('.cb').forEach(function(b){ b.classList.remove('sel'); });
  var b = document.getElementById('cb-'+key);
  if (b) { b.classList.add('sel'); b.scrollIntoView({behavior:'smooth', block:'nearest'}); }
}

function wireEdits() {
  var edMap = {
    'ed-grav':  { key:'GRAVITY',       min:0.01, max:3,      isInt:false },
    'ed-wind':  { key:'WIND_FORCE',    min:0,    max:2,      isInt:false },
    'ed-damp':  { key:'WIND_DAMP',     min:0,    max:0.9999, isInt:false },
    'ed-trail': { key:'TRAIL_LEN',     min:1,    max:50,     isInt:true  },
    'ed-multi': { key:'MULTI_CNT',     min:1,    max:8,      isInt:true  },
    'ed-rbig':  { key:'BALL_R_BIG',    min:6,    max:60,     isInt:false },
    'ed-rsm':   { key:'BALL_R',        min:3,    max:30,     isInt:false },
    'ed-bwh':   { key:'BUCKET_W_HARD', min:20,   max:250,    isInt:false },
    'ed-bwn':   { key:'BUCKET_W',      min:40,   max:350,    isInt:false },
  };
  Object.keys(edMap).forEach(function(id) {
    var el  = document.getElementById(id);
    var cfg = edMap[id];
    if (!el) return;
    el.addEventListener('change', function(e) {
      e.stopPropagation();
      var v = cfg.isInt ? parseInt(el.value,10) : parseFloat(el.value);
      if (isNaN(v)) { el.value = CFG[cfg.key]; return; }
      v = Math.min(cfg.max, Math.max(cfg.min, v));
      el.value     = v;
      CFG[cfg.key] = v;
      S.edited     = true;
      checkAch();
    });
    el.addEventListener('click',     function(e){ e.stopPropagation(); });
    el.addEventListener('mousedown', function(e){ e.stopPropagation(); });
  });
}

// ── Explain panel ─────────────────────────────
function showExplain(key) {
  var d = CONTENT[key];
  if (!d) return;
  document.getElementById('ep-idle').style.display = 'none';
  var cont = document.getElementById('ep-content');
  cont.style.display = 'block';
  cont.innerHTML =
    '<div class="ex-concept">📚 '+d.concept+'</div>'+
    '<div class="ex-title">'+d.title+'</div>'+
    d.sections.map(function(s) {
      return s.isAnalogy
        ? '<div class="ex-analogy">'+s.text+'</div>'
        : '<div class="ex-blk"><strong>'+s.label+'</strong><br>'+s.text+'</div>';
    }).join('');
}

// ── Modal ─────────────────────────────────────
function openModal(key) {
  var d = CONTENT[key];
  if (!d) return;

  document.getElementById('m-fname').textContent  = d.fname;
  document.getElementById('m-ctag').textContent   = d.concept;
  document.getElementById('m-ctitle').textContent = d.title;

  // Code pane with line numbers
  var lines = (d.full || '').split('\n');
  document.getElementById('m-code').innerHTML = lines.map(function(line) {
    var safe = line.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return '<div class="ln">'+hlLine(safe)+'</div>';
  }).join('');

  // Explanation pane
  document.getElementById('m-exp').innerHTML =
    '<div>'+
      '<div class="me-lbl">CS Concepts</div>'+
      '<div class="me-chips">'+
        (d.chips||[]).map(function(c,i){
          return '<span class="me-chip'+(i<3?' hl':'')+'">'+c+'</span>';
        }).join('')+
      '</div>'+
    '</div>'+
    d.sections.map(function(s) {
      return '<div>'+
        '<div class="me-lbl">'+s.label+'</div>'+
        (s.isAnalogy
          ? '<div class="me-analogy">'+s.text+'</div>'
          : '<div class="me-text">'+s.text+'</div>')+
        '</div>';
    }).join('');

  document.getElementById('modal').classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// ── Syntax highlight (modal code pane) ────────
function hlLine(code) {
  var ci = code.indexOf('//');
  if (ci >= 0) {
    return tok(code.slice(0, ci)) + '<span class="cm">'+code.slice(ci)+'</span>';
  }
  return tok(code);
}

function tok(c) {
  return c
    .replace(/\b(var|const|let|function|return|if|else|for|while|true|false|new|this|of|in)\b/g,
      function(m){ return '<span class="kw">'+m+'</span>'; })
    .replace(/\b([A-Z][A-Z0-9_]{2,})\b/g,
      function(m){ return '<span style="color:var(--tn)">'+m+'</span>'; })
    .replace(/\b(\d+\.?\d*)\b/g,
      function(m){ return '<span style="color:var(--tn)">'+m+'</span>'; })
    .replace(/(["'`])([^"'`]*)\1/g,
      function(m){ return '<span class="st">'+m+'</span>'; })
    .replace(/\b([a-z][a-zA-Z]+)\s*\(/g,
      function(m){ return '<span class="fn">'+m.slice(0,-1)+'</span>('; })
    .replace(/\b(ball|balls|features|feat|S|canvas|ctx)\b/g,
      function(m){ return '<span class="vr">'+m+'</span>'; });
}
