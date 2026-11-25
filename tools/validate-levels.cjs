'use strict';
/* Structural + difficulty-ladder checks for demo/assets/levels.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = path.join(__dirname, '..', 'assets', 'levels.js');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(file, 'utf8'), sandbox);
const levels = sandbox.window.FUANG_LEVELS;
const W = 4;
const TW = 81, TH = 108, PITCH_X = 94, PITCH_Y = 118, EPS = 1e-6;
function overlaps(a, b) {
  return Math.abs(a.x - b.x) * PITCH_X < TW - EPS &&
    Math.abs(a.y - b.y) * PITCH_Y < TH - EPS;
}

function isFree(t, tiles) {
  if (t.state === 'matched') return false;
  let covered = false, left = false, right = false;
  for (const u of tiles) {
    if (u.state === 'matched') continue;
    if (u.z === t.z + 1 && overlaps(t, u)) covered = true;
    if (u.z === t.z && Math.abs(u.y - t.y) < EPS && Math.abs(u.x - (t.x - 1)) < EPS) left = true;
    if (u.z === t.z && Math.abs(u.y - t.y) < EPS && Math.abs(u.x - (t.x + 1)) < EPS) right = true;
  }
  return !covered && (!left || !right);
}

function coveredSet(tiles) {
  const out = new Set();
  for (const c of tiles) {
    for (const o of tiles) {
      if (o.id !== c.id && o.z === c.z + 1 && overlaps(c, o)) { out.add(c.id); break; }
    }
  }
  return out;
}

function pairType(a, b, free0, covered) {
  const dz = Math.abs(a.z - b.z);
  const man = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  const fa = free0.has(a.id), fb = free0.has(b.id);
  return {
    dz,
    sameAdj: dz === 0 && man === 1,
    sameFar: dz === 0 && man > 1,
    adj: dz === 1,
    far: dz >= 2,
    crossFree: fa && fb && dz > 0,
    linkedFree: fa && fb && dz === 0 && man === 1,
    freeFar: fa && fb && dz === 0 && man > 1,
    locked: !fa && !fb,
    dblCov: covered.has(a.id) && covered.has(b.id)
  };
}

function cheatSolve(lv) {
  const tiles = lv.layout.map(t => ({ ...t, state: 'down' }));
  let guard = lv.pairs + 4;
  let removed = 0;
  while (removed < lv.tiles && guard-- > 0) {
    let pair = null;
    for (let i = 0; i < tiles.length && !pair; i++) {
      const a = tiles[i];
      if (a.state === 'matched') continue;
      for (let j = i + 1; j < tiles.length; j++) {
        const b = tiles[j];
        if (b.state === 'matched' || a.face !== b.face) continue;
        const live = tiles.filter(t => t.state !== 'matched');
        if (isFree(a, live) && isFree(b, live)) { pair = [a, b]; break; }
      }
    }
    if (!pair) return { ok: false, reason: 'no-free-pair', removed };
    pair[0].state = 'matched';
    pair[1].state = 'matched';
    removed += 2;
  }
  return { ok: removed === lv.tiles, reason: removed === lv.tiles ? 'ok' : 'guard', removed };
}

function simulate(lv, n) {
  const slotsMax = lv.w || W;
  let win = 0, noMove = 0;
  for (let k = 0; k < n; k++) {
    const tiles = lv.layout.map(t => ({ ...t, state: 'down' }));
    const up = new Set();
    const slots = [];
    let steps = lv.steps;
    for (;;) {
      const alive = tiles.filter(t => t.state !== 'matched');
      if (!alive.length) { win++; break; }
      const cands = alive.filter(t => isFree(t, tiles) && !up.has(t.id));
      if (!cands.length) { noMove++; break; }
      if (steps <= 0) break;
      const t = cands[Math.floor(Math.random() * cands.length)];
      steps--;
      const mate = alive.find(o => o.id !== t.id && o.face === t.face && up.has(o.id) && isFree(o, tiles));
      if (mate) {
        t.state = 'matched';
        mate.state = 'matched';
        up.delete(t.id);
        up.delete(mate.id);
        const s = slots.indexOf(mate.id);
        if (s >= 0) slots.splice(s, 1);
      } else {
        up.add(t.id);
        slots.push(t.id);
        if (slots.length > slotsMax) up.delete(slots.shift());
      }
    }
  }
  return { win: +(win / n * 100).toFixed(1), noMove };
}

function phaseCheck(lv, m, rows, layerCount, layerSizes) {
  const phase = lv.phase || (lv.level <= 3 ? 'teach' : lv.level <= 7 ? 'volume' : lv.level <= 12 ? 'occlude'
    : lv.level <= 15 ? 'outline' : lv.level <= 18 ? 'height' : 'lock');
  if (phase === 'teach') {
    return {
      ok: m.F <= W + 2 && m.freeAdj >= 1 && m.freePairs <= 2 &&
        (m.F <= W || (m.freeAdj === 1 && m.freeFar === 1 && m.freePairs === 2 && m.mirrorFree === 0 && m.interiorLinked >= 1)),
      why: 'F<=6; F>W: 1 interior adjacent + 1 non-mirrored far opening'
    };
  }
  if (phase === 'volume') {
    return {
      ok: m.F >= 5 && m.F <= 6 && m.freeAdj === 0 && (m.freeFar + m.crossFree) >= 1 && m.freePairs >= 2 && m.freePairs <= 4,
      why: 'F5-6 no-adj-open same-layer-far or cross-layer openings2-4'
    };
  }
  if (phase === 'occlude') {
    return {
      ok: m.F >= 8 && m.F <= 10 && m.crossFree >= 1 && m.adj >= 1 && m.freePairs >= 1 && m.freePairs <= 2,
      why: 'F8-10 crossFree>=1 adj-layer>=1'
    };
  }
  if (phase === 'outline') {
    const wantRows = lv.level === 13 ? 4 : lv.level === 14 ? 5 : 6;
    const wantLayers = lv.level === 16 ? 4 : 3;
    const each8 = lv.level === 16 || layerSizes.every(n => n >= 8);
    return {
      ok: rows === wantRows && layerCount === wantLayers && each8 && m.F >= 10 && m.F <= 13,
      why: 'rows ' + wantRows + ' layers ' + wantLayers + ' each>=8 F10-13'
    };
  }
  if (phase === 'height') {
    return {
      ok: m.F >= 11 && m.F <= 13 && m.adj >= 1 && m.far >= 1 && layerCount >= 4 && layerCount <= 5,
      why: 'F11-13 adj+far layers4-5'
    };
  }
  return {
    ok: m.F >= 8 && m.F <= 13 && m.locked >= 4 && m.dblCov >= 2 && m.far >= 1,
    why: 'F8-13 locked>=4 double-cover>=2 far>=1'
  };
}

let bad = 0;
for (const lv of levels) {
  const tiles = lv.layout;
  const free0 = new Set(tiles.filter(t => isFree(t, tiles)).map(t => t.id));
  const covered = coveredSet(tiles);
  const byFace = {};
  for (const t of tiles) (byFace[t.face] ||= []).push(t);
  const badPairs = Object.entries(byFace).filter(([, a]) => a.length % 2 !== 0);
  const pairList = [];
  for (const a of Object.values(byFace)) {
    for (let i = 0; i + 1 < a.length; i += 2) pairList.push([a[i], a[i + 1]]);
  }
  let freePairs = 0, freeAdj = 0, freeFar = 0, crossFree = 0, adj = 0, far = 0, locked = 0, dblCov = 0, mirrorFree = 0;
  for (const a of pairList) {
    const t = pairType(a[0], a[1], free0, covered);
    if (t.crossFree) crossFree++;
    if (t.linkedFree) freeAdj++;
    if (t.freeFar) freeFar++;
    if (t.freeFar && (a[0].x === a[1].x || a[0].y === a[1].y)) mirrorFree++;
    if (t.adj) adj++;
    if (t.far) far++;
    if (t.locked) locked++;
    if (t.dblCov) dblCov++;
  }
  freePairs = freeAdj + freeFar + crossFree;

  const byZ = {};
  for (const t of tiles) (byZ[t.z] ||= []).push(t);
  const zs = Object.keys(byZ).map(Number).sort((a, b) => a - b);
  const layerSizes = zs.map(z => byZ[z].length);
  const rows = new Set(tiles.filter(t => t.z === 0).map(t => t.y)).size;
  let support = true;
  let weakSupport = 0;
  for (let i = 1; i < zs.length; i++) {
    for (const t of byZ[zs[i]]) {
      const n = byZ[zs[i - 1]].filter(o => overlaps(t, o)).length;
      if (n < 1) support = false;
      if (n < 2) weakSupport++;
    }
  }

  const solved = cheatSolve(lv);
  const sim = simulate(lv, lv.level <= 3 ? 4000 : 1000);
  const minX = Math.min(...tiles.map(t => t.x)), maxX = Math.max(...tiles.map(t => t.x));
  const minY = Math.min(...tiles.map(t => t.y)), maxY = Math.max(...tiles.map(t => t.y));
  const interior = t => t.x > minX && t.x < maxX && t.y > minY && t.y < maxY;
  let interiorLinked = 0;
  for (const [a, b] of pairList) {
    if (free0.has(a.id) && free0.has(b.id) && a.z === b.z &&
      Math.abs(a.x - b.x) + Math.abs(a.y - b.y) === 1 && interior(a) && interior(b)) interiorLinked++;
  }
  const m = { F: free0.size, freePairs, freeAdj, freeFar, crossFree, adj, far, locked, dblCov, interiorLinked, mirrorFree };
  const phase = phaseCheck(lv, m, rows, zs.length, layerSizes);
  const randomOk = lv.level <= 3 ? (sim.win === 100 && sim.noMove === 0)
    : lv.level <= 7 ? (sim.noMove === 0)
    : (sim.noMove === 0 && sim.win <= (lv.level <= 12 ? 25 : 10));
  const ok = tiles.length === lv.tiles && !badPairs.length && support && solved.ok && lv.steps >= lv.tiles &&
    phase.ok && randomOk;
  if (!ok) bad++;
  console.log('L' + lv.level, lv.name,
    'tiles=' + tiles.length + '/' + lv.tiles,
    'layers=' + zs.length + '(' + layerSizes.join('/') + ')',
    'rows=' + rows, 'steps=' + lv.steps,
    'F=' + m.F,
    'freePairs=' + freePairs + '(adj ' + freeAdj + ',far ' + freeFar + ',cross ' + crossFree + ')',
    'pairTypes=adj' + adj + '/far' + far,
    'locked=' + locked, 'dblCov=' + dblCov,
    'badPairs=' + (badPairs.length ? badPairs.map(x => x[0] + ':' + x[1].length).join(',') : 0),
    'support=' + (support ? 'ok' : 'BAD') + '(weak ' + weakSupport + ')',
    'solve=' + solved.reason,
    'random=' + sim.win + '% noMove=' + sim.noMove,
    phase.ok ? 'phase-ok' : 'PHASE-FAIL(' + phase.why + ')',
    randomOk ? 'random-ok' : 'RANDOM-HIGH',
    ok ? 'OK' : 'FAIL');
}
console.log(bad ? 'FAILED ' + bad : 'ALL OK');
process.exit(bad ? 1 : 0);
