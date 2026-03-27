/**
 * main.js
 * Entry point. Wires Game, Renderer, UI together.
 * No game logic here — only initialization and event wiring.
 */

(function main() {

  const canvas = document.getElementById('game-canvas');
  const panel  = document.getElementById('game-panel');

  /* ── Canvas resize ──────────────────────────── */

  function resize() {
    canvas.width  = panel.clientWidth;
    canvas.height = panel.clientHeight;
  }
  resize();
  new ResizeObserver(resize).observe(panel);

  /* ── Initialise modules ─────────────────────── */

  Renderer.init(canvas);

  UI.buildToggles(featureId => {
    Game.toggleFeature(featureId);
  });

  UI.buildCodePanel();

  Game.init(canvas, {
    onScoreChange:  state => UI.updateScore(state),
    onAchievement:  a     => UI.showAchievement(a),
    onStreakShow:   (count, x, y) => UI.showStreak(count, x, y),
  });

  /* ── Unlock events ──────────────────────────── */

  document.addEventListener('feature-unlock', e => {
    UI.unlockFeature(e.detail);
  });

  document.addEventListener('flash-red', () => UI.flashRed());

  /* ── Achievement re-check on edit ──────────── */

  document.addEventListener('check-ach', () => {
    // trigger the game's internal ach check via a dummy update
    const state = Game.getState();
    ACHIEVEMENTS.forEach(a => {
      if (!Game._achSet.has(a.id) && a.cond(state)) {
        Game._achSet.add(a.id);
        UI.showAchievement(a);
      }
    });
  });

  /* ── Start / Stop button ────────────────────── */

  const btn = document.getElementById('btn-start');

  btn.addEventListener('click', () => {
    const state = Game.getState();
    if (!state.running) {
      Game.start();
      UI.showOverlay(false);
      btn.textContent = '⏹ Stop';
      btn.classList.add('stop');
    } else {
      Game.stop();
      UI.showOverlay(true);
      btn.textContent = '▶ Start';
      btn.classList.remove('stop');
    }
  });

  /* ── Modal close ────────────────────────────── */

  document.getElementById('modal-backdrop').addEventListener('click', () => UI.closeModal());
  document.getElementById('modal-close-btn').addEventListener('click', () => UI.closeModal());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') UI.closeModal(); });

  /* ── Idle animation loop ────────────────────── */

  function idleLoop() {
    if (!Game.getState().running) {
      Renderer.drawIdle();
    }
    requestAnimationFrame(idleLoop);
  }
  idleLoop();

})();
