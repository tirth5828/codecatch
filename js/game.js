/**
 * game.js
 * Game state, main loop, scoring, and progression.
 */

const Game = (() => {

  /* ── State ──────────────────────────────────── */

  const state = {
    running:  false,
    frame:    0,
    balls:    [],
    bucketX:  0,

    // Scoring
    caught:  0,
    missed:  0,
    streak:  0,
    xp:      0,
    level:   1,
    edited:  false,   // has the user changed a code value?

    // Features (runtime active state)
    features: {
      gravity: true,
      wind:    true,
      trail:   true,
      multi:   false,
      size:    false,
      hard:    false,
    },
  };

  let animId      = null;
  let canvas      = null;
  let onScoreChange = () => {};   // callback → UI
  let onAchievement = () => {};
  let onStreakShow   = () => {};

  /* ── Init ───────────────────────────────────── */

  function init(canvasEl, callbacks = {}) {
    canvas           = canvasEl;
    onScoreChange    = callbacks.onScoreChange    || (() => {});
    onAchievement    = callbacks.onAchievement    || (() => {});
    onStreakShow      = callbacks.onStreakShow      || (() => {});

    state.bucketX = canvas.width / 2;

    // Mouse / touch bucket control
    const panel = canvas.parentElement;
    panel.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      state.bucketX = (e.clientX - r.left) * (canvas.width / r.width);
    });
    panel.addEventListener('touchmove', e => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      state.bucketX = (e.touches[0].clientX - r.left) * (canvas.width / r.width);
    }, { passive: false });
  }

  /* ── Helpers ────────────────────────────────── */

  function ballRadius()  { return state.features.size ? CONFIG.BALL_RADIUS_BIG : CONFIG.BALL_RADIUS; }
  function bucketWidth() { return state.features.hard ? CONFIG.BUCKET_WIDTH_HARD : CONFIG.BUCKET_WIDTH; }
  function bucketX()     {
    const bw = bucketWidth();
    return Math.max(bw / 2, Math.min(canvas.width - bw / 2, state.bucketX));
  }
  function bucketY()     { return canvas.height - CONFIG.BUCKET_Y_OFFSET; }

  function spawnInterval() {
    return Math.max(CONFIG.SPAWN_MIN, CONFIG.SPAWN_BASE - (state.level - 1) * CONFIG.SPAWN_DEC);
  }

  /* ── Spawning ───────────────────────────────── */

  function spawnBalls() {
    const r     = ballRadius();
    const count = state.features.multi ? CONFIG.MULTI_COUNT : 1;
    for (let i = 0; i < count; i++) {
      const x = count > 1
        ? (i + 1) * (canvas.width / (count + 1))
        : r + Math.random() * (canvas.width - 2 * r);
      state.balls.push(Physics.createBall(x, r, state.features.gravity));
    }
  }

  /* ── Update ─────────────────────────────────── */

  function update() {
    const r  = ballRadius();
    const bx = bucketX();
    const by = bucketY();
    const bw = bucketWidth();

    state.balls.forEach(ball => {
      if (ball.dead) return;

      Physics.applyGravity(ball, state.features.gravity);
      Physics.applyWind(ball, state.features.wind, canvas.width, r);
      Physics.updateTrail(ball, state.features.trail);

      // Collision
      if (Physics.hitsBucket(ball, r, bx, by, bw)) {
        ball.dead = true;
        handleCatch(ball);
      } else if (Physics.isOffscreen(ball, r, canvas.height)) {
        ball.dead = true;
        handleMiss();
      }
    });

    // Remove dead balls
    state.balls = state.balls.filter(b => !b.dead);
  }

  /* ── Scoring ────────────────────────────────── */

  function handleCatch(ball) {
    state.caught++;
    state.streak++;

    // XP
    const xpGain = state.streak >= 5 ? CONFIG.XP_STREAK_5
                 : state.streak >= 3 ? CONFIG.XP_STREAK_3
                 : CONFIG.XP_PER_CATCH;
    addXP(xpGain);

    // Particles
    Renderer.spawnParticles(ball.x, bucketY(), ball.hue);

    // Streak popup
    if (state.streak >= 3) onStreakShow(state.streak, ball.x, bucketY());

    // Unlock check
    checkUnlocks();

    notifyScore();
    checkAchievements();
  }

  function handleMiss() {
    state.missed++;
    state.streak = 0;
    document.dispatchEvent(new Event('flash-red'));
    notifyScore();
  }

  function addXP(n) {
    state.xp += n;
    while (state.xp >= CONFIG.XP_PER_LEVEL) {
      state.xp -= CONFIG.XP_PER_LEVEL;
      state.level++;
    }
  }

  function checkUnlocks() {
    FEATURES_DEF.forEach(f => {
      if (f.unlock > 0 && state.caught >= f.unlock) {
        // Signal UI to unlock toggle card
        document.dispatchEvent(new CustomEvent('feature-unlock', { detail: f.id }));
      }
    });
  }

  function checkAchievements() {
    ACHIEVEMENTS.forEach(a => {
      if (!Game._achSet.has(a.id) && a.cond(state)) {
        Game._achSet.add(a.id);
        onAchievement(a);
      }
    });
  }

  function notifyScore() {
    onScoreChange({ ...state });
  }

  /* ── Main Loop ──────────────────────────────── */

  function loop() {
    if (!state.running) return;
    state.frame++;

    if (state.frame % spawnInterval() === 0) spawnBalls();

    Renderer.clear();
    Renderer.drawGrid();

    state.balls.forEach(b => Renderer.drawBall(b, ballRadius()));
    Renderer.drawBucket(bucketX(), bucketY(), bucketWidth(), CONFIG.BUCKET_HEIGHT);
    Renderer.updateAndDrawParticles();

    update();

    animId = requestAnimationFrame(loop);
  }

  /* ── Public controls ────────────────────────── */

  function start() {
    if (state.running) return;
    state.running = true;
    state.balls   = [];
    state.frame   = 0;
    loop();
  }

  function stop() {
    state.running = false;
    cancelAnimationFrame(animId);
  }

  function toggleFeature(id) {
    if (!(id in state.features)) return;
    state.features[id] = !state.features[id];
    if (id === 'multi') state.balls = []; // clean slate on multi toggle
  }

  function getState()       { return state; }
  function getBallRadius()  { return ballRadius(); }
  function getBucketX()     { return bucketX(); }
  function getBucketY()     { return bucketY(); }
  function getBucketWidth() { return bucketWidth(); }

  /* Public achievement set (checked inside checkAchievements) */
  Game._achSet = new Set();

  return {
    init, start, stop,
    toggleFeature,
    getState, getBallRadius, getBucketX, getBucketY, getBucketWidth,
  };

})();

// Bootstrap Game._achSet after the object is created
Game._achSet = new Set();
