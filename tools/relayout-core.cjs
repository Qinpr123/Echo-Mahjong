'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
global.window = {};
require(path.join(ROOT, 'demo/assets/levels.js'));
const LEVELS = window.FUANG_LEVELS;

// L13-L20: wide 6-column base, fewer tiles on every layer above it, upper
// layers split into 2-4 islands. Rows are staggered with a half-cell offset
// (see ROW_SHIFT) so the silhouette reads as brickwork, not a neat stack.
const SHAPES = {
  13: [ // 20/8/6 = 34
    ['.XXX..', 'XXXXX.', 'XXXXXX', '.XXXX.', '..XX..'],
    ['......', '.XX...', '.X..X.', '...XX.', '..XX..'],
    ['......', '.XX...', '.X..X.', '...XX.']
  ],
  14: [ // 22/8/6 = 36
    ['.XXX..', 'XXXXX.', 'XXXXXX', '.XXXXX', '..XXX.'],
    ['......', '.XX...', '.X..X.', '....XX', '..XX..'],
    ['......', '.XX...', '.X..X.', '....XX']
  ],
  15: [ // 24/8/6 = 38
    ['.XXXX.', 'XXXXXX', 'XXXXXX', 'XXXXXX', '..XX..'],
    ['......', '.XX...', '.X..XX', '....X.', '..XX..'],
    ['......', '.XX...', '.X..XX', '....X.']
  ],
  16: [ // 26/8/6 = 40
    ['.XXX..', 'XXXXX.', 'XXXXXX', 'XXXXXX', '.XXXX.', '..XX..'],
    ['......', '.XX...', '.X..XX', '....X.', '......', '..XX..'],
    ['......', '.XX...', '....XX', '......', '......', '..XX..']
  ],
  17: [ // 24/8/7/5 = 44
    ['......', '.XXX..', 'XXXXX.', 'XXXXXX', 'XXXXXX', '..XXX.', '..X...'],
    ['......', '......', '.XX.X.', '.X..XX', '......', '..XX..', '......'],
    ['......', '......', '.XX.X.', '.X..X.', '......', '..XX..', '......'],
    ['......', '......', '.XX.X.', '....X.', '......', '..X...', '......']
  ],
  18: [ // 26/9/7/6 = 48
    ['..XX..', '.XXXX.', 'XXXXXX', 'XXXXXX', '.XXXXX', '..XXX.'],
    ['......', '.XX...', '.X..XX', '....X.', '.XX...', '...X..'],
    ['......', '.XX...', '.X..XX', '....X.', '.X....'],
    ['......', '.XX...', '.X..XX', '....X.']
  ],
  19: [ // 26/8/7/5 = 46
    ['..XX..', '.XXXX.', 'XXXXXX', 'XXXXXX', 'XXXXX.', '..XXX.'],
    ['......', '..XX..', '..X.X.', '....X.', '.XX...', '...X..'],
    ['......', '..XX..', '..X.X.', '....X.', '.XX...'],
    ['......', '..XX..', '....X.', '....X.', '.X....']
  ],
  20: [ // 26/9/7/6 = 48
    ['.XXX..', 'XXXXX.', 'XXXXXX', 'XXXXXX', '.XXXX.', '..XX..'],
    ['......', '.XX...', '.X..XX', '....X.', '..XX..', '..X...'],
    ['......', '.XX...', '.X..XX', '....X.', '..X...'],
    ['......', '.XX...', '.X..XX', '....X.']
  ]
};

// Same shift for every layer in a row: support/cover stays exact while
// neighbouring rows stagger like brickwork.
const ROW_SHIFT = [0, 0.5, 0, 0.5, 0.25, 0.5, 0, 0.5];

const TARGETS = {
  13: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 2 },
  14: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 3 },
  15: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 4 },
  16: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 5 },
  17: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 8 },
  18: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 8 },
  19: { k: 4, l: 1, x: 0, lMax: 2, minLocked: 7 },
  20: { k: 3, l: 1, x: 0, lMax: 2, minLocked: 7 }
};

const EXTRAS = {
  13: [], 14: [], 15: ['leaf', 'cloud'], 16: ['leaf', 'cloud'],
  17: ['leaf', 'cloud'], 18: ['leaf', 'cloud'], 19: ['leaf', 'cloud'], 20: ['leaf', 'cloud']
};

