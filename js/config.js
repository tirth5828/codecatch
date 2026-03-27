/**
 * config.js
 * Central configuration for CodeCatch.
 * All tuneable values live here — edit freely.
 */

const CONFIG = {
  /* ── Physics ─────────────────────────────── */
  GRAVITY:        0.25,   // px added to vy each frame
  WIND_FORCE:     0.15,   // random horizontal force scale
  WIND_DAMP:      0.98,   // velocity multiplier per frame (air resistance)
  CONST_SPEED:    2.5,    // vy when gravity is off

  /* ── Ball ────────────────────────────────── */
  BALL_RADIUS:    11,     // default ball radius (px)
  BALL_RADIUS_BIG:22,     // big-ball mode radius

  /* ── Trail ───────────────────────────────── */
  TRAIL_LENGTH:   12,     // max positions stored in trail array

  /* ── Bucket ──────────────────────────────── */
  BUCKET_WIDTH:   120,    // normal bucket width (px)
  BUCKET_WIDTH_HARD: 60,  // hard mode bucket width
  BUCKET_HEIGHT:  22,     // bucket visual height
  BUCKET_Y_OFFSET:40,     // distance from canvas bottom

  /* ── Spawning ────────────────────────────── */
  SPAWN_BASE:     150,    // frames between spawns at level 1
  SPAWN_MIN:      55,     // minimum spawn interval (higher levels)
  SPAWN_DEC:      12,     // frames subtracted per level
  MULTI_COUNT:    3,      // balls spawned in multi-ball mode

  /* ── Progression ─────────────────────────── */
  XP_PER_CATCH:   10,
  XP_STREAK_3:    15,
  XP_STREAK_5:    20,
  XP_PER_LEVEL:   100,

  /* ── Feature unlock thresholds ───────────── */
  UNLOCK_MULTI:   5,
  UNLOCK_SIZE:    10,
  UNLOCK_HARD:    15,
};

/**
 * Feature definitions — id, label, description, unlock threshold.
 * Drives both the toggle UI and the code panel.
 */
const FEATURES_DEF = [
  { id: 'gravity',  label: 'Gravity',    desc: 'Ball accelerates downward each frame',     unlock: 0  },
  { id: 'wind',     label: 'Wind',       desc: 'Random horizontal drift with damping',      unlock: 0  },
  { id: 'trail',    label: 'Trail',      desc: 'Array queue of past positions',             unlock: 0  },
  { id: 'multi',    label: 'Multi-ball', desc: 'For loop spawns multiple balls at once',    unlock: CONFIG.UNLOCK_MULTI  },
  { id: 'size',     label: 'Big Ball',   desc: 'Ternary operator switches ball radius',     unlock: CONFIG.UNLOCK_SIZE   },
  { id: 'hard',     label: 'Hard Mode',  desc: 'Narrow bucket — same logic, tighter data', unlock: CONFIG.UNLOCK_HARD   },
];

/**
 * Achievements list.
 */
const ACHIEVEMENTS = [
  { id: 'first',    icon: '🎉', name: 'First Catch!',       cond: s => s.caught >= 1  },
  { id: 'streak3',  icon: '🔥', name: '3× Streak',          cond: s => s.streak >= 3  },
  { id: 'streak7',  icon: '🌋', name: 'On Fire! ×7',        cond: s => s.streak >= 7  },
  { id: 'lvl2',     icon: '⬆️', name: 'Level 2',            cond: s => s.level  >= 2  },
  { id: 'lvl5',     icon: '🏅', name: 'Level 5',            cond: s => s.level  >= 5  },
  { id: 'catch10',  icon: '🎯', name: '10 Caught',          cond: s => s.caught >= 10 },
  { id: 'catch25',  icon: '🏆', name: '25 Caught',          cond: s => s.caught >= 25 },
  { id: 'hacker',   icon: '💻', name: 'Code Hacker',        cond: s => s.edited       },
  { id: 'unlock1',  icon: '🔓', name: 'Feature Unlocked',   cond: s => s.caught >= CONFIG.UNLOCK_MULTI },
];
