'use strict';
/* Generate all 20 levels for the new difficulty ladder (prototype). */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'levels.js');

const SHAPES = {
  1: [['XXX', 'XXX']],
  2: [['XXXX', '.XX.', 'XXXX']],
  3: [['XXXX', '.XX.', 'XXXX'], ['....', '.XX.']],
  4: [['XXXX', 'XXXX', 'XXXX'], ['...', 'X.X']],
  5: [['XXXX', 'XXXX', 'XXXX'], ['X.X', '...', 'X.X']],
  6: [['XXXXX', 'XXXXX', 'XXXX'], ['....', 'XXXX']],
  7: [['XXXXXX', 'XXXXX', 'XXXX'], ['....', 'XXXX', '..X.']],
  8: [['XXXXXX', 'XXXXXX', 'XXXXXX'], ['.X.', 'XXX']],
  9: [['XXXXXX', 'XXXXXX', 'XXXXXX'], ['..X..', 'X....', 'X.XXX']],
  10: [['XXXXXX', 'XXXXX', 'XXXX', 'XXXX'],
    ['..XXX.', '...XX.'],
    ['....X', '....X']],
  11: [['XXXXX', 'XXXXX', 'XXXX', 'XXXX'],
    ['XXX', 'XX.', 'XX'],
    ['X..', 'XX.']],
  12: [['XXXXXX', 'XXXXX', 'XXXXX', 'XXXX'],
    ['..XXX', '...XX', '....X'],
    ['..X.X', '...XX']],
  13: [['XXXXX', 'XXXXX', 'XXXX', 'XXXX'],
    ['XXX', 'XXX', 'X.X'],
    ['XXX', 'XXX', 'X.X']],
  14: [['XXXXX', 'XXXX', 'XXXX', 'XXXX', 'XXX'],
    ['X..', 'XX.', 'XXX', 'X.X'],
    ['XX.', 'XXX', 'XXX']],
  15: [['XXXXXX', 'XXXXXX', 'XXXXXX', 'XXXXXX'],
    ['....', '..X.', 'XXXX', 'XX.X'],
    ['....', '.X..', 'XXXX', '.X..'],
    ['...', '...', '.XX']],
  16: [['XX....', 'XXX...', 'XXXX..', 'XXXX..', 'XXXXX.', 'XXXXXX'],
    ['X....', 'XX...', 'XXX..', '.X...', '.....', '....X'],
    ['XX', '.X', '.X'],
    ['.X', '.X']],
  17: [['XXXXXX', 'XXXXXX', 'XXXXXX', 'XXXXX', 'XXXXX'],
    ['....X', '....X', '..XXX', '..XX.', '..X..'],
    ['.....', '..XXX', '...X.', '..XX.'],
    ['.....', '.....', '....X', '....X']],
  18: [['XXXXXX', 'XXXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX'],
    ['.....X', '...XX.', '...X..', '...X..', '..XX..', '...X..'],
    ['...X.', '...XX', '...X.', '.....', '..XX.'],
    ['....X', '....X']],
  19: [['XXXXXX', 'XXXXXX', 'XXXXXX', 'XXXXXX'],
    ['..XXX.', '.XXXX.', '.XXXX.', '..XXX.'],
    ['..XXX.', '.XXXX.', '..XXX.'],
    ['...XX.', '...XX.', '...XX.']],
  20: [['XXXXXX', 'XXXXXX', 'XXXXXX', 'XXXXXX'],
    ['..XXX.', '.XXXX.', '.XXXX.', '..XXX.'],
    ['..XXX.', '.XXXX.', '..XXX.'],
    ['...XX.', '...XX.', '...XX.'],
    ['...XX.', '...XX.']]
};

const NAMES = {
  1: '茶室·初见', 2: '茶室·成双', 3: '茶室·叠影', 4: '茶室·记性', 5: '茶室·翻牌',
  6: '庭院·连击', 7: '庭院·叠翠', 8: '庭院·连珠', 9: '庭院·双塔', 10: '庭院·交错',
  11: '灯会·灯影', 12: '灯会·窄门', 13: '灯会·灯海', 14: '灯会·流光', 15: '灯会·细雨',
  16: '山河·层峦', 17: '山河·回廊', 18: '山河·一线', 19: '山河·问心', 20: '山河·浮光'
};

