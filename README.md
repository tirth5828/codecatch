# CodeCatch

A minimalist browser game where you **learn programming concepts by playing**.

A ball drops from the top of the screen. Move your mouse to position the bucket and catch it. As you play, the actual JavaScript powering each feature is visible — click any block to read a plain-English explanation, and edit the orange numbers to change the physics in real time.

**[▶ Play it →](https://YOUR-USERNAME.github.io/codecatch)**

---

## Features

| Feature | Concept taught |
|---|---|
| Gravity | Velocity, acceleration, Newton's 2nd Law |
| Wind | Randomness (`Math.random`), damping, air resistance |
| Trail | Arrays, `push()`, `shift()`, queue data structure |
| Multi-ball | `for` loops, iteration, array of objects |
| Big Ball | Ternary operator, conditionals, DRY principle |
| Hard Mode | Variables, separation of concerns, game design |
| Collision | Boolean logic (`&&`), AABB geometry |
| Game Loop | `requestAnimationFrame`, recursion, 60fps animation |

- 🏆 **9 achievements** — earned by catching balls, building streaks, levelling up, and editing code
- 🔒 **Progressive unlocks** — 3 features locked until you catch enough balls
- 📝 **Editable code values** — change gravity strength, wind force, trail length, ball size, and bucket width live while playing
- 💡 **Explanation modal** — click any code block for a full annotated version with CS concept tags and plain-English breakdown

---

## File Structure

```
codecatch/
├── index.html        ← HTML shell (no logic)
├── css/
│   └── style.css     ← All styling (CSS variables, dark theme)
└── js/
    ├── config.js     ← All tunable constants & feature definitions
    ├── physics.js    ← Pure physics: gravity, wind, trail, collision
    ├── renderer.js   ← Canvas drawing: balls, bucket, particles, grid
    ├── content.js    ← All code snippets & explanation text
    ├── game.js       ← Game state, loop, scoring, progression
    ├── ui.js         ← DOM: toggles, code panel, modal, score display
    └── main.js       ← Entry point: wires all modules together
```

Each file has **one responsibility**. Physics knows nothing about the DOM. The renderer knows nothing about scoring. This mirrors real-world separation of concerns.

---

## Deploy to GitHub Pages

1. Fork or clone this repo
2. Push to `main` (or `master`)
3. Go to **Settings → Pages → Source → Deploy from branch → main / (root)**
4. Your game will be live at `https://YOUR-USERNAME.github.io/REPO-NAME`

No build step, no dependencies, no bundler. Pure HTML + CSS + JS.

---

## Hacking it

All tuneable values are in `js/config.js`. Change them there to set new defaults:

```js
CONFIG.GRAVITY        = 0.25;   // try 0.05 (moon) or 1.5 (jupiter)
CONFIG.TRAIL_LENGTH   = 12;     // longer = comet tail
CONFIG.BUCKET_WIDTH   = 120;    // wider = easier
CONFIG.MULTI_COUNT    = 3;      // more balls when multi is on
```

To add a new feature:

1. Add a constant to `config.js`
2. Add the feature definition to `FEATURES_DEF` in `config.js`
3. Add the physics in `physics.js`
4. Add the code snippet + explanation in `content.js`
5. Wire it up in `game.js`

---

## License

MIT
