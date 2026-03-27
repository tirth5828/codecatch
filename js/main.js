// main.js — entry point.
// Runs after all other scripts are loaded.
// Sets up canvas, wires events, starts idle animation.

document.addEventListener('DOMContentLoaded', function() {

  // ── Canvas setup ────────────────────────────
  canvas = document.getElementById('game-canvas');
  ctx    = canvas.getContext('2d');
  gp     = document.getElementById('gp');

  function resize() {
    canvas.width  = gp.clientWidth;
    canvas.height = gp.clientHeight;
    if (!S.bucketX) S.bucketX = canvas.width / 2;
  }
  resize();
  new ResizeObserver(resize).observe(gp);

  // ── Bucket mouse / touch control ────────────
  gp.addEventListener('mousemove', function(e) {
    var r = canvas.getBoundingClientRect();
    S.bucketX = (e.clientX - r.left) * (canvas.width / r.width);
  });
  gp.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var r = canvas.getBoundingClientRect();
    S.bucketX = (e.touches[0].clientX - r.left) * (canvas.width / r.width);
  }, { passive: false });

  // ── Build UI ─────────────────────────────────
  buildToggles();
  buildCodePanel();

  // ── Start / Stop button ──────────────────────
  var btn = document.getElementById('btn');
  btn.addEventListener('click', function() {
    if (!S.running) {
      // Start
      S.running = true;
      S.balls   = [];
      S.frame   = 0;
      document.getElementById('ov').classList.add('gone');
      btn.textContent = '⏹ Stop';
      btn.classList.add('stop');
      gameLoop();
    } else {
      // Stop
      S.running = false;
      cancelAnimationFrame(animId);
      document.getElementById('ov').classList.remove('gone');
      btn.textContent = '▶ Start';
      btn.classList.remove('stop');
      // Restart idle animation
      idleLoop();
    }
  });

  // ── Modal close ──────────────────────────────
  document.getElementById('modal-bd').addEventListener('click', closeModal);
  document.getElementById('m-close').addEventListener('click',  closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // ── Start idle animation ─────────────────────
  idleLoop();

});

// ── Game loop ────────────────────────────────
function gameLoop() {
  if (!S.running) return;
  S.frame++;
  if (S.frame % spawnIval() === 0) spawnBalls();
  drawFrame();
  update();
  animId = requestAnimationFrame(gameLoop);
}