const CFG = {
  1: { steps: 12, peek: 600, phase: 'teach' },
  2: { steps: 16, peek: 600, phase: 'teach' },
  3: { steps: 20, peek: 600, phase: 'teach' },
  4: { steps: 18, peek: 600, phase: 'volume' },
  5: { steps: 20, peek: 600, phase: 'volume' },
  6: { steps: 22, peek: 600, phase: 'volume' },
  7: { steps: 24, peek: 600, phase: 'volume' },
  8: { steps: 27, peek: 550, phase: 'occlude' },
  9: { steps: 29, peek: 550, phase: 'occlude' },
  10: { steps: 33, peek: 500, phase: 'occlude' },
  11: { steps: 32, peek: 500, phase: 'occlude' },
  12: { steps: 35, peek: 500, phase: 'occlude' },
  13: { steps: 37, peek: 475, phase: 'outline' },
  14: { steps: 40, peek: 475, phase: 'outline' },
  15: { steps: 47, peek: 450, phase: 'height' },
  16: { steps: 46, peek: 425, phase: 'outline' },
  17: { steps: 55, peek: 425, phase: 'height' },
  18: { steps: 57, peek: 425, phase: 'height' },
  19: { steps: 57, peek: 380, phase: 'lock' },
  20: { steps: 61, peek: 360, phase: 'lock' }
};

const PALETTE = [
  'cat', 'dog', 'fish', 'monkey',
  'coin1', 'coin2', 'coin3', 'coin4', 'coin5', 'coin6',
  'bamboo1', 'bamboo2', 'bamboo3', 'bamboo4', 'bamboo5', 'bamboo6',
  'east', 'south', 'west', 'north', 'zhong', 'fa'
];
const LAYER_OFFSETS = [[0, 0], [0.5, 0], [0.5, 0.5], [0, 0.5], [0, 0]];
const TW = 81, TH = 108, PITCH_X = 94, PITCH_Y = 118;
const GEOM_EPS = 1e-6;

const HAND = {
  1: [
    ['cat', 'dog', 'fish'],
    ['cat', 'fish', 'dog']
  ],
};

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function build(level) {
  const cells = [];
  SHAPES[level].forEach((rows, z) => {
    const [ox, oy] = LAYER_OFFSETS[z] || [0, 0];
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === 'X') cells.push({ id: cells.length, x: x + ox, y: y + oy, z });
      });
    });
  });
  return cells;
}

function overlaps(a, b) {
  return Math.abs(a.x - b.x) * PITCH_X < TW - GEOM_EPS &&
    Math.abs(a.y - b.y) * PITCH_Y < TH - GEOM_EPS;
}

function isFree(c, remaining) {
  let cov = false, l = false, r = false;
  for (const o of remaining) {
    if (o.id === c.id) continue;
    if (o.z === c.z + 1 && overlaps(c, o)) cov = true;
    if (o.z === c.z && Math.abs(o.y - c.y) < GEOM_EPS && Math.abs(o.x - (c.x - 1)) < GEOM_EPS) l = true;
    if (o.z === c.z && Math.abs(o.y - c.y) < GEOM_EPS && Math.abs(o.x - (c.x + 1)) < GEOM_EPS) r = true;
  }
  return !cov && (!l || !r);
}

function supportCount(c, cells) {
  let n = 0;
  for (const o of cells) if (o.z === c.z - 1 && overlaps(c, o)) n++;
  return n;
}

function supportOk(cells) {
  return cells.every(c => c.z === 0 || supportCount(c, cells) >= 1);
}

function coveredSet(cells) {
  const s = new Set();
  for (const c of cells) {
    for (const o of cells) {
      if (o.id !== c.id && o.z === c.z + 1 && overlaps(c, o)) { s.add(c.id); break; }
    }
  }
  return s;
}

