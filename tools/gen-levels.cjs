'use strict';
/* Generate deterministic, solvable 20-level data for the demo.
 * Output: demo/assets/levels.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'levels.js');
const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
if (current.includes('v4 late relayout') && !process.env.FORCE) {
  console.error('levels.js contains the v1.20 late layouts; use demo/tools/relayout-late.cjs, or set FORCE=1 to overwrite.');
  process.exit(1);
}

const PALETTE = [
  'cat', 'dog', 'fish', 'monkey',
  'coin1', 'coin2', 'coin3', 'coin4', 'coin5', 'coin6',
  'bamboo1', 'bamboo2', 'bamboo3', 'bamboo4', 'bamboo5', 'bamboo6',
  'east', 'south', 'west', 'north', 'zhong', 'fa'
];

// layers: [cols, rows, dx, dy]; z is the array index.
const SPECS = [
  { level: 1, name: '茶室·初见', tiles: 6, steps: 12, peek: 600, cross: 0, hand: true },
  { level: 2, name: '茶室·成双', tiles: 8, steps: 14, peek: 600, cross: 0, hand: true },
  { level: 3, name: '茶室·叠影', tiles: 12, steps: 17, peek: 600, cross: 0.2, targetWin: 88, faces: 6, layers: [[4, 2, 0, 0], [2, 2, 1, 0]] },
  { level: 4, name: '茶室·记性', tiles: 14, steps: 19, peek: 600, cross: 0.3, targetWin: 80, faces: 7, layers: [[5, 2, 0, 0], [2, 2, 1, 0]] },
  { level: 5, name: '茶室·翻牌', tiles: 16, steps: 23, peek: 600, cross: 0.25, targetWin: 71, faces: 8, layers: [[4, 3, 0, 0], [2, 2, 1, 1]] },
  { level: 6, name: '庭院·连击', tiles: 18, steps: 23, peek: 600, cross: 0.3, targetWin: 63, faces: 9, layers: [[4, 3, 0, 0], [3, 2, 0, 0]] },
  { level: 7, name: '庭院·叠翠', tiles: 20, steps: 25, peek: 600, cross: 0.35, targetWin: 56, faces: 10, leaf: 1, layers: [[4, 3, 0, 0], [4, 2, 0, 0]] },
  { level: 8, name: '庭院·连珠', tiles: 22, steps: 28, peek: 550, cross: 0.25, targetWin: 50, faces: 11, layers: [[4, 4, 0, 0], [3, 2, 0, 1]] },
  { level: 9, name: '庭院·双塔', tiles: 24, steps: 31, peek: 550, cross: 0.3, targetWin: 44, faces: 12, layers: [[4, 4, 0, 0], [3, 2, 0, 1], [2, 1, 1, 1]] },
  { level: 10, name: '庭院·交错', tiles: 26, steps: 34, peek: 500, cross: 0.2, targetWin: 39, faces: 13, layers: [[5, 4, 0, 0], [2, 2, 1, 1], [2, 1, 1, 1]] },
  { level: 11, name: '灯会·灯影', tiles: 28, steps: 37, peek: 500, cross: 0.25, targetWin: 34, faces: 14, cloud: 1, layers: [[5, 4, 0, 0], [3, 2, 1, 1], [2, 1, 1, 1]] },
  { level: 12, name: '灯会·窄门', tiles: 30, steps: 37, peek: 475, cross: 0.3, targetWin: 30, faces: 15, layers: [[5, 4, 0, 0], [3, 2, 1, 1], [2, 2, 1, 1]] },
  { level: 13, name: '灯会·灯海', tiles: 32, steps: 43, peek: 475, cross: 0.2, targetWin: 26, faces: 16, layers: [[6, 4, 0, 0], [3, 2, 1, 1], [2, 1, 1, 1]] },
  { level: 14, name: '灯会·流光', tiles: 34, steps: 46, peek: 450, cross: 0.25, targetWin: 23, faces: 17, layers: [[6, 4, 0, 0], [3, 2, 1, 1], [2, 2, 2, 1]] },
  { level: 15, name: '灯会·细雨', tiles: 36, steps: 49, peek: 450, cross: 0.3, targetWin: 20, faces: 18, leaf: 1, cloud: 1, layers: [[6, 4, 0, 0], [4, 2, 1, 1], [2, 2, 2, 1]] },
  { level: 16, name: '山河·层峦', tiles: 40, steps: 60, peek: 450, cross: 0.35, targetWin: 17, faces: 20, leaf: 1, cloud: 1, layers: [[6, 4, 0, 0], [4, 3, 1, 0], [2, 2, 2, 1]] },
  { level: 17, name: '山河·回廊', tiles: 44, steps: 66, peek: 425, cross: 0.3, targetWin: 14, leaf: 1, cloud: 1, layers: [[6, 5, 0, 0], [4, 2, 1, 1], [3, 2, 1, 1]] },
  { level: 18, name: '山河·一线', tiles: 48, steps: 72, peek: 425, cross: 0.35, targetWin: 11, leaf: 1, cloud: 1, layers: [[6, 5, 0, 0], [4, 2, 1, 1], [3, 2, 1, 1], [2, 2, 2, 1]] },
  { level: 19, name: '山河·问心', tiles: 46, steps: 70, peek: 400, cross: 0.4, targetWin: 8, leaf: 1, cloud: 1, layers: [[6, 4, 0, 0], [4, 3, 0, 0], [3, 2, 1, 1], [2, 2, 2, 1]] },
  { level: 20, name: '山河·浮光', tiles: 48, steps: 74, peek: 400, cross: 0.45, targetWin: 5, leaf: 1, cloud: 1, layers: [[6, 4, 0, 0], [4, 3, 0, 0], [3, 2, 1, 1], [3, 2, 2, 1]] }
];

const HAND = {
  1: [
    { x: 0, y: 0, z: 0, face: 'cat' },    // 0
    { x: 1, y: 0, z: 0, face: 'dog' },    // 1
    { x: 2, y: 0, z: 0, face: 'fish' },   // 2
    { x: 0, y: 1, z: 0, face: 'cat' },    // 3  adjacent teaching pair with 0
    { x: 1, y: 1, z: 0, face: 'fish' },   // 4
    { x: 2, y: 1, z: 0, face: 'dog' }     // 5
  ],
  2: [
    { x: 0, y: 0, z: 0, face: 'cat' },    // 0  free edge
    { x: 1, y: 0, z: 0, face: 'fish' },   // 1  center, unlocked by 0/3
    { x: 2, y: 0, z: 0, face: 'monkey' }, // 2  center, unlocked by 0/3
    { x: 3, y: 0, z: 0, face: 'cat' },    // 3  free edge
    { x: 0, y: 1, z: 0, face: 'dog' },    // 4  free edge
    { x: 1, y: 1, z: 0, face: 'monkey' }, // 5  center, unlocked by 4/7
    { x: 2, y: 1, z: 0, face: 'fish' },   // 6  center, unlocked by 4/7
    { x: 3, y: 1, z: 0, face: 'dog' }     // 7  free edge
  ]
};

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function makeCells(layers) {
  const cells = [];
  layers.forEach(([cols, rows, dx, dy], z) => {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        cells.push({ id: cells.length, x: dx + x, y: dy + y, z });
      }
    }
  });
  return cells;
}

function isFree(c, remaining) {
  let covered = false, left = false, right = false;
  for (const o of remaining) {
    if (o.id === c.id) continue;
    if (o.x === c.x && o.y === c.y && o.z === c.z + 1) covered = true;
    if (o.z === c.z && o.y === c.y && o.x === c.x - 1) left = true;
    if (o.z === c.z && o.y === c.y && o.x === c.x + 1) right = true;
  }
  return !covered && (!left || !right);
}

function generatePairs(cells, spec, rng) {
  const remaining = cells.slice();
  const initialFree = new Set();
  for (const c of remaining) if (isFree(c, remaining)) initialFree.add(c.id);
  const pairs = [];
  let crossCount = 0;

  while (remaining.length) {
    const free = remaining.filter(c => isFree(c, remaining));
    if (free.length < 2) return null;

    let cands = [];
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const a = free[i], b = free[j];
        const adj = a.z === b.z && Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1;
        if (spec.level >= 2 && adj && free.length > 2) continue;
        const cross = a.z !== b.z;
        const curCross = pairs.length ? crossCount / pairs.length : 0;
        let w = 1;
        if (cross) w *= curCross < spec.cross ? 3.2 : 0.55;
        else w *= curCross < spec.cross ? 0.55 : 2.6;
        if (spec.level >= 6) {
          const ai = initialFree.has(a.id), bi = initialFree.has(b.id);
          if (ai !== bi) w *= 1.5;
          else if (ai && bi) w *= 0.45;
        }
        cands.push({ a, b, w, cross });
      }
    }
    if (!cands.length) {
      for (let i = 0; i < free.length; i++) {
        for (let j = i + 1; j < free.length; j++) {
          const a = free[i], b = free[j];
          cands.push({ a, b, w: 1, cross: a.z !== b.z });
        }
      }
    }
    let total = 0;
    for (const c of cands) total += c.w;
    let r = rng() * total;
    let pick = cands[cands.length - 1];
    for (const c of cands) { r -= c.w; if (r <= 0) { pick = c; break; } }
    const ai = remaining.indexOf(pick.a);
    remaining.splice(ai, 1);
    const bi = remaining.indexOf(pick.b);
    remaining.splice(bi, 1);
    pairs.push({ a: pick.a, b: pick.b, cross: pick.cross });
    if (pick.cross) crossCount++;
  }
  return { pairs, initialFree };
}

function faceAssignment(cells, pairs, initialFree, spec, rng) {
  const extras = [];
  if (spec.leaf) extras.push('leaf');
  if (spec.cloud) extras.push('cloud');
  const needNormals = pairs.length - extras.length;
  if (needNormals > PALETTE.length) {
    throw new Error('L' + spec.level + ' needs ' + needNormals + ' normal faces, only ' + PALETTE.length + ' available');
  }

  // Never reuse a face: extra copies make any two identical free tiles match,
  // which breaks the hand-built pair solution and the validator.
  const palette = PALETTE.slice();
  for (let i = palette.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [palette[i], palette[j]] = [palette[j], palette[i]];
  }
  const normals = palette.slice(0, needNormals);

  // Put leaf/cloud pairs on tiles that are not both free at the start, so the
  // player meets them while digging instead of at the first glance.
  const idx = pairs.map((p, i) => i);
  idx.sort((x, y) => {
    const px = pairs[x], py = pairs[y];
    const fx = initialFree.has(px.a.id) && initialFree.has(px.b.id) ? 1 : 0;
    const fy = initialFree.has(py.a.id) && initialFree.has(py.b.id) ? 1 : 0;
    return fx - fy;
  });
  const extraIdx = new Set(idx.slice(0, extras.length));

  const faceByPair = new Array(pairs.length).fill(null);
  let si = 0;
  for (const i of extraIdx) faceByPair[i] = extras[si++];
  let ni = 0;
  for (let i = 0; i < pairs.length; i++) {
    if (!faceByPair[i]) faceByPair[i] = normals[ni++];
  }

  const byId = new Map();
  pairs.forEach((p, i) => {
    byId.set(p.a.id, faceByPair[i]);
    byId.set(p.b.id, faceByPair[i]);
  });
  return cells.map(c => ({ ...c, face: byId.get(c.id) }));
}

function analyze(cells, spec) {
  let free = cells.filter(c => isFree(c, cells));
  const byFace = {};
  for (const c of free) byFace[c.face] = (byFace[c.face] || 0) + 1;
  const freeGroups = Object.values(byFace).filter(n => n >= 2).length;
  const freeSingles = Object.values(byFace).filter(n => n === 1).length;
  const pairKey = new Set();
  const seen = new Set();
  // count complete free pairs by looking at all matching pairs among free cells
  let freePairCount = 0;
  for (let i = 0; i < free.length; i++) {
    for (let j = i + 1; j < free.length; j++) {
      if (free[i].face === free[j].face) freePairCount++;
    }
  }
  return { freeCount: free.length, freeGroups, freeSingles, freePairCount };
}

function simulate(cells, spec, n = 2000, random = Math.random) {
  const W = 4;
  let win = 0, evGames = 0, evTotal = 0, noMove = 0;
  for (let k = 0; k < n; k++) {
    const alive = new Map(cells.map(t => [t.id, true]));
    const up = new Map();
    let slots = [], steps = spec.steps, ev = 0;
    while (true) {
      const present = cells.filter(t => alive.has(t.id));
      if (!present.length) { win++; break; }
      const cands = present.filter(t => isFree(t, present) && !up.has(t.id));
      if (!cands.length) { noMove++; break; }
      if (steps <= 0) break;
      const t = cands[Math.floor(random() * cands.length)];
      steps--;
      const mate = present.find(o => o.id !== t.id && o.face === t.face && up.has(o.id) && isFree(o, present));
      if (mate) {
        alive.delete(t.id); alive.delete(mate.id);
        up.delete(t.id); up.delete(mate.id);
        slots = slots.filter(id => id !== mate.id);
      } else {
        up.set(t.id, true); slots.push(t.id);
        if (slots.length > W) { const old = slots.shift(); up.delete(old); ev++; }
      }
    }
    if (ev > 0) { evGames++; evTotal += ev; }
  }
  return {
    win: +(win / n * 100).toFixed(1),
    evGames: +(evGames / n * 100).toFixed(1),
    avgEv: +(evTotal / n).toFixed(2),
    noMove
  };
}

function generateLevel(spec) {
  const cells = makeCells(spec.layers);
  const upperTiles = spec.layers.slice(1).reduce((n, l) => n + l[0] * l[1], 0);
  const maxCross = Math.min(1, upperTiles / (spec.tiles / 2));
  const targetCross = Math.min(spec.cross, maxCross * 0.95);
  const pairSpec = { ...spec, cross: targetCross };
  if (cells.length !== spec.tiles) throw new Error('tile count mismatch L' + spec.level + ': ' + cells.length);
  const pairsTarget = spec.tiles / 2;
  const candidates = [];
  for (let seed = 1; seed <= 1200 && candidates.length < 28; seed++) {
    const rng = mulberry32(spec.level * 100003 + seed * 7919);
    const gen = generatePairs(cells, pairSpec, rng);
    if (!gen) continue;
    const { pairs, initialFree } = gen;
    if (pairs.length !== pairsTarget) continue;
    let adj = 0;
    for (const p of pairs) {
      if (p.a.z === p.b.z && Math.abs(p.a.x - p.b.x) + Math.abs(p.a.y - p.b.y) === 1) adj++;
    }
    if (adj > 0) continue;
    const cross = pairs.filter(p => p.a.z !== p.b.z).length / pairs.length;
    if (Math.abs(cross - targetCross) > 0.14) continue;
    const faced = faceAssignment(cells, pairs, initialFree, spec, rng);
    const info = analyze(faced, spec);
    const bothFree = pairs.filter(p => initialFree.has(p.a.id) && initialFree.has(p.b.id)).length;
    if (bothFree > 4) continue;
    const score = Math.abs(cross - targetCross) * 4 + info.freeGroups * 0.35 + bothFree * 0.5 + (info.freeCount < 6 ? 1 : 0);
    candidates.push({ seed, cells: faced, pairs, info, cross, targetCross, bothFree, adj, score });
  }
  if (!candidates.length) throw new Error('no layout for L' + spec.level);

  let best = null;
  const testN = 180;
  for (const cand of candidates) {
    const test = simulate(cand.cells, spec, testN, mulberry32(spec.level * 99991 + cand.seed));
    const diff = Math.abs(test.win - spec.targetWin);
    const rank = diff + test.noMove * 30 + cand.score * 0.01;
    if (!best || rank < best.rank) {
      best = { ...cand, winEstimate: test.win, noMoveEstimate: test.noMove, rank };
    }
  }
  return best;
}

function build() {
  const levels = [];
  for (const spec of SPECS) {
    if (spec.hand) {
      const layout = HAND[spec.level].map((t, i) => ({ id: i, ...t }));
      levels.push({
        level: spec.level, name: spec.name, tiles: spec.tiles, pairs: spec.tiles / 2,
        layers: 1, steps: spec.steps, peekMs: spec.peek, w: 4,
        layout
      });
      continue;
    }
    const gen = generateLevel(spec);
    levels.push({
      level: spec.level, name: spec.name, tiles: spec.tiles, pairs: spec.tiles / 2,
      layers: spec.layers.length, steps: spec.steps, peekMs: spec.peek, w: 4,
      layout: gen.cells.map((c, i) => ({ id: i, x: c.x, y: c.y, z: c.z, face: c.face }))
    });
    const sim = simulate(gen.cells, spec, 1200);
    console.log('L' + spec.level, spec.name,
      'tiles=' + spec.tiles, 'pairs=' + (spec.tiles / 2), 'layers=' + spec.layers.length,
      'free=' + gen.info.freeCount, 'freeGroups=' + gen.info.freeGroups,
      'bothFree=' + gen.bothFree, 'cross=' + gen.cross.toFixed(2), 'target=' + gen.targetCross.toFixed(2),
      'adj=' + gen.adj, 'seed=' + gen.seed,
      'randomWin=' + sim.win + '%', 'evGames=' + sim.evGames + '%', 'avgEv=' + sim.avgEv,
      'noMove=' + sim.noMove);
  }
  const js = '/* generated by tools/gen-levels.cjs; do not edit by hand */\n' +
    'window.FUANG_LEVELS = ' + JSON.stringify(levels, null, 2) + ';\n';
  fs.writeFileSync(OUT, js);
  console.log('wrote', OUT, (js.length / 1024).toFixed(1) + 'KB');
}

build();
