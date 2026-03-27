// content.js — code snippets shown in the panel and modal explanations.
// No dependencies on other files — pure data.

var CONTENT = {

  loop: {
    label:'Game Loop', tag:'CORE', fname:'game.js',
    concept:'Control Flow · Animation', title:'The Game Loop',
    chips:['requestAnimationFrame','Recursion','Functions','60fps','Animation'],
    snippet:
'<span class="fn">requestAnimationFrame</span>(<span class="kw">function</span> <span class="fn">loop</span>() {\n' +
'  ctx.<span class="fn">clearRect</span>(0, 0, w, h); <span class="cm">// wipe frame</span>\n' +
'  <span class="fn">update</span>(); <span class="fn">draw</span>(); <span class="fn">checkHit</span>();\n' +
'  <span class="fn">requestAnimationFrame</span>(loop); <span class="cm">// repeat</span>\n' +
'});',
    full:
'// The game loop — runs ~60 times per second.\n' +
'// Each pass is one animation "frame".\n' +
'\n' +
'function startLoop() {\n' +
'  requestAnimationFrame(function loop() {\n' +
'\n' +
'    // 1. Erase last frame\n' +
'    ctx.clearRect(0, 0, canvas.width, canvas.height);\n' +
'\n' +
'    // 2. Move everything one step forward\n' +
'    update();\n' +
'\n' +
'    // 3. Paint the new frame\n' +
'    draw();\n' +
'\n' +
'    // 4. Check bucket collisions\n' +
'    checkHit();\n' +
'\n' +
'    // 5. Schedule the NEXT frame — creates the loop\n' +
'    requestAnimationFrame(loop);\n' +
'\n' +
'  });\n' +
'}\n' +
'\n' +
'// requestAnimationFrame syncs to the display refresh rate.\n' +
'// At 60Hz that is one call every ~16.7ms.\n' +
'// It pauses automatically when the tab is hidden,\n' +
'// saving battery and CPU cycles.',
    sections:[
      { label:'What is a Game Loop?', text:'Every game — Pong to Elden Ring — runs a loop that repeats many times per second. Each pass is one <strong>frame</strong>: clear the old picture, update positions, draw the new picture.' },
      { label:'Why requestAnimationFrame?', text:'<code>requestAnimationFrame</code> tells the browser "call this right before the next screen repaint." The browser handles the timing, keeping animation smooth. It also pauses when the tab is hidden — unlike <code>setInterval</code>.' },
      { label:'The analogy', text:'📽 Like a film projector — 60 still images per second, flipped fast enough that your brain reads them as smooth motion. Each frame is one still image drawn from scratch.', isAnalogy:true },
    ],
  },

  gravity: {
    label:'Gravity', tag:null, fname:'physics.js',
    concept:'Variables · Physics Simulation', title:'Gravity & Acceleration',
    chips:['Variables','Addition','Velocity','Acceleration','Physics'],
    snippet:
'<span class="kw">if</span> (S.feat.<span class="vr">gravity</span>) {\n' +
'  ball.<span class="vr">vy</span> += <input class="ed" id="ed-grav" value="0.25" title="Gravity (px/frame²)">; <span class="cm">// px/frame²</span>\n' +
'} <span class="kw">else</span> {\n' +
'  ball.<span class="vr">vy</span> = 2.5; <span class="cm">// constant speed</span>\n' +
'}\n' +
'ball.<span class="vr">y</span> += ball.<span class="vr">vy</span>;',
    full:
'// Physics: simulating gravity with a velocity variable.\n' +
'\n' +
'// Each ball carries:\n' +
'//   .y  — vertical position in pixels\n' +
'//   .vy — vertical velocity (pixels per frame)\n' +
'\n' +
'function applyGravity(ball) {\n' +
'\n' +
'  if (features.gravity) {\n' +
'\n' +
'    // Add a constant to velocity every frame.\n' +
'    // Velocity grows → ball speeds up → acceleration.\n' +
'    ball.vy += GRAVITY; // default: 0.25\n' +
'\n' +
'    // Frame  1:  vy ≈ 0.25  (slow)\n' +
'    // Frame 10:  vy ≈ 2.5   (faster)\n' +
'    // Frame 30:  vy ≈ 7.5   (fast)\n' +
'\n' +
'  } else {\n' +
'\n' +
'    // No acceleration — constant speed every frame.\n' +
'    ball.vy = 2.5;\n' +
'\n' +
'  }\n' +
'\n' +
'  // Apply velocity to position each frame.\n' +
'  ball.y += ball.vy;\n' +
'}\n' +
'\n' +
'// This mirrors Newton\'s Second Law:\n' +
'// Force (gravity) causes acceleration,\n' +
'// acceleration changes velocity,\n' +
'// velocity changes position.',
    sections:[
      { label:'Velocity vs Acceleration', text:'<strong>Velocity</strong> (vy) is how fast the ball moves. <strong>Acceleration</strong> is how fast velocity changes. Adding a constant to vy each frame makes the ball move faster and faster — just like real freefall.' },
      { label:'Try editing it', text:'Change <code>0.25</code> to <strong>0.05</strong> for floaty moon gravity, or <strong>1.5</strong> for a heavy planet. Same code, different data — completely different feel.' },
      { label:'Newton in code', text:'🍎 Real gravity is 9.8 m/s². We use 0.25 px/frame² — the same concept, scaled to pixels. This is literally Newton\'s Second Law in three lines of code.', isAnalogy:true },
    ],
  },

  wind: {
    label:'Wind', tag:null, fname:'physics.js',
    concept:'Randomness · Damping', title:'Wind & Air Resistance',
    chips:['Math.random()','Multiplication','Damping','Randomness','Physics'],
    snippet:
'<span class="kw">if</span> (S.feat.<span class="vr">wind</span>) {\n' +
'  ball.<span class="vr">vx</span> += (Math.<span class="fn">random</span>() - 0.5) * <input class="ed" id="ed-wind" value="0.15" title="Wind force">;\n' +
'  ball.<span class="vr">vx</span> *= <input class="ed" id="ed-damp" value="0.98" title="Damping (0–1)">; <span class="cm">// air resistance</span>\n' +
'  ball.<span class="vr">x</span>  += ball.<span class="vr">vx</span>;\n' +
'}',
    full:
'// Wind: random horizontal force + damping.\n' +
'\n' +
'function applyWind(ball) {\n' +
'  if (!features.wind) return;\n' +
'\n' +
'  // Math.random() → 0.0 to 1.0\n' +
'  // Subtract 0.5  → -0.5 to +0.5  (left or right)\n' +
'  // Multiply      → scale the force\n' +
'  ball.vx += (Math.random() - 0.5) * WIND_FORCE;\n' +
'\n' +
'  // Damping: multiply velocity by a number < 1.\n' +
'  // The ball loses 2% of horizontal speed per frame.\n' +
'  // Without this, random forces would stack forever.\n' +
'  ball.vx *= WIND_DAMP; // default: 0.98\n' +
'\n' +
'  ball.x += ball.vx;\n' +
'\n' +
'  // Bounce off walls\n' +
'  if (ball.x < r) { ball.x = r; ball.vx *= -1; }\n' +
'  if (ball.x > w - r) { ball.x = w - r; ball.vx *= -1; }\n' +
'}',
    sections:[
      { label:'Randomness', text:'<code>Math.random()</code> returns a new value between 0–1 every call. Subtracting 0.5 centres it at 0, giving equal chance of pushing left or right. Multiplying scales the intensity.' },
      { label:'Damping', text:'Multiplying vx by 0.98 each frame means the ball loses 2% speed per frame. Without it, tiny random pushes would accumulate into enormous velocity. This models <strong>air resistance</strong>.' },
      { label:'Try it', text:'🍃 Set damping to <strong>0.5</strong> → barely any drift. Set it to <strong>0.999</strong> → wild swinging. Wind force <strong>1.0</strong> → violent turbulence!', isAnalogy:true },
    ],
  },

  trail: {
    label:'Trail', tag:null, fname:'physics.js',
    concept:'Arrays · Queue Data Structure', title:'Trail — Array as a Queue',
    chips:['Arrays','push()','shift()','forEach()','Queue','FIFO'],
    snippet:
'<span class="kw">if</span> (S.feat.<span class="vr">trail</span>) {\n' +
'  trail.<span class="fn">push</span>({x, y}); <span class="cm">// add newest</span>\n' +
'  <span class="kw">if</span> (trail.length > <input class="ed" id="ed-trail" value="12" title="Trail length (1–50)">)\n' +
'    trail.<span class="fn">shift</span>(); <span class="cm">// drop oldest</span>\n' +
'}',
    full:
'// Trail: a fixed-length queue of past positions.\n' +
'\n' +
'function updateTrail(ball) {\n' +
'  if (!features.trail) { ball.trail = []; return; }\n' +
'\n' +
'  // Add current position to the END of the array.\n' +
'  ball.trail.push({ x: ball.x, y: ball.y });\n' +
'\n' +
'  // If we exceeded the limit, remove from the FRONT.\n' +
'  // This is a QUEUE — First In, First Out (FIFO).\n' +
'  if (ball.trail.length > TRAIL_LENGTH) {\n' +
'    ball.trail.shift(); // removes index 0\n' +
'  }\n' +
'  // The array always holds exactly TRAIL_LENGTH items.\n' +
'}\n' +
'\n' +
'function drawTrail(ball) {\n' +
'  // forEach gives each item and its index.\n' +
'  ball.trail.forEach(function(point, index) {\n' +
'    var progress = index / ball.trail.length; // 0 → 1\n' +
'    var alpha    = progress * 0.32;           // fade in\n' +
'    var size     = radius * progress * 0.75;  // grow\n' +
'\n' +
'    ctx.beginPath();\n' +
'    ctx.arc(point.x, point.y, Math.max(size, 1), 0, Math.PI * 2);\n' +
'    ctx.fillStyle = "hsla(" + ball.hue + ", 80%, 65%, " + alpha + ")";\n' +
'    ctx.fill();\n' +
'  });\n' +
'}',
    sections:[
      { label:'What is a Queue?', text:'A <strong>queue</strong> is a list where items enter at the back and leave from the front — like a line at a shop. <strong>FIFO: First In, First Out</strong>. <code>push()</code> adds to the end; <code>shift()</code> removes from the front.' },
      { label:'forEach', text:'<code>forEach</code> runs a function once per array item, giving you the item and its index. The <code>index / length</code> fraction goes 0→1, which we use to fade opacity and size from oldest to newest.' },
      { label:'Like Snake!', text:'🐍 The Snake game body is exactly this: push new head position, shift old tail. Edit trail length to <strong>40</strong> for a comet tail, or <strong>2</strong> to nearly hide it.', isAnalogy:true },
    ],
  },

  multi: {
    label:'Multi-ball', tag:null, fname:'physics.js',
    concept:'Loops · Arrays · Iteration', title:'Multi-ball — For Loops',
    chips:['for loop','Arrays','Objects','forEach','filter()','Iteration'],
    snippet:
'<span class="cm">// spawn N balls with a for loop</span>\n' +
'<span class="kw">var</span> count = S.feat.<span class="vr">multi</span>\n' +
'  ? <input class="ed" id="ed-multi" value="3" title="Ball count (1–8)"> : 1;\n' +
'<span class="kw">for</span> (<span class="kw">var</span> i = 0; i &lt; count; i++)\n' +
'  <span class="fn">spawnBall</span>(i, count);',
    full:
'// Multi-ball: spawn N balls with a for loop.\n' +
'\n' +
'function spawnBalls() {\n' +
'  var count = features.multi ? MULTI_COUNT : 1;\n' +
'\n' +
'  // A for loop runs its body "count" times.\n' +
'  // i=0 → 1 → 2 → … → count-1, then stops.\n' +
'  for (var i = 0; i < count; i++) {\n' +
'\n' +
'    // Space balls evenly across the canvas\n' +
'    var x = (i + 1) * (canvas.width / (count + 1));\n' +
'\n' +
'    // Push a new ball object to the shared array\n' +
'    balls.push({\n' +
'      x: x, y: -radius,\n' +
'      vx: 0, vy: 0.3,\n' +
'      trail: [],\n' +
'      hue: Math.floor(Math.random() * 360),\n' +
'      dead: false,\n' +
'    });\n' +
'  }\n' +
'}\n' +
'\n' +
'// The same update/draw code handles any count:\n' +
'function updateAll() {\n' +
'  balls.forEach(function(ball) { applyPhysics(ball); });\n' +
'}\n' +
'\n' +
'// Remove dead balls after each frame:\n' +
'balls = balls.filter(function(ball) { return !ball.dead; });',
    sections:[
      { label:'For Loops', text:'<code>for (var i = 0; i &lt; count; i++)</code> — start at 0, run while i is less than count, add 1 each time. For count=3 it runs with i=0, 1, 2 — exactly 3 balls spawned.' },
      { label:'Arrays of Objects', text:'Each ball is a JavaScript <strong>object</strong> — a bundle of named values. All balls live in one <strong>array</strong>. <code>forEach</code> runs the same physics and draw code on every ball automatically.' },
      { label:'Scaling for free', text:'🔁 Change count to 6 — the loop handles it. No copy-paste, no ball1/ball2/ball3 variables. Change the number, the loop does the rest. That\'s data-driven design.', isAnalogy:true },
    ],
  },

  size: {
    label:'Big Ball', tag:null, fname:'config.js',
    concept:'Ternary Operator · Conditionals', title:'Ball Size — The Ternary Operator',
    chips:['Ternary Operator','Conditionals','if/else','DRY Principle','Constants'],
    snippet:
'<span class="cm">// condition ? ifTrue : ifFalse</span>\n' +
'<span class="kw">var</span> r = S.feat.<span class="vr">size</span>\n' +
'  ? <input class="ed" id="ed-rbig" value="22" title="Big radius (6–60)">  <span class="cm">// big mode</span>\n' +
'  : <input class="ed" id="ed-rsm"  value="11" title="Normal radius (3–30)">; <span class="cm">// normal</span>',
    full:
'// Ternary operator: compact if/else on one line.\n' +
'// Syntax: condition ? valueIfTrue : valueIfFalse\n' +
'\n' +
'function getBallRadius() {\n' +
'\n' +
'  // Verbose if/else version:\n' +
'  if (features.size === true) {\n' +
'    return BALL_R_BIG; // 22\n' +
'  } else {\n' +
'    return BALL_R;     // 11\n' +
'  }\n' +
'\n' +
'  // Exact same thing as a ternary:\n' +
'  return features.size ? BALL_R_BIG : BALL_R;\n' +
'}\n' +
'\n' +
'// The radius flows into everything automatically:\n' +
'//   drawBall()    → arc(x, y, radius)\n' +
'//   applyWind()   → wall bounce position\n' +
'//   hitsBucket()  → ball.y + radius >= bucketY\n' +
'//   isOffscreen() → ball.y - radius > height\n' +
'\n' +
'// Because all parts call getBallRadius(), one config\n' +
'// change updates the whole game.\n' +
'// This is the DRY principle: Don\'t Repeat Yourself.',
    sections:[
      { label:'Ternary Syntax', text:'<code>condition ? a : b</code> — if the condition is truthy the expression equals <strong>a</strong>, otherwise <strong>b</strong>. Great for assigning a variable without a multi-line if/else block.' },
      { label:'One Source of Truth', text:'Every part of the game that needs the radius reads the same value. Change the config once — physics, drawing, and collision all update in sync. This is the <strong>DRY</strong> (Don\'t Repeat Yourself) principle.' },
      { label:'Try it!', text:'🎲 Set big radius to <strong>5</strong> for a tiny needle-ball, or <strong>40</strong> for one that fills the screen. One edit changes the whole experience.', isAnalogy:true },
    ],
  },

  hard: {
    label:'Hard Mode', tag:null, fname:'config.js',
    concept:'Variables · Game Design', title:'Hard Mode — Data Drives Difficulty',
    chips:['Variables','Functions','Separation of Concerns','Game Design','DRY'],
    snippet:
'<span class="cm">// same logic — different number</span>\n' +
'<span class="kw">var</span> bW = S.feat.<span class="vr">hard</span>\n' +
'  ? <input class="ed" id="ed-bwh" value="60"  title="Hard bucket width (20–250)">  <span class="cm">// narrow</span>\n' +
'  : <input class="ed" id="ed-bwn" value="120" title="Normal bucket width (40–350)">; <span class="cm">// normal</span>',
    full:
'// Difficulty is controlled by one variable.\n' +
'// The game logic never changes — only the data does.\n' +
'\n' +
'function getBucketWidth() {\n' +
'  return features.hard ? BUCKET_W_HARD : BUCKET_W;\n' +
'  //                       60 (narrow)     120 (wide)\n' +
'}\n' +
'\n' +
'// drawBucket() just reads the number:\n' +
'function drawBucket() {\n' +
'  var bW = getBucketWidth();\n' +
'  ctx.moveTo(bucketX - bW / 2, bucketY); // left edge\n' +
'  ctx.lineTo(bucketX + bW / 2, bucketY); // right edge\n' +
'}\n' +
'\n' +
'// checkHit() uses the exact same number:\n' +
'function checkHit(ball) {\n' +
'  var bW  = getBucketWidth();\n' +
'  var hit =\n' +
'    ball.x > bucketX - bW / 2 &&\n' +
'    ball.x < bucketX + bW / 2 &&\n' +
'    ball.y + radius >= bucketY;\n' +
'  return hit;\n' +
'}\n' +
'\n' +
'// Neither function knows or cares about "hard mode".\n' +
'// They just read a number.\n' +
'// This is SEPARATION OF CONCERNS.',
    sections:[
      { label:'Data vs Logic', text:'The collision code does not know about hard mode — it reads a width value. Drawing does the same. Only one function holds the decision. This is <strong>Separation of Concerns</strong>: each piece of code has one job.' },
      { label:'Why it matters', text:'Both <code>drawBucket</code> and <code>checkHit</code> call the same function. They can never drift out of sync — the visual bucket and the hit zone are always identical.' },
      { label:'Real game design', text:'🎯 Every game\'s difficulty works this way: same physics engine, different numbers. Hard mode in Mario is the same code with faster enemies and smaller platforms. Set hard width to <strong>28</strong> for extreme challenge!', isAnalogy:true },
    ],
  },

  collision: {
    label:'Collision', tag:'CORE', fname:'physics.js',
    concept:'Boolean Logic · Geometry', title:'Collision Detection — AABB',
    chips:['Boolean Logic','&&','Comparisons','AABB','Geometry','2D Math'],
    snippet:
'<span class="cm">// AABB: overlap on X AND Y simultaneously</span>\n' +
'<span class="kw">var</span> hit =\n' +
'  ball.x &gt; bx - bW/2 <span class="op">&amp;&amp;</span>\n' +
'  ball.x &lt; bx + bW/2 <span class="op">&amp;&amp;</span>\n' +
'  ball.y + r &gt;= by;\n' +
'<span class="kw">if</span> (hit) <span class="fn">celebrate</span>();\n' +
'<span class="kw">else if</span> (offscreen) <span class="fn">miss</span>();',
    full:
'// AABB = Axis-Aligned Bounding Box collision.\n' +
'// Check overlap on X axis AND Y axis independently.\n' +
'\n' +
'function checkHit(ball) {\n' +
'  var r  = getBallRadius();\n' +
'  var bW = getBucketWidth();\n' +
'  var bX = getBucketX();   // bucket centre X\n' +
'  var bY = getBucketY();   // bucket rim Y\n' +
'\n' +
'  // Is ball\'s X within the bucket\'s horizontal span?\n' +
'  var inX =\n' +
'    ball.x > bX - bW / 2 &&   // right of left edge\n' +
'    ball.x < bX + bW / 2;     // left of right edge\n' +
'\n' +
'  // Has ball reached the bucket vertically?\n' +
'  var inY =\n' +
'    ball.y + r >= bY &&        // bottom touched rim\n' +
'    ball.y - r <= bY + 28;    // has not passed through\n' +
'\n' +
'  // Both must be true at the same time (&&)\n' +
'  var hit = inX && inY;\n' +
'\n' +
'  if (hit) {\n' +
'    ball.dead = true;\n' +
'    score.caught++;\n' +
'    spawnParticles(ball.x, bY, ball.hue);\n' +
'  } else if (ball.y - r > canvas.height + 10) {\n' +
'    ball.dead = true;\n' +
'    score.missed++;\n' +
'    flashRed();\n' +
'  }\n' +
'}',
    sections:[
      { label:'What is AABB?', text:'AABB checks if two axis-aligned rectangles overlap by testing each axis independently. Overlap on X <strong>AND</strong> Y at the same moment = collision. Fast because it only uses comparisons — no square roots needed.' },
      { label:'Boolean AND (&&)', text:'<code>&&</code> means both sides must be true. If the ball is over the bucket (inX=true) but has not reached its height yet (inY=false), the expression is false — no hit. All conditions must pass simultaneously.' },
      { label:'Everywhere in games', text:'📦 AABB powers thousands of games: platformers, shooters, puzzle games. It\'s the go-to because it\'s simple and cheap. Circle vs circle needs trig; box vs box just needs < and >.', isAnalogy:true },
    ],
  },

};