function pairType(a, b, free0, covered) {
  const dz = Math.abs(a.z - b.z);
  const man = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const fa = free0.has(a.id), fb = free0.has(b.id);
  return {
    dz,
    sameAdj: dz === 0 && man === 1,
    sameDistant: dz === 0 && man > 1,
    adjLayer: dz === 1,
    distantLayer: dz >= 2,
    crossFree: fa && fb && dz > 0,
    linkedFree: fa && fb && dz === 0 && man === 1,
    freeDistant: fa && fb && dz === 0 && man > 1,
    bothFree: fa && fb,
    locked: !fa && !fb,
    doubleCovered: covered.has(a.id) && covered.has(b.id)
  };
}

function chooseCandidate(cands, cfg, rng, pairIndex, freeLen) {
  let total = 0;
  const ws = [];
  const phase = cfg.phase;
  for (const c of cands) {
    let w = 1;
    const t = c.t;
    if (c.a.z === c.b.z && Math.abs(c.a.x - c.b.x) + Math.abs(c.a.y - c.b.y) === 1) {
      if (pairIndex === 0 && phase === 'teach') w *= 12;
      else if (cfg.level >= 4) w *= 0.06;
    }
    if (phase === 'teach') {
      if (t.linkedFree) w *= pairIndex < 2 ? 10 : 2;
    } else if (phase === 'volume') {
      if (t.freeDistant) w *= pairIndex < 2 ? 9 : 1.5;
      if (t.crossFree) w *= 0.2;
    } else if (phase === 'occlude') {
      if (t.crossFree) w *= pairIndex < 3 ? 6 : 2;
      if (t.adjLayer) w *= 2.2;
    } else if (phase === 'outline') {
      if (t.crossFree) w *= 2.4;
      if (t.adjLayer) w *= 1.6;
    } else if (phase === 'height') {
      if (t.adjLayer) w *= 3.2;
      if (t.distantLayer) w *= 3.2;
    } else if (phase === 'lock') {
      if (t.distantLayer) w *= 4.5;
      if (t.locked) w *= 2.2;
      if (t.doubleCovered) w *= 2.2;
      if (t.bothFree && pairIndex >= 4) w *= 0.5;
    }
    if (t.bothFree && pairIndex >= 2) w *= 0.75;
    ws.push(w);
    total += w;
  }
  let r = rng() * total;
  let pick = cands[cands.length - 1];
  for (let i = 0; i < cands.length; i++) {
    r -= ws[i];
    if (r <= 0) { pick = cands[i]; break; }
  }
  return pick;
}

function generatePairs(cells, cfg, rng) {
  const remaining = cells.slice();
  const free0 = new Set(remaining.filter(c => isFree(c, remaining)).map(c => c.id));
  const covered = coveredSet(cells);
  const pairs = [];
  while (remaining.length) {
    const free = remaining.filter(c => isFree(c, remaining));
    if (free.length < 2) return null;
    const cands = [];
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const a = free[i], b = free[j];
        const t = pairType(a, b, free0, covered);
        if (cfg.level >= 4 && t.sameAdj && free.length > 2) continue;
        cands.push({ a, b, t });
      }
    }
    if (!cands.length) {
      for (let i = 0; i < free.length; i++) {
        for (let j = i + 1; j < free.length; j++) {
          const a = free[i], b = free[j];
          cands.push({ a, b, t: pairType(a, b, free0, covered) });
        }
      }
    }
    const pick = chooseCandidate(cands, cfg, rng, pairs.length, free.length);
    remaining.splice(remaining.indexOf(pick.a), 1);
    remaining.splice(remaining.indexOf(pick.b), 1);
    pairs.push({ a: pick.a, b: pick.b, t: pick.t });
  }
  return { pairs, free0, covered };
}