const PALETTE = [
  'cat', 'dog', 'fish', 'monkey',
  'coin1', 'coin2', 'coin3', 'coin4', 'coin5', 'coin6',
  'bamboo1', 'bamboo2', 'bamboo3', 'bamboo4', 'bamboo5', 'bamboo6',
  'east', 'south', 'west', 'north', 'zhong', 'fa'
];

function makeLayout(level) {
  const cells = [];
  let id = 0;
  SHAPES[level].forEach((rows, z) => {
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === '#' || ch === 'X') cells.push({ id: id++, x: x + (ROW_SHIFT[y] || 0), y, z });
      });
    });
  });
  return cells;
}

function isFree(t, remainingSet, byId) {
  let cov = false, l = false, r = false;
  for (const id of remainingSet) {
    if (id === t.id) continue;
    const o = byId[id];
    if (o.x === t.x && o.y === t.y && o.z === t.z + 1) cov = true;
    if (o.z === t.z && o.y === t.y && o.x === t.x - 1) l = true;
    if (o.z === t.z && o.y === t.y && o.x === t.x + 1) r = true;
  }
  return !cov && (!l || !r);
}

function freeIds(set, byId) {
  return set.filter(id => isFree(byId[id], set, byId));
}

function adjacent(a, b) {
  return a.z === b.z && Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
}

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generatePairs(cells, target, rng, opts = {}) {
  const byId = {};
  for (const t of cells) byId[t.id] = t;
  const all = cells.map(t => t.id);
  const F0 = new Set(freeIds(all, byId));
  const f0 = [...F0];
  if (f0.length < 4) return null;

  const topZ = Math.max(...cells.map(t => t.z));
  const topIds = new Set(cells.filter(t => t.z === topZ).map(t => t.id));
  const noTopPair = !!opts.noTopPair;

  const cx = cells.reduce((s, t) => s + t.x, 0) / cells.length;
  const cy = cells.reduce((s, t) => s + t.y, 0) / cells.length;
  const minX = Math.min(...cells.map(t => t.x)), maxX = Math.max(...cells.map(t => t.x));
  const minY = Math.min(...cells.map(t => t.y)), maxY = Math.max(...cells.map(t => t.y));
  const interior = t => t.x > minX && t.x < maxX && t.y > minY && t.y < maxY;
  const dist = t => Math.abs(t.x - cx) + Math.abs(t.y - cy);

  const linked = [];
  for (let i = 0; i < f0.length; i++) {
    for (let j = i + 1; j < f0.length; j++) {
      const a = byId[f0[i]], b = byId[f0[j]];
      if (noTopPair && topIds.has(f0[i]) && topIds.has(f0[j])) continue;
      if (adjacent(a, b)) {
        linked.push({
          a: f0[i], b: f0[j],
          bothInterior: interior(a) && interior(b),
          d: dist(a) + dist(b)
        });
      }
    }
  }
  linked.sort((p, q) => (q.bothInterior - p.bothInterior) || (p.d - q.d));

  const chosen = [];
  const used = new Set();
  const top = linked.filter(x => x.bothInterior).slice(0, 10);
  const pool = top.length ? top : linked.slice();
  while (chosen.length < target.l && pool.length) {
    const cand = pool.splice(Math.floor(rng() * pool.length), 1)[0];
    if (!cand || used.has(cand.a) || used.has(cand.b)) continue;
    chosen.push([cand.a, cand.b]);
    used.add(cand.a); used.add(cand.b);
  }
  if (chosen.length < target.l) return null;

  if (target.x) {
    const cross = [];
    for (const a of f0) {
      if (!topIds.has(a)) continue;
      for (const b of f0) {
        if (topIds.has(b)) continue;
        cross.push({ a, b, d: dist(byId[a]) + dist(byId[b]) });
      }
    }
    cross.sort((p, q) => p.d - q.d);
    let added = 0;
    for (const cand of cross) {
      if (added >= target.x) break;
      if (used.has(cand.a) || used.has(cand.b)) continue;
      chosen.push([cand.a, cand.b]);
      used.add(cand.a); used.add(cand.b);
      added++;
    }
    if (added < target.x) return null;
  }

  const nonAdj = [];
  for (let i = 0; i < f0.length; i++) {
    for (let j = i + 1; j < f0.length; j++) {
      if (used.has(f0[i]) || used.has(f0[j])) continue;
      const a = byId[f0[i]], b = byId[f0[j]];
      if (noTopPair && topIds.has(f0[i]) && topIds.has(f0[j])) continue;
      if (adjacent(a, b)) continue;
      const edgeCount =
        (a.x === minX || a.x === maxX || a.y === minY || a.y === maxY ? 1 : 0) +
        (b.x === minX || b.x === maxX || b.y === minY || b.y === maxY ? 1 : 0);
      nonAdj.push({ a: f0[i], b: f0[j], edgeCount, d: dist(a) + dist(b) });
    }
  }
  nonAdj.sort((p, q) => (p.edgeCount - q.edgeCount) || (p.d - q.d));
  while (chosen.length < target.k && nonAdj.length) {
    const idx = Math.floor(rng() * Math.min(nonAdj.length, 12));
    const cand = nonAdj.splice(idx, 1)[0];
    if (!cand || used.has(cand.a) || used.has(cand.b)) continue;
    chosen.push([cand.a, cand.b]);
    used.add(cand.a); used.add(cand.b);
  }
  if (chosen.length < target.k) return null;

  let remaining = all.filter(id => !used.has(id));
  const pairs = chosen.slice();
  while (remaining.length) {
    const free = freeIds(remaining, byId);
    if (free.length < 2) return null;
    let openingCount = pairs.filter(([a, b]) => F0.has(a) && F0.has(b)).length;
    let linkedCount = pairs.filter(([a, b]) => F0.has(a) && F0.has(b) && adjacent(byId[a], byId[b])).length;
    const options = [];
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const a = byId[free[i]], b = byId[free[j]];
        if (noTopPair && topIds.has(free[i]) && topIds.has(free[j])) continue;
        const fa = F0.has(free[i]), fb = F0.has(free[j]);
        const bothF0 = fa && fb;
        const mixed = fa !== fb;
        const adj = adjacent(a, b);
        const edgeCount =
          (a.x === minX || a.x === maxX || a.y === minY || a.y === maxY ? 1 : 0) +
          (b.x === minX || b.x === maxX || b.y === minY || b.y === maxY ? 1 : 0);
        let s = rng() * 0.4 + edgeCount * 0.15;
        if (mixed) s += 0;
        else if (bothF0) s += 8;
        else s += 0.3;
        if (adj) s += mixed ? 0.15 : 0.5;
        if (bothF0 && openingCount >= target.k) s += 1000;
        if (bothF0 && adj && linkedCount >= target.l) s += 1000;
        options.push({ a: free[i], b: free[j], s, bothF0 });
      }
    }
    options.sort((p, q) => p.s - q.s);
    const cheapest = options[0];
    const good = options.filter(o => o.s < cheapest.s + 0.35 && !(o.bothF0 && o.s >= 1000));
    const o = good.length ? good[Math.floor(rng() * Math.min(good.length, 6))] : cheapest;
    pairs.push([o.a, o.b]);
    remaining = remaining.filter(x => x !== o.a && x !== o.b);
  }
  return { pairs, F0 };
}

