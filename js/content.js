/**
 * content.js
 * All code snippets and explanation text for the panel & modal.
 * Separated from UI logic for easy editing.
 */

const CONTENT = {

  loop: {
    label:   'Game Loop',
    tag:     'CORE',
    fname:   'game.js',
    concept: 'Control Flow · Animation',
    title:   'The Game Loop',
    chips:   ['requestAnimationFrame', 'Recursion', 'Functions', '60fps', 'Animation'],
    snippet: `<span class="fn">requestAnimationFrame</span>(<span class="kw">function</span> <span class="fn">loop</span>() {
  ctx.<span class="fn">clearRect</span>(0, 0, w, h); <span class="cm">// wipe</span>
  <span class="fn">update</span>(); <span class="fn">draw</span>(); <span class="fn">checkHit</span>();
  <span class="fn">requestAnimationFrame</span>(loop); <span class="cm">// repeat</span>
});`,
    fullCode: `// The game loop runs ~60 times per second.
// Each call is one "frame" of animation.

function startLoop() {
  requestAnimationFrame(function loop() {

    // 1. Wipe canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Move all balls one step forward
    update();

    // 3. Draw the new frame
    draw();

    // 4. Check if any ball hit the bucket
    checkHit();

    // 5. Schedule the next frame — creates the loop
    requestAnimationFrame(loop);

  });
}

// requestAnimationFrame syncs to the display (60–120Hz).
// It pauses when the tab is hidden, saving battery.`,
    sections: [
      {
        label: 'What is a Game Loop?',
        text:  'Every game—from Pong to Elden Ring—runs a loop that repeats many times per second. Each pass is one <strong>frame</strong>: clear the old picture, update the world, draw the new picture.',
      },
      {
        label: 'Why requestAnimationFrame?',
        text:  '<code>requestAnimationFrame</code> tells the browser "run this just before the next screen repaint." The browser picks the timing, keeping it smooth (60fps or 120fps). It also pauses automatically when your tab is hidden — no wasted CPU.',
      },
      {
        label: 'Real-world analogy',
        text:  '📽 Like a film projector: 60 still images per second, flipped so fast your brain reads them as motion. Each frame is one still image, drawn from scratch.',
        isAnalogy: true,
      },
    ],
  },

  gravity: {
    label:   'Gravity',
    tag:     null,   // toggled: ACTIVE / INACTIVE
    fname:   'physics.js',
    concept: 'Variables · Physics Simulation',
    title:   'Gravity & Acceleration',
    chips:   ['Variables', 'Addition Assignment', 'Velocity', 'Acceleration', 'Physics'],
    editKey: 'GRAVITY',
    snippet: `<span class="kw">if</span> (features.<span class="vr">gravity</span>) {
  ball.<span class="vr">vy</span> += <span class="ed" data-key="GRAVITY" data-min="0.01" data-max="3">0.25</span>; <span class="cm">// px/frame²</span>
} <span class="kw">else</span> {
  ball.<span class="vr">vy</span> = 2.5; <span class="cm">// constant</span>
}
ball.<span class="vr">y</span> += ball.<span class="vr">vy</span>;`,
    fullCode: `// Physics: simulating gravity with velocity.

// Each ball has:
//   .y  — current vertical position (pixels)
//   .vy — vertical velocity (pixels per frame)

function applyGravity(ball) {

  if (features.gravity) {

    // ACCELERATION: add a constant to velocity each frame.
    // Velocity grows → ball speeds up over time.
    ball.vy += GRAVITY; // default: 0.25

    // Frame  1:  vy ≈ 0.25  → moves 0.25 px
    // Frame 10:  vy ≈ 2.5   → moves 2.5 px
    // Frame 30:  vy ≈ 7.5   → moves 7.5 px

  } else {

    // CONSTANT SPEED: no acceleration.
    ball.vy = 2.5; // same every frame

  }

  // Apply velocity: position moves by velocity each frame.
  ball.y += ball.vy;
}

// This mirrors Newton's 2nd Law in miniature:
// Force (gravity) → acceleration → velocity → position.`,
    sections: [
      {
        label: 'Velocity vs Acceleration',
        text:  '<strong>Velocity</strong> (vy) is how fast the ball moves downward. <strong>Acceleration</strong> is how fast velocity changes. Adding a constant to vy each frame makes the ball move faster and faster — just like real freefall.',
      },
      {
        label: 'The Numbers',
        text:  'Edit <code>0.25</code> to <strong>0.05</strong> for floaty moon gravity, or <strong>1.5</strong> for a super-heavy planet. The same code, different data — different feel.',
      },
      {
        label: 'Newton\'s Laws in code',
        text:  '🍎 Real-life gravity is 9.8 m/s². We add 0.25 px/frame² instead — same concept, scaled to pixels. This is literally Newton\'s second law implemented in ~3 lines.',
        isAnalogy: true,
      },
    ],
  },

  wind: {
    label:   'Wind',
    tag:     null,
    fname:   'physics.js',
    concept: 'Randomness · Damping',
    title:   'Wind & Air Resistance',
    chips:   ['Math.random()', 'Multiplication', 'Damping', 'Physics', 'Randomness'],
    editKeys: ['WIND_FORCE', 'WIND_DAMP'],
    snippet: `<span class="kw">if</span> (features.<span class="vr">wind</span>) {
  ball.<span class="vr">vx</span> += (Math.<span class="fn">random</span>() - 0.5)
             * <span class="ed" data-key="WIND_FORCE" data-min="0" data-max="2">0.15</span>;
  ball.<span class="vr">vx</span> *= <span class="ed" data-key="WIND_DAMP" data-min="0" data-max="0.9999">0.98</span>; <span class="cm">// damping</span>
  ball.<span class="vr">x</span>  += ball.<span class="vr">vx</span>;
}`,
    fullCode: `// Wind: random horizontal force with damping.

function applyWind(ball) {
  if (!features.wind) return;

  // Math.random() → 0.0 to 1.0
  // Subtract 0.5  → -0.5 to +0.5  (left OR right)
  // Multiply      → scale the force
  const force = (Math.random() - 0.5) * WIND_FORCE;
  ball.vx += force;

  // DAMPING: multiply by a number slightly below 1.
  // Ball loses 2% of horizontal speed every frame.
  // Without this, tiny forces would accumulate forever.
  ball.vx *= WIND_DAMP; // default: 0.98

  // Apply horizontal velocity to position
  ball.x += ball.vx;

  // Keep ball on screen — bounce off walls
  if (ball.x < radius) {
    ball.x  = radius;
    ball.vx *= -1;        // reverse direction
  }
  if (ball.x > canvas.width - radius) {
    ball.x  = canvas.width - radius;
    ball.vx *= -1;
  }
}`,
    sections: [
      {
        label: 'Randomness in Code',
        text:  '<code>Math.random()</code> returns a new number between 0 and 1 every call. Subtracting 0.5 centres it at 0 — equal chance of pushing left or right. Multiplying scales the intensity.',
      },
      {
        label: 'What is Damping?',
        text:  'Multiplying velocity by 0.98 each frame means the ball loses 2% speed per frame. This bounds the velocity — without it, small random forces would stack up and the ball would fly off screen. It models <strong>air resistance</strong>.',
      },
      {
        label: 'Try it!',
        text:  '🍃 Set damping to <strong>0.5</strong> → barely drifts. Set it to <strong>0.999</strong> → wild swinging. Set wind force to <strong>1.0</strong> → violent turbulence.',
        isAnalogy: true,
      },
    ],
  },

  trail: {
    label:   'Trail',
    tag:     null,
    fname:   'physics.js',
    concept: 'Arrays · Queue Data Structure',
    title:   'Trail — Array as a Queue',
    chips:   ['Arrays', 'push()', 'shift()', 'forEach()', 'Queue', 'FIFO'],
    editKey: 'TRAIL_LENGTH',
    snippet: `<span class="kw">if</span> (features.<span class="vr">trail</span>) {
  trail.<span class="fn">push</span>({x, y}); <span class="cm">// add newest</span>
  <span class="kw">if</span> (trail.length > <span class="ed" data-key="TRAIL_LENGTH" data-min="1" data-max="50" data-int="1">12</span>)
    trail.<span class="fn">shift</span>(); <span class="cm">// drop oldest</span>
}`,
    fullCode: `// Trail: a fixed-length queue of past positions.
// Demonstrates: arrays, push, shift, forEach.

function updateTrail(ball) {
  if (!features.trail) {
    ball.trail = [];
    return;
  }

  // Add current position to the END of the array.
  ball.trail.push({ x: ball.x, y: ball.y });

  // If we've exceeded the limit, remove from the FRONT.
  // This is a QUEUE (FIFO — First In, First Out).
  if (ball.trail.length > TRAIL_LENGTH) {
    ball.trail.shift(); // removes index 0
  }
  // Invariant: ball.trail.length is always ≤ TRAIL_LENGTH.
}

function drawTrail(ball) {
  // forEach gives us each item and its index.
  ball.trail.forEach((point, index) => {

    // index/length → 0.0 (oldest) to 1.0 (newest)
    const progress = index / ball.trail.length;
    const alpha    = progress * 0.32;         // fade in
    const size     = radius * progress * 0.75; // grow

    ctx.beginPath();
    ctx.arc(point.x, point.y, Math.max(size, 1), 0, Math.PI * 2);
    ctx.fillStyle = \`hsla(\${ball.hue}, 80%, 65%, \${alpha})\`;
    ctx.fill();
  });
}`,
    sections: [
      {
        label: 'What is a Queue?',
        text:  'A <strong>queue</strong> is a list where items enter at the back and leave from the front — like a line at a coffee shop. <strong>First In, First Out (FIFO)</strong>. <code>push()</code> adds to the end; <code>shift()</code> removes from the front.',
      },
      {
        label: 'forEach explained',
        text:  '<code>forEach</code> runs a function once for every item in an array, automatically giving you the item and its index. The index / length fraction goes 0→1, which we use to gradually fade opacity and shrink the size.',
      },
      {
        label: 'Like Snake!',
        text:  '🐍 The Snake game body is the same idea: push the new head, shift the old tail. Edit trail length to <strong>40</strong> for a long comet tail, or <strong>2</strong> to barely see it.',
        isAnalogy: true,
      },
    ],
  },

  multi: {
    label:   'Multi-ball',
    tag:     null,
    fname:   'game.js',
    concept: 'Loops · Arrays · Iteration',
    title:   'Multi-ball — For Loops',
    chips:   ['for loop', 'Arrays', 'Objects', 'forEach', 'filter()', 'Iteration'],
    editKey: 'MULTI_COUNT',
    snippet: `<span class="cm">// loop spawns N balls at once</span>
<span class="kw">const</span> count = features.<span class="vr">multi</span>
  ? <span class="ed" data-key="MULTI_COUNT" data-min="1" data-max="8" data-int="1">3</span> : 1;
<span class="kw">for</span> (<span class="kw">let</span> i = 0; i &lt; count; i++)
  <span class="fn">spawnBall</span>();`,
    fullCode: `// Multi-ball spawning with a for loop.
// All balls share the same array — same code, any count.

function spawnBalls() {
  const count = features.multi ? MULTI_COUNT : 1;

  // A for loop runs the body 'count' times.
  // i=0 → i=1 → i=2 → … → i=count-1, then stops.
  for (let i = 0; i < count; i++) {

    // Spread balls evenly across canvas width
    const x = (i + 1) * (canvas.width / (count + 1));

    // Push a new ball object to the shared array
    balls.push({
      x,
      y:     -radius,
      vx:    0,
      vy:    0.3,
      trail: [],
      hue:   Math.floor(Math.random() * 360),
      dead:  false,
    });
  }
}

// Same update and draw code handles 1 or 8 balls:
function updateAll() {
  balls.forEach(ball => applyPhysics(ball));
}

// Filter removes dead balls after each frame:
balls = balls.filter(ball => !ball.dead);`,
    sections: [
      {
        label: 'For Loops',
        text:  '<code>for (let i = 0; i &lt; count; i++)</code> means: start i at 0, keep going while i is less than count, add 1 each time. For count=3 it runs with i=0, 1, 2 — exactly 3 balls spawned.',
      },
      {
        label: 'Arrays of Objects',
        text:  'Each ball is a JavaScript <strong>object</strong> — a named bundle of values. We store all balls in one <strong>array</strong>. <code>forEach</code> then runs the same physics and draw code on every ball automatically.',
      },
      {
        label: 'Scaling for free',
        text:  '🔁 Change count to 6 — the loop handles it. You never write separate code for ball1, ball2, ball3. This is data-driven design: the logic stays fixed, only the number changes.',
        isAnalogy: true,
      },
    ],
  },

  size: {
    label:   'Big Ball',
    tag:     null,
    fname:   'config.js',
    concept: 'Ternary Operator · Conditionals',
    title:   'Ball Size — The Ternary Operator',
    chips:   ['Ternary Operator', 'Conditionals', 'if/else', 'DRY Principle', 'Constants'],
    snippet: `<span class="cm">// condition ? ifTrue : ifFalse</span>
<span class="kw">const</span> r = features.<span class="vr">size</span>
  ? <span class="ed" data-key="BALL_RADIUS_BIG" data-min="6" data-max="60">22</span>  <span class="cm">// big mode</span>
  : <span class="ed" data-key="BALL_RADIUS" data-min="3" data-max="30">11</span>; <span class="cm">// normal</span>`,
    fullCode: `// The ternary operator: a compact if/else expression.
// Syntax: condition ? valueIfTrue : valueIfFalse

function getBallRadius() {

  // Verbose if/else:
  if (features.size === true) {
    return BALL_RADIUS_BIG; // 22
  } else {
    return BALL_RADIUS;     // 11
  }

  // Identical, written as a ternary:
  return features.size ? BALL_RADIUS_BIG : BALL_RADIUS;
}

// The radius propagates to everything automatically:
//   drawBall()    → arc(x, y, radius)
//   applyWind()   → wall bounce offset
//   hitsBucket()  → ball.y + radius >= bucketY
//   isOffscreen() → ball.y - radius > height

// Because every part calls getBallRadius(), changing
// ONE config value updates the whole game.
// This is the DRY principle: Don't Repeat Yourself.`,
    sections: [
      {
        label: 'Ternary Syntax',
        text:  '<code>condition ? a : b</code> — if the condition is truthy the expression equals <strong>a</strong>, otherwise <strong>b</strong>. Great for one-line variable assignment instead of a multi-line if/else block.',
      },
      {
        label: 'One Source of Truth',
        text:  'Every part of the game that needs the radius calls the same function. Change the config once — physics, drawing, and collision all update in sync. This is the <strong>DRY</strong> (Don\'t Repeat Yourself) principle.',
      },
      {
        label: 'Try it!',
        text:  '🎲 Set big radius to <strong>5</strong> for a tiny needle-ball, or <strong>40</strong> for a monster that fills the screen. The ternary makes one edit change the whole experience.',
        isAnalogy: true,
      },
    ],
  },

  hard: {
    label:   'Hard Mode',
    tag:     null,
    fname:   'config.js',
    concept: 'Variables · Game Design',
    title:   'Hard Mode — Data Drives Difficulty',
    chips:   ['Variables', 'Functions', 'Separation of Concerns', 'Game Design', 'DRY'],
    snippet: `<span class="cm">// same logic, different number</span>
<span class="kw">const</span> bW = features.<span class="vr">hard</span>
  ? <span class="ed" data-key="BUCKET_WIDTH_HARD" data-min="20" data-max="250">60</span>  <span class="cm">// narrow</span>
  : <span class="ed" data-key="BUCKET_WIDTH" data-min="40" data-max="350">120</span>; <span class="cm">// normal</span>`,
    fullCode: `// Difficulty controlled by one variable.
// The game logic never changes — only the data does.

function getBucketWidth() {
  return features.hard ? BUCKET_WIDTH_HARD : BUCKET_WIDTH;
  //                      60 (narrow)         120 (wide)
}

// drawBucket() just reads the number:
function drawBucket() {
  const bW = getBucketWidth(); // ← reads our value
  ctx.moveTo(bucketX - bW / 2, bucketY); // left edge
  ctx.lineTo(bucketX + bW / 2, bucketY); // right edge
  // ...
}

// checkHit() uses the same number:
function checkHit(ball) {
  const bW = getBucketWidth(); // same call
  const hit =
    ball.x > bucketX - bW / 2 &&
    ball.x < bucketX + bW / 2 &&
    ball.y + radius >= bucketY;
  return hit;
}

// Neither function knows about "hard mode".
// They just read a number. This is called
// SEPARATION OF CONCERNS — each function does one job.`,
    sections: [
      {
        label: 'Data vs Logic',
        text:  'The collision code does not know about hard mode — it just reads a width value. The drawing code is the same. Only <code>getBucketWidth()</code> holds the decision. This is <strong>Separation of Concerns</strong>.',
      },
      {
        label: 'Why it matters',
        text:  'Both <code>drawBucket</code> and <code>checkHit</code> call the same function. They can never go out of sync — the drawn bucket and the collision zone are always identical.',
      },
      {
        label: 'Real game design',
        text:  '🎯 This is how every game\'s difficulty works: same physics engine, different numbers. Hard mode in Mario is faster enemies and smaller platforms — the code is identical. Set hard width to <strong>28</strong> for extreme challenge!',
        isAnalogy: true,
      },
    ],
  },

  collision: {
    label:   'Collision',
    tag:     'CORE',
    fname:   'physics.js',
    concept: 'Boolean Logic · Geometry',
    title:   'Collision Detection — AABB',
    chips:   ['Boolean Logic', '&&', 'Comparison Operators', 'AABB', 'Geometry'],
    snippet: `<span class="cm">// AABB: overlap on X AND Y axes</span>
<span class="kw">const</span> hit =
  ball.x &gt; bx - bW/2 <span class="op">&amp;&amp;</span>
  ball.x &lt; bx + bW/2 <span class="op">&amp;&amp;</span>
  ball.y + r &gt;= by;

<span class="kw">if</span> (hit) <span class="fn">celebrate</span>();
<span class="kw">else if</span> (offscreen) <span class="fn">miss</span>();`,
    fullCode: `// AABB = Axis-Aligned Bounding Box collision.
// Check if two shapes overlap on the X axis AND Y axis.

function checkHit(ball) {
  const r  = getBallRadius();
  const bW = getBucketWidth();
  const bX = getBucketX();    // bucket centre X
  const bY = getBucketY();    // bucket rim Y

  // Is ball's X within the bucket's horizontal span?
  const inX =
    ball.x > bX - bW / 2 &&  // right of left edge
    ball.x < bX + bW / 2;    // left of right edge

  // Has ball reached the bucket vertically?
  const inY =
    ball.y + r >= bY &&       // ball bottom touched rim
    ball.y - r <= bY + 30;    // hasn't passed through

  // Both must be true at the same moment (&&)
  const hit = inX && inY;

  if (hit) {
    ball.dead = true;
    score.caught++;
    spawnParticles(ball.x, bY, ball.hue);

  } else if (ball.y - r > canvas.height + 10) {
    // Ball has left the bottom of the screen — missed!
    ball.dead = true;
    score.missed++;
    flashRed();
  }
}`,
    sections: [
      {
        label: 'What is AABB?',
        text:  'AABB checks if two axis-aligned rectangles overlap by testing each axis separately. Overlap on X <strong>AND</strong> Y simultaneously = collision. It\'s fast because it only uses comparisons — no square roots needed.',
      },
      {
        label: 'Boolean AND (&&)',
        text:  '<code>&&</code> means both sides must be true. If the ball is centred over the bucket (inX = true) but hasn\'t reached its height yet (inY = false), the whole expression is false — no hit. All three conditions must pass at the same moment.',
      },
      {
        label: 'Everywhere in games',
        text:  '📦 AABB powers thousands of games: platformers, shooters, puzzle games. It\'s the go-to because it\'s simple and cheap. Circle vs circle needs trigonometry; box vs box just needs < and >.',
        isAnalogy: true,
      },
    ],
  },

};