function faceAssignment(cells, pairs, free0, cfg, rng) {
  const extras = cfg.phase === 'height' || cfg.phase === 'lock' || cfg.level >= 13 ? ['leaf', 'cloud'] : [];
  const needNormals = pairs.length - extras.length;
  const palette = PALETTE.slice();
  for (let i = palette.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [palette[i], palette[j]] = [palette[j], palette[i]];
  }
  const normals = [];
  for (let i = 0; i < needNormals; i++) normals.push(palette[i % palette.length]);
  const idx = pairs.map((p, i) => i);
  idx.sort((x, y) => {
    const px = pairs[x], py = pairs[y];
    const fx = free0.has(px.a.id) && free0.has(px.b.id) ? 1 : 0;
    const fy = free0.has(py.a.id) && free0.has(py.b.id) ? 1 : 0;
    return fx - fy;
  });
  const extraIdx = new Set(idx.slice(0, extras.length));
  const faceByPair = new Array(pairs.length).fill(null);
  let si = 0;
  for (const i of extraIdx) faceByPair[i] = extras[si++];
  let ni = 0;
  for (let i = 0; i < pairs.length; i++) if (!faceByPair[i]) faceByPair[i] = normals[ni++];
  const byId = new Map();
  pairs.forEach((p, i) => { byId.set(p.a.id, faceByPair[i]); byId.set(p.b.id, faceByPair[i]); });
  return cells.map(c => ({ ...c, face: byId.get(c.id) }));
}

function metrics(cells, pairs, free0, covered) {
  const free = cells.filter(c => isFree(c, cells));
  const freeIds = new Set(free.map(c => c.id));
  const byFace = {};
  for (const c of cells) (byFace[c.face] ||= []).push(c);
  let freePairs = 0, freeAdj = 0, freeDistant = 0, crossFree = 0, linkedFree = 0, mirrorFree = 0;
  let adjLayerPairs = 0, distantLayerPairs = 0, sameAdjPairs = 0, lockedPairs = 0, doubleCoveredPairs = 0;
  const pairList = (pairs && pairs.length * 2 === cells.length)
    ? pairs
    : Object.values(byFace).filter(a => a.length === 2).map(a => ({ a: a[0], b: a[1] }));
  for (const p of pairList) {
    const t = pairType(p.a, p.b, free0, covered);
    if (t.bothFree) {
      freePairs++;
      if (t.crossFree) crossFree++;
      if (t.linkedFree) { freeAdj++; linkedFree++; }
      if (t.freeDistant) freeDistant++;
      if (t.freeDistant && (p.a.x === p.b.x || p.a.y === p.b.y)) mirrorFree++;
    }
    if (t.adjLayer) adjLayerPairs++;
    if (t.distantLayer) distantLayerPairs++;
    if (t.sameAdj) sameAdjPairs++;
    if (t.locked) lockedPairs++;
    if (t.doubleCovered) doubleCoveredPairs++;
  }
  const interiorLinked = (() => {
    const minX = Math.min(...cells.map(c => c.x)), maxX = Math.max(...cells.map(c => c.x));
    const minY = Math.min(...cells.map(c => c.y)), maxY = Math.max(...cells.map(c => c.y));
    const interior = c => c.x > minX && c.x < maxX && c.y > minY && c.y < maxY;
    let n = 0;
    for (const p of pairList) {
      if (freeIds.has(p.a.id) && freeIds.has(p.b.id) && p.a.z === p.b.z &&
        Math.abs(p.a.x - p.b.x) + Math.abs(p.a.y - p.b.y) === 1 &&
        interior(p.a) && interior(p.b)) n++;
    }
    return n;
  })();
  return {
    F: free.length, freePairs, freeAdj, freeDistant, crossFree, linkedFree, mirrorFree,
    adjLayerPairs, distantLayerPairs, sameAdjPairs, lockedPairs, doubleCoveredPairs,
    interiorLinked
  };
}