function assignFaces(cells, pairs, F0, specials, rng) {
  const need = pairs.length - specials.length;
  if (need > PALETTE.length) return null;
  const palette = shuffle(PALETTE.slice(), rng).slice(0, need);
  const opening = pairs.map(([a, b]) => F0.has(a) && F0.has(b));
  const nonOpening = pairs.map((_, i) => i).filter(i => !opening[i]);
  if (specials.length > nonOpening.length) return null;
  shuffle(nonOpening, rng);
  const slot = new Array(pairs.length).fill(null);
  specials.forEach((f, i) => { slot[nonOpening[i]] = f; });
  let ni = 0;
  for (let i = 0; i < pairs.length; i++) if (!slot[i]) slot[i] = palette[ni++];
  const faceById = {};
  pairs.forEach(([a, b], i) => { faceById[a] = slot[i]; faceById[b] = slot[i]; });
  return { faceById, slot };
}

function buildModel(cells, faceById) {
  const byFace = {};
  for (const t of cells) (byFace[faceById[t.id]] = byFace[faceById[t.id]] || []).push(t.id);
  const pairOf = {};
  const pairFaces = [];
  let pi = 0;
  for (const f of Object.keys(byFace)) {
    const ids = byFace[f];
    if (ids.length !== 2) throw new Error('not a pair: ' + f);
    pairOf[ids[0]] = pi;
    pairOf[ids[1]] = pi;
    pairFaces.push(f);
    pi++;
  }
  const byId = {};
  for (const t of cells) byId[t.id] = t;
  return { byId, pairOf, pairFaces, byFace };
}

