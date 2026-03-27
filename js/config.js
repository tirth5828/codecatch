// config.js — all tuneable constants, feature list, achievements.
// Loaded first. Everything else reads from CFG, FEAT_DEF, ACHS.

var CFG = {
  GRAVITY:       0.25,
  WIND_FORCE:    0.15,
  WIND_DAMP:     0.98,
  CONST_SPEED:   2.5,
  BALL_R:        11,
  BALL_R_BIG:    22,
  TRAIL_LEN:     12,
  BUCKET_W:      120,
  BUCKET_W_HARD: 60,
  BUCKET_H:      22,
  BUCKET_OFF:    40,
  SPAWN_BASE:    150,
  SPAWN_MIN:     55,
  SPAWN_DEC:     12,
  MULTI_CNT:     3,
  XP_CATCH:      10,
  XP_STR3:       15,
  XP_STR5:       20,
  XP_LEVEL:      100,
};

var FEAT_DEF = [
  { id:'gravity', label:'Gravity',    desc:'Acceleration each frame', unlock:0  },
  { id:'wind',    label:'Wind',       desc:'Random horizontal drift',  unlock:0  },
  { id:'trail',   label:'Trail',      desc:'Array queue of positions', unlock:0  },
  { id:'multi',   label:'Multi-ball', desc:'For loop spawns N balls',  unlock:5  },
  { id:'size',    label:'Big Ball',   desc:'Ternary switches radius',  unlock:10 },
  { id:'hard',    label:'Hard Mode',  desc:'Narrow bucket — harder',   unlock:15 },
];

// Note: cond functions reference S which is defined in state.js (loaded after this).
// This is fine — cond() is only ever *called* at runtime, not at parse time.
var ACHS = [
  { id:'a1', icon:'🎉', name:'First Catch!',     cond:function(){ return S.caught>=1;  } },
  { id:'a2', icon:'🔥', name:'3× Streak',        cond:function(){ return S.streak>=3;  } },
  { id:'a3', icon:'🌋', name:'On Fire! ×7',      cond:function(){ return S.streak>=7;  } },
  { id:'a4', icon:'⬆️', name:'Level 2!',         cond:function(){ return S.level>=2;   } },
  { id:'a5', icon:'🏅', name:'Level 5',          cond:function(){ return S.level>=5;   } },
  { id:'a6', icon:'🎯', name:'10 Caught',        cond:function(){ return S.caught>=10; } },
  { id:'a7', icon:'🏆', name:'25 Caught',        cond:function(){ return S.caught>=25; } },
  { id:'a8', icon:'💻', name:'Code Hacker!',     cond:function(){ return S.edited;     } },
  { id:'a9', icon:'🔓', name:'Feature Unlocked', cond:function(){ return S.caught>=5;  } },
];
