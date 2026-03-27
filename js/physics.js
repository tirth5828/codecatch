/**
 * physics.js
 * Pure physics functions — no DOM, no canvas, no state.
 * Each function takes a ball object and mutates it in place.
 */

const Physics = (() => {

  /**
   * Apply gravity or constant speed to vertical velocity.
   * @param {Object} ball
   * @param {boolean} gravityOn
   */
  function applyGravity(ball, gravityOn) {
    if (gravityOn) {
      ball.vy += CONFIG.GRAVITY;
    } else {
      ball.vy = CONFIG.CONST_SPEED;
    }
    ball.y += ball.vy;
  }

  /**
   * Apply random wind force with damping; bounce off walls.
   * @param {Object} ball
   * @param {boolean} windOn
   * @param {number}  canvasWidth
   * @param {number}  radius
   */
  function applyWind(ball, windOn, canvasWidth, radius) {
    if (!windOn) return;

    // Random left/right force
    ball.vx += (Math.random() - 0.5) * CONFIG.WIND_FORCE;
    // Air resistance
    ball.vx *= CONFIG.WIND_DAMP;
    ball.x  += ball.vx;

    // Wall bounce
    if (ball.x < radius) {
      ball.x  = radius;
      ball.vx *= -1;
    }
    if (ball.x > canvasWidth - radius) {
      ball.x  = canvasWidth - radius;
      ball.vx *= -1;
    }
  }

  /**
   * Update trail array — acts as a fixed-length queue.
   * @param {Object}  ball
   * @param {boolean} trailOn
   */
  function updateTrail(ball, trailOn) {
    if (!trailOn) {
      ball.trail = [];
      return;
    }
    ball.trail.push({ x: ball.x, y: ball.y });
    if (ball.trail.length > CONFIG.TRAIL_LENGTH) {
      ball.trail.shift(); // FIFO — remove oldest
    }
  }

  /**
   * AABB collision: check if ball overlaps the bucket rim.
   * @param {Object} ball
   * @param {number} radius
   * @param {number} bucketX   — bucket centre x
   * @param {number} bucketY   — bucket rim y
   * @param {number} bucketW   — bucket width
   * @returns {boolean}
   */
  function hitsBucket(ball, radius, bucketX, bucketY, bucketW) {
    const inX = ball.x > bucketX - bucketW / 2 &&
                ball.x < bucketX + bucketW / 2;
    const inY = ball.y + radius >= bucketY &&
                ball.y - radius <= bucketY + 30;
    return inX && inY;
  }

  /**
   * Returns true if the ball has fallen off the bottom.
   * @param {Object} ball
   * @param {number} radius
   * @param {number} canvasHeight
   * @returns {boolean}
   */
  function isOffscreen(ball, radius, canvasHeight) {
    return ball.y - radius > canvasHeight + 10;
  }

  /**
   * Factory: create a new ball object.
   * @param {number} x
   * @param {number} radius
   * @param {boolean} gravityOn
   * @returns {Object}
   */
  function createBall(x, radius, gravityOn) {
    return {
      x,
      y:     -radius - Math.random() * 20,
      vx:    0,
      vy:    gravityOn ? 0.2 + Math.random() * 0.3 : CONFIG.CONST_SPEED,
      trail: [],
      hue:   Math.floor(Math.random() * 360),
      dead:  false,
    };
  }

  return { applyGravity, applyWind, updateTrail, hitsBucket, isOffscreen, createBall };

})();
