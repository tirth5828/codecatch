// renderer.js — all canvas drawing functions.
// Depends on: config.js, state.js (CFG, S, canvas, ctx, gp)
// physics.js helpers (ballR, bucketX, bucketY, bucketW) used here.

// ── Grid ──────────────────────────────────────
function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'rgba(40,48,60,.65)';
  ctx.lineWidth = 1;
  for (var x=0; x<canvas.width; x+=44) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke();
  }
  for (var y=0; y<canvas.height; y+=44) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke();
  }
  ctx.restore();
}

// ── Balls ─────────────────────────────────────
function drawBalls() {
  var r = ballR();
  S.balls.forEach(function(b) {
    if (b.dead) return;

    // Trail
    b.trail.forEach(function(pt, i) {
      var p = i / b.trail.length;
      var a = p * 0.3;
      var s = r * p * 0.75;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, Math.max(s,1), 0, Math.PI*2);
      ctx.fillStyle = 'hsla('+b.hue+',75%,65%,'+a+')';
      ctx.fill();
    });

    // Glow
    var g = ctx.createRadialGradient(b.x,b.y,0, b.x,b.y,r*2.5);
    g.addColorStop(0, 'hsla('+b.hue+',90%,65%,.18)');
    g.addColorStop(1, 'hsla('+b.hue+',90%,65%,0)');
    ctx.beginPath(); ctx.arc(b.x,b.y,r*2.5,0,Math.PI*2);
    ctx.fillStyle = g; ctx.fill();

    // Body
    var bg = ctx.createRadialGradient(b.x-r*.3, b.y-r*.3, 0, b.x, b.y, r);
    bg.addColorStop(0, 'hsl('+b.hue+',85%,82%)');
    bg.addColorStop(1, 'hsl('+b.hue+',70%,52%)');
    ctx.beginPath(); ctx.arc(b.x,b.y,r,0,Math.PI*2);
    ctx.fillStyle = bg; ctx.fill();
  });
}

// ── Bucket ────────────────────────────────────
function drawBucket() {
  var bw = bucketW();
  var bh = CFG.BUCKET_H;
  var bx = bucketX();
  var by = bucketY();

  ctx.save();
  ctx.shadowColor = 'rgba(0,212,238,.25)';
  ctx.shadowBlur  = 14;
  ctx.fillStyle   = 'rgba(0,212,238,.06)';
  ctx.strokeStyle = 'rgba(0,212,238,.7)';
  ctx.lineWidth   = 1.5;
  ctx.beginPath();
  ctx.moveTo(bx-bw/2,    by);
  ctx.lineTo(bx-bw/2+10, by+bh);
  ctx.lineTo(bx+bw/2-10, by+bh);
  ctx.lineTo(bx+bw/2,    by);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = 'rgba(0,212,238,.9)';
  ctx.lineWidth   = 2.5;
  ctx.beginPath();
  ctx.moveTo(bx-bw/2-4, by);
  ctx.lineTo(bx+bw/2+4, by);
  ctx.stroke();
  ctx.restore();
}

// ── Canvas particles ──────────────────────────
var pts = [];

function spawnParticles(x, y, hue) {
  for (var i=0; i<14; i++) {
    var a  = (i/14) * Math.PI*2;
    var sp = 1.5 + Math.random()*3;
    pts.push({ x:x, y:y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, life:1, hue:hue, r:2+Math.random()*3 });
  }
}

function drawParticles() {
  for (var i=pts.length-1; i>=0; i--) {
    var p = pts[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.03;
    if (p.life <= 0) { pts.splice(i,1); continue; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r*p.life, 0, Math.PI*2);
    ctx.fillStyle = 'hsla('+p.hue+',85%,65%,'+p.life+')';
    ctx.fill();
  }
}

// ── Idle demo animation ───────────────────────
var idleT = 0;

function idleLoop() {
  if (S.running) return;
  idleT += 0.012;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  var cx = canvas.width/2  + Math.sin(idleT*0.7)*90;
  var cy = canvas.height*0.38 + Math.sin(idleT*1.1)*18;
  var r  = 13;

  var g = ctx.createRadialGradient(cx,cy,0, cx,cy,r*3);
  g.addColorStop(0,'rgba(0,212,238,.16)');
  g.addColorStop(1,'rgba(0,212,238,0)');
  ctx.beginPath(); ctx.arc(cx,cy,r*3,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();

  var bg = ctx.createRadialGradient(cx-4,cy-4,0, cx,cy,r);
  bg.addColorStop(0,'#7ff0ff'); bg.addColorStop(1,'#008fab');
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=bg; ctx.fill();

  var bw=120, bh=22, by=canvas.height-42, bx=cx;
  ctx.save();
  ctx.shadowColor='rgba(0,212,238,.25)'; ctx.shadowBlur=14;
  ctx.fillStyle='rgba(0,212,238,.06)'; ctx.strokeStyle='rgba(0,212,238,.7)'; ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(bx-bw/2,by); ctx.lineTo(bx-bw/2+10,by+bh);
  ctx.lineTo(bx+bw/2-10,by+bh); ctx.lineTo(bx+bw/2,by);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='rgba(0,212,238,.9)'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.moveTo(bx-bw/2-4,by); ctx.lineTo(bx+bw/2+4,by); ctx.stroke();
  ctx.restore();

  requestAnimationFrame(idleLoop);
}

// ── Main game draw ─────────────────────────── 
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawBalls();
  drawBucket();
  drawParticles();
}