function fixL4Opening(src) {
  // 第 4 关：顶层两张不能用同一面（与第 3 关雷同）；开局两对都走跨层消除，且不成左右镜像。
  const faces = src.map(c => c.face);
  const rng = mulberry32(4048);
  const topZ = Math.max(...src.map(c => c.z));
  const minX = Math.min(...src.map(c => c.x)), maxX = Math.max(...src.map(c => c.x));
  for (let tries = 0; tries < 6000; tries++) {
    const pool = faces.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const cells = src.map((c, i) => ({ ...c, face: pool[i] }));
    const free = cells.filter(c => isFree(c, cells));
    if (free.length !== 6) continue;
    const top = free.filter(c => c.z === topZ);
    if (top.length !== 2 || top[0].face === top[1].face) continue;
    const byFace = {};
    for (const c of free) (byFace[c.face] ||= []).push(c);
    const pairs = Object.values(byFace).filter(a => a.length === 2);
    const singles = Object.values(byFace).filter(a => a.length === 1);
    if (pairs.length !== 2 || singles.length !== 2) continue;
    if (!pairs.every(([a, b]) => Math.abs(a.z - b.z) === 1)) continue;
    const [p, q] = pairs;
    const mirrored = p[0].y === q[0].y && p[1].y === q[1].y &&
      Math.abs((p[0].x + q[0].x) - (minX + maxX)) < 1e-6 &&
      Math.abs((p[1].x + q[1].x) - (minX + maxX)) < 1e-6;
    if (mirrored) continue;
    if (!cheatSolve(cells)) continue;
    return { cells, done: true };
  }
  return { cells: src.map(c => ({ ...c })), done: false };
}

function simulate(cells, spec, n, rng) {
  const W = spec.w || 4;
  let win = 0, noMove = 0;
  for (let k = 0; k < n; k++) {
    const alive = new Map(cells.map(t => [t.id, true]));
    const up = new Map();
    let slots = [], steps = spec.steps;
    for (;;) {
      const present = cells.filter(t => alive.has(t.id));
      if (!present.length) { win++; break; }
      const cands = present.filter(t => isFree(t, present) && !up.has(t.id));
      if (!cands.length) { noMove++; break; }
      if (steps <= 0) break;
      const t = cands[Math.floor(rng() * cands.length)];
      steps--;
      const mate = present.find(o => o.id !== t.id && o.face === t.face && up.has(o.id) && isFree(o, present));
      if (mate) {
        alive.delete(t.id); alive.delete(mate.id);
        up.delete(t.id); up.delete(mate.id);
        slots = slots.filter(id => id !== mate.id);
      } else {
        up.set(t.id, true); slots.push(t.id);
        if (slots.length > W) { const old = slots.shift(); up.delete(old); }
      }
    }
  }
  return { win: +(win / n * 100).toFixed(1), noMove };
}

function cheatSolve(cells) {
  const tiles = cells.map(t => ({ ...t, state: 'down' }));
  let removed = 0, guard = cells.length;
  while (removed < cells.length && guard-- > 0) {
    let pair = null;
    for (let i = 0; i < tiles.length && !pair; i++) {
      const a = tiles[i];
      if (a.state === 'matched') continue;
      for (let j = i + 1; j < tiles.length; j++) {
        const b = tiles[j];
        if (b.state === 'matched' || a.face !== b.face) continue;
        if (isFree(a, tiles.filter(t => t.state !== 'matched')) && isFree(b, tiles.filter(t => t.state !== 'matched'))) { pair = [a, b]; break; }
      }
    }
    if (!pair) return false;
    pair[0].state = 'matched'; pair[1].state = 'matched'; removed += 2;
  }
  return removed === cells.length;
}

function hardScore(level, cfg, m) {
  let s = 0;
  const phase = cfg.phase;
  if (phase === 'teach') {
    if (m.F > 6) s += 50;
    if (m.freePairs < 1) s += 20;
    if (m.freeAdj < 1) s += 20;
    if (m.F > 4) {
      if (m.freePairs !== 2) s += 15;
      if (m.freeAdj !== 1) s += 10;
      if (m.freeDistant !== 1) s += 10;
      if (m.mirrorFree > 0) s += 20;
    }
  } else if (phase === 'volume') {
    if (m.F < 5 || m.F > 6) s += 20;
    if (m.freePairs < 2) s += 20;
    if (m.freeAdj > 0) s += 20;
    if (m.freeDistant < 1) s += 15;
  } else if (phase === 'occlude') {
    if (m.F < 8 || m.F > 10) s += 20;
    if (m.crossFree < 1) s += 20;
    if (m.freePairs > 2) s += 25;
    if (m.adjLayerPairs < 1) s += 15;
    if (level <= 9) s += Math.max(0, m.freePairs - 1) * 4;
  } else if (phase === 'outline') {
    if (m.F < 10 || m.F > 13) s += 15;
    if (m.adjLayerPairs < 1) s += 10;
  } else if (phase === 'height') {
    if (m.F < 11 || m.F > 13) s += 25;
    if (m.adjLayerPairs < 1) s += 15;
    if (m.distantLayerPairs < 1) s += 15;
  } else if (phase === 'lock') {
    if (m.F < 8 || m.F > 13) s += 25;
    if (m.lockedPairs < 2) s += 20;
    if (m.doubleCoveredPairs < 2) s += 20;
    if (m.distantLayerPairs < 1) s += 15;
  }
  if (level >= 4 && m.freeAdj > 0) s += 10;
  if (level >= 4 && m.sameAdjPairs > 2) s += 5;
  return s;
}

