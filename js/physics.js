// physics.js — ball helpers, spawn logic, physics update, scoring.
// Depends on: config.js, state.js (CFG, S, canvas)
// ui.js functions called here (showToast, showStreak, flashRed)
// are defined later but only called at runtime — no load-order issue.

// ── Dimension helpers ─────────────────────────
function ballR()   { return S.feat.size ? CFG.BALL_R_BIG : CFG.BALL_R; }
function bucketW() { return S.feat.hard ? CFG.BUCKET_W_HARD : CFG.BUCKET_W; }
function bucketX() { var bw=bucketW(); return Math.max(bw/2, Math.min(canvas.width-bw/2, S.bucketX)); }
function bucketY() { return canvas.height - CFG.BUCKET_OFF; }
function spawnIval(){ return Math.max(CFG.SPAWN_MIN, CFG.SPAWN_BASE-(S.level-1)*CFG.SPAWN_DEC); }

// ── Spawn ─────────────────────────────────────
function spawnBalls() {
  var r = ballR(), w = canvas.width;
  var count = S.feat.multi ? CFG.MULTI_CNT : 1;
  for (var i = 0; i < count; i++) {
    var x = count > 1
      ? (i+1) * (w/(count+1))
      : r + Math.random() * (w - 2*r);
    S.balls.push({
      x: x,
      y: -r - Math.random()*20,
      vx: 0,
      vy: S.feat.gravity ? 0.2+Math.random()*0.3 : CFG.CONST_SPEED,
      trail: [],
      hue: Math.floor(Math.random()*360),
      dead: false,
    });
  }
}

// ── Physics update (called every frame) ───────
function update() {
  var r  = ballR();
  var bx = bucketX();
  var by = bucketY();
  var bw = bucketW();
  var w  = canvas.width;
  var h  = canvas.height;

  S.balls.forEach(function(b) {
    if (b.dead) return;

    // Gravity
    if (S.feat.gravity) { b.vy += CFG.GRAVITY; } else { b.vy = CFG.CONST_SPEED; }
    b.y += b.vy;

    // Wind
    if (S.feat.wind) {
      b.vx += (Math.random()-0.5) * CFG.WIND_FORCE;
      b.vx *= CFG.WIND_DAMP;
      b.x  += b.vx;
      if (b.x < r)   { b.x = r;   b.vx *= -1; }
      if (b.x > w-r) { b.x = w-r; b.vx *= -1; }
    }

    // Trail
    if (S.feat.trail) {
      b.trail.push({x:b.x, y:b.y});
      if (b.trail.length > CFG.TRAIL_LEN) b.trail.shift();
    } else {
      b.trail = [];
    }

    // Collision: AABB
    var inX = b.x > bx-bw/2 && b.x < bx+bw/2;
    var inY = b.y+r >= by && b.y-r <= by+28;
    if (inX && inY) {
      b.dead = true;
      onCatch(b);
    } else if (b.y - r > h+10) {
      b.dead = true;
      onMiss();
    }
  });

  S.balls = S.balls.filter(function(b){ return !b.dead; });
}

// ── Scoring ───────────────────────────────────
function onCatch(b) {
  S.caught++;
  S.streak++;
  var xpGain = S.streak>=5 ? CFG.XP_STR5 : S.streak>=3 ? CFG.XP_STR3 : CFG.XP_CATCH;
  addXP(xpGain);
  spawnParticles(b.x, bucketY(), b.hue);
  if (S.streak >= 3) showStreak(b.x, bucketY());
  checkUnlocks();
  checkAch();
  updateHUD();
}

function onMiss() {
  S.missed++;
  S.streak = 0;
  flashRed();
  updateHUD();
}

function addXP(n) {
  S.xp += n;
  while (S.xp >= CFG.XP_LEVEL) { S.xp -= CFG.XP_LEVEL; S.level++; }
  document.getElementById('xp-bar').style.width = (S.xp/CFG.XP_LEVEL*100)+'%';
  document.getElementById('xp-txt').textContent  = S.xp+' / '+CFG.XP_LEVEL;
  document.getElementById('hdr-lvl').textContent  = S.level;
}

function updateHUD() {
  document.getElementById('sc-c').textContent = S.caught;
  document.getElementById('sc-s').textContent = S.streak;
  document.getElementById('sc-m').textContent = S.missed;
}

function checkUnlocks() {
  FEAT_DEF.forEach(function(f) {
    if (f.unlock > 0 && S.caught >= f.unlock) {
      var card = document.getElementById('tc-'+f.id);
      if (card && card.classList.contains('locked')) {
        card.classList.remove('locked');
        var u = card.querySelector('.t-unl');
        if (u) u.remove();
      }
    }
  });
}

function checkAch() {
  ACHS.forEach(function(a) {
    if (!achUnlocked.has(a.id) && a.cond()) {
      achUnlocked.add(a.id);
      showToast(a.icon, a.name);
    }
  });
}
