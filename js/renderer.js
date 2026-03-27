/**
 * renderer.js
 * All canvas drawing — no game logic, no DOM outside canvas.
 */

const Renderer = (() => {

  let ctx, canvas;

  function init(canvasEl) {
    canvas = canvasEl;
    ctx    = canvas.getContext('2d');
  }

  /* ── Helpers ────────────────────────────────── */

  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(40, 48, 60, 0.7)';
    ctx.lineWidth   = 1;
    const step = 44;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    ctx.restore();
  }

  /* ── Ball ───────────────────────────────────── */

  function drawBall(ball, radius) {
    if (ball.dead) return;

    // Trail
    ball.trail.forEach((pt, i) => {
      const progress = i / ball.trail.length;
      const alpha    = progress * 0.3;
      const size     = radius * progress * 0.75;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(size, 1), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${ball.hue}, 75%, 65%, ${alpha})`;
      ctx.fill();
    });

    // Glow
    const grd = ctx.createRadialGradient(ball.x, ball.y, 0, ball.x, ball.y, radius * 2.5);
    grd.addColorStop(0, `hsla(${ball.hue}, 90%, 65%, 0.18)`);
    grd.addColorStop(1, `hsla(${ball.hue}, 90%, 65%, 0)`);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Body
    const body = ctx.createRadialGradient(
      ball.x - radius * 0.3, ball.y - radius * 0.3, 0,
      ball.x, ball.y, radius
    );
    body.addColorStop(0, `hsl(${ball.hue}, 85%, 82%)`);
    body.addColorStop(1, `hsl(${ball.hue}, 70%, 52%)`);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = body;
    ctx.fill();
  }

  /* ── Bucket ─────────────────────────────────── */

  function drawBucket(bx, by, bw, bh) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 229, 255, 0.25)';
    ctx.shadowBlur  = 14;

    // Body
    ctx.fillStyle   = 'rgba(0, 229, 255, 0.06)';
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.7)';
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2,      by);
    ctx.lineTo(bx - bw / 2 + 10, by + bh);
    ctx.lineTo(bx + bw / 2 - 10, by + bh);
    ctx.lineTo(bx + bw / 2,      by);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rim
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.9)';
    ctx.lineWidth   = 2.5;
    ctx.beginPath();
    ctx.moveTo(bx - bw / 2 - 4, by);
    ctx.lineTo(bx + bw / 2 + 4, by);
    ctx.stroke();

    ctx.restore();
  }

  /* ── Particles (DOM-free, canvas only) ─────── */

  const particles = [];

  function spawnParticles(x, y, hue) {
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      particles.push({
        x, y,
        vx:   Math.cos(angle) * speed,
        vy:   Math.sin(angle) * speed,
        life: 1,
        hue,
        r:    2 + Math.random() * 3,
      });
    }
  }

  function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.1;
      p.life -= 0.03;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.life})`;
      ctx.fill();
    }
  }

  /* ── Idle demo animation ────────────────────── */

  let idleAngle = 0;

  function drawIdle() {
    clear();
    drawGrid();
    idleAngle += 0.012;
    const cx = canvas.width  / 2 + Math.sin(idleAngle * 0.7)  * 90;
    const cy = canvas.height * 0.38 + Math.sin(idleAngle * 1.1) * 18;
    const r  = 13;

    // Glow
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 3);
    g.addColorStop(0, 'rgba(0,229,255,0.16)');
    g.addColorStop(1, 'rgba(0,229,255,0)');
    ctx.beginPath(); ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();

    // Ball
    const bg = ctx.createRadialGradient(cx - 4, cy - 4, 0, cx, cy, r);
    bg.addColorStop(0, '#7ff0ff');
    bg.addColorStop(1, '#008fab');
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = bg; ctx.fill();

    // Demo bucket (follows ball)
    const bW = 120, bH = 22, bY = canvas.height - 42;
    const bX = cx;
    drawBucket(bX, bY, bW, bH);
  }

  return {
    init, clear, drawGrid,
    drawBall, drawBucket,
    spawnParticles, updateAndDrawParticles,
    drawIdle,
  };

})();
