// state.js — shared mutable game state.
// Loaded after config.js. All other files read/write S directly.
// canvas, ctx, gp are assigned in main.js after DOM is ready.

var S = {
  running: false,
  frame:   0,
  balls:   [],
  bucketX: 0,
  caught:  0,
  missed:  0,
  streak:  0,
  xp:      0,
  level:   1,
  edited:  false,
  feat: {
    gravity: true,
    wind:    true,
    trail:   true,
    multi:   false,
    size:    false,
    hard:    false,
  },
};

var achUnlocked = new Set();
var animId      = null;

// Canvas references — set by main.js on DOMContentLoaded.
var canvas = null;
var ctx    = null;
var gp     = null;