function isFreeFast(id, rem, byId) {
  const t = byId[id];
  let cov = false, l = false, r = false;
  for (const oid of rem) {
    if (oid === id) continue;
    const o = byId[oid];
    if (o.x === t.x && o.y === t.y && o.z === t.z + 1) cov = true;
    if (o.z === t.z && o.y === t.y && o.x === t.x - 1) l = true;
    if (o.z === t.z && o.y === t.y && o.x === t.x + 1) r = true;
    if (cov && l && r) break;
  }
  return !cov && (!l || !r);
}

function allPathsWin(cells, model, budget = 3000000) {
  const P = model.pairFaces.length;
  const full = P >= 31 ? -1 : (1 << P) - 1;
  const memo = new Map();
  let nodes = 0, dead = 0;
  function dfs(mask) {
    if (mask === 0) return true;
    if (memo.has(mask)) return memo.get(mask);
    if (++nodes > budget) return false;
    const rem = [];
    for (const t of cells) if (mask & (1 << model.pairOf[t.id])) rem.push(t.id);
    const free = [];
    for (const id of rem) if (isFreeFast(id, rem, model.byId)) free.push(id);
    const moves = [];
    const seen = new Set();
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const pi = model.pairOf[free[i]];
        if (pi === model.pairOf[free[j]] && !seen.has(pi)) {
          seen.add(pi);
          moves.push(pi);
        }
      }
    }
    if (!moves.length) { dead++; memo.set(mask, false); return false; }
    for (const pi of moves) {
      if (!dfs(mask & ~(1 << pi))) { memo.set(mask, false); return false; }
    }
    memo.set(mask, true);
    return true;
  }
  const ok = dfs(full);
  return { ok, dead, nodes, states: memo.size, exceeded: nodes > budget && !ok };
}

function simulate(cells, faceById, steps, W = 4, n = 1500) {
  const byId = {};
  for (const t of cells) byId[t.id] = t;
  let win = 0, noMove = 0;
  for (let k = 0; k < n; k++) {
    const alive = new Set(cells.map(t => t.id));
    const up = new Set();
    const slots = [];
    let s = steps;
    for (;;) {
      const rem = [...alive];
      if (!rem.length) { win++; break; }
      const free = rem.filter(id => isFreeFast(id, rem, byId));
      const cands = free.filter(id => !up.has(id));
      if (!cands.length) { noMove++; break; }
      if (s <= 0) break;
      const t = cands[Math.floor(Math.random() * cands.length)];
      s--;
      const mate = rem.find(o => o !== t && faceById[o] === faceById[t] && up.has(o) && isFreeFast(o, rem, byId));
      if (mate) {
        alive.delete(t); alive.delete(mate);
        up.delete(t); up.delete(mate);
        const ix = slots.indexOf(mate);
        if (ix >= 0) slots.splice(ix, 1);
      } else {
        up.add(t); slots.push(t);
        if (slots.length > W) up.delete(slots.shift());
      }
    }
  }
  return { win: +(win / n * 100).toFixed(1), noMove };
}

function metrics(cells, pairs, F0) {
  const byId = {};
  for (const t of cells) byId[t.id] = t;
  let freePairs = 0, linked = 0, interiorLinked = 0, locked = 0;
  let topPairs = 0, crossFree = 0;
  const topZ = Math.max(...cells.map(t => t.z));
  const minX = Math.min(...cells.map(t => t.x)), maxX = Math.max(...cells.map(t => t.x));
  const minY = Math.min(...cells.map(t => t.y)), maxY = Math.max(...cells.map(t => t.y));
  const interior = t => t.x > minX && t.x < maxX && t.y > minY && t.y < maxY;
  for (const [a, b] of pairs) {
    const fa = F0.has(a), fb = F0.has(b);
    if (fa && fb) {
      freePairs++;
      if (byId[a].z !== byId[b].z) crossFree++;
      if (byId[a].z === topZ && byId[b].z === topZ) topPairs++;
      if (adjacent(byId[a], byId[b])) {
        linked++;
        if (interior(byId[a]) && interior(byId[b])) interiorLinked++;
      }
    } else if (!fa && !fb) locked++;
  }
  return { freePairs, linked, interiorLinked, locked, topPairs, crossFree };
}

module.exports = {
  LEVELS, SHAPES, TARGETS, EXTRAS, PALETTE,
  makeLayout, generatePairs, assignFaces, buildModel,
  allPathsWin, simulate, metrics, mulberry32, adjacent, isFreeFast
};