function generate(level, seed) {
  const cfg = { ...CFG[level], level };
  const rng = mulberry32(level * 100003 + seed * 7919);
  const cells = build(level);
  if (!supportOk(cells)) return { fail: 'support' };
  const gen = generatePairs(cells, cfg, rng);
  if (!gen) return null;
  const { pairs, free0, covered } = gen;
  const faced = faceAssignment(cells, pairs, free0, cfg, rng);
  const m = metrics(faced, pairs, free0, covered);
  if (!cheatSolve(faced)) return { fail: 'solve' };
  const score = hardScore(level, cfg, m);
  return { cells: faced, m, score, seed };
}

function run() {
  const out = [];
  for (let level = 1; level <= 20; level++) {
    const cfg = CFG[level];
    if (HAND[level]) {
      const layout = [];
      HAND[level].forEach((row, y) => row.forEach((face, x) => layout.push({ id: layout.length, x, y, z: 0, face })));
      const cells = layout.map(t => ({ ...t }));
      const m = metrics(cells, [], new Set(), new Set());
      console.log('L' + level, NAMES[level], 'hand', 'tiles=' + cells.length, 'F=' + m.F,
        'freePairs=' + m.freePairs, 'freeAdj=' + m.freeAdj, 'freeDistant=' + m.freeDistant);
      out.push({
        level, name: NAMES[level], tiles: cells.length, pairs: cells.length / 2, layers: 1,
        steps: cfg.steps, peekMs: cfg.peek, w: 4, phase: cfg.phase, layout
      });
      continue;
    }
    let best = null;
    let attempts = 0;
    for (let seed = 1; seed <= 2400; seed++) {
      attempts++;
      const r = generate(level, seed);
      if (!r || r.fail) continue;
      if (!best || r.score < best.score ||
        (r.score === best.score && Math.abs(r.m.F - (cfg.phase === 'lock' ? 10 : cfg.phase === 'height' ? 12 : 10)) < Math.abs(best.m.F - (cfg.phase === 'lock' ? 10 : cfg.phase === 'height' ? 12 : 10)))) {
        best = r;
      }
      if (best && best.score === 0 && seed > 40) break;
    }
    if (!best) { console.log('L' + level, 'NO CANDIDATE'); continue; }
    if (level <= 3) {
      let fine = null;
      for (let seed = 1; seed <= 600; seed++) {
        const r = generate(level, seed);
        if (!r || r.fail || r.score > 0) continue;
        const s = simulate(r.cells, cfg, 4000, mulberry32(level * 4444 + seed));
        if (s.win === 100 && s.noMove === 0) { fine = { ...r, win: s.win }; break; }
      }
      if (fine) best = fine;
    }
    if (level === 4) {
      const r4 = fixL4Opening(best.cells);
      if (r4.done) best = { ...best, cells: r4.cells };
    }
    if (level >= 8 && level <= 9) {
      let fine = null;
      for (let seed = 1; seed <= 900; seed++) {
        const r = generate(level, seed);
        if (!r || r.fail || r.score > 0) continue;
        const s = simulate(r.cells, cfg, 240, mulberry32(level * 5555 + seed));
        if (!fine || s.win < fine.win) fine = { ...r, win: s.win };
      }
      if (fine) best = fine;
    }
    if (level >= 10 && level <= 12) {
      // 11/12 实战已带第 10 关礼物（5 位），按实战胜率校准，并与 13/14 的 5 位强度衔接。
      const slots = level === 10 ? 4 : 5;
      const target = level === 10 ? 20 : level === 11 ? 56 : 50;
      // 11/12 选面固定按减步前的步数评估，避免把步数收紧用更简单的花色抵消。
      const refSteps = level === 11 ? 35 : level === 12 ? 37 : cfg.steps;
      const pick = (needPairs) => {
        let fine = null;
        let seen = 0;
        for (let seed = 1; seed <= 700 && seen < 160; seed++) {
          const r = generate(level, seed);
          if (!r || r.fail || r.score > 0) continue;
          if (needPairs && r.m.freePairs < 2) continue;
          seen++;
          const s = simulate(r.cells, { ...cfg, steps: refSteps, w: slots }, 240, mulberry32(level * 6666 + seed));
          if (s.noMove > 0) continue;
          if (level > 10) {
            const s4 = simulate(r.cells, { ...cfg, steps: refSteps }, 240, mulberry32(level * 6667 + seed));
            if (s4.noMove > 0 || s4.win > 24) continue;
          } else if (s.win > 22) continue;
          const d = Math.abs(s.win - target);
          if (!fine || d < fine.d) fine = { ...r, win: s.win, d };
        }
        return fine;
      };
      const fine = pick(true) || pick(false);
      if (fine) best = fine;
    }
    if (level === 15 || level === 16) {
      // 15 要比 16 明显更容易：按实测随机胜率挑种子。
      let fine = null;
      let seen = 0;
      for (let seed = 1; seed <= 900 && seen < 220; seed++) {
        const r = generate(level, seed);
        if (!r || r.fail || r.score > 0) continue;
        seen++;
        const s = simulate(r.cells, cfg, 200, mulberry32(level * 8888 + seed));
        if (s.noMove > 0) continue;
        const ok = level === 15 ? (s.win >= 4.5 && s.win <= 9.5) : s.win <= 4.5;
        if (!ok) continue;
        const d = Math.abs(s.win - (level === 15 ? 7 : 2));
        if (!fine || d < fine.d) fine = { ...r, win: s.win, d };
      }
      if (fine) best = fine;
    }
    const sim = simulate(best.cells, cfg, 500, mulberry32(level * 7777 + (best.seed || 1)));
    console.log('L' + level, NAMES[level], 'seed=' + best.seed, 'score=' + best.score,
      'tiles=' + best.cells.length, 'F=' + best.m.F,
      'freePairs=' + best.m.freePairs, 'freeAdj=' + best.m.freeAdj, 'freeDistant=' + best.m.freeDistant,
      'crossFree=' + best.m.crossFree, 'adj=' + best.m.adjLayerPairs, 'far=' + best.m.distantLayerPairs,
      'sameAdj=' + best.m.sameAdjPairs, 'locked=' + best.m.lockedPairs, 'dblCov=' + best.m.doubleCoveredPairs,
      'random=' + sim.win + '% noMove=' + sim.noMove, 'attempts=' + attempts);
    out.push({
      level, name: NAMES[level], tiles: best.cells.length, pairs: best.cells.length / 2,
      layers: SHAPES[level].length, steps: cfg.steps, peekMs: cfg.peek, w: 4,
      phase: cfg.phase,
      layout: best.cells.map((c, i) => ({ id: i, x: c.x, y: c.y, z: c.z, face: c.face }))
    });
  }
  const js = '/* generated by tools/gen-curve.cjs; do not edit by hand */\n' +
    'window.FUANG_LEVELS = ' + JSON.stringify(out, null, 2) + ';\n';
  fs.writeFileSync(OUT, js);
  console.log('wrote', OUT, (js.length / 1024).toFixed(1) + 'KB');
}

if (require.main === module) run();
module.exports = { SHAPES, CFG, NAMES, generate, simulate, mulberry32, fixL4Opening, isFree };
