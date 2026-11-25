/* 将 tiles.js 导出为独立的 24 个单面 SVG、24 个整牌 SVG 与 sprite。
 * 牌型 3:4（游戏内 81×108），厚度只出现在右边与底边。
 * 用法：node assets/export-tiles.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const code = fs.readFileSync(path.join(root, 'tiles.js'), 'utf8');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(code, context);

const TILES = context.window.FUANG_TILES;
const outDir = path.join(root, 'tiles');
fs.mkdirSync(outDir, { recursive: true });

const xmlHead = '<svg xmlns="http://www.w3.org/2000/svg"';
const FACE_W = 100;
const FACE_H = 133.333;
const ART_OFFSET_Y = (FACE_H - FACE_W) / 2;

function faceSvg(t) {
  return xmlHead + ' viewBox="0 0 100 133.333" width="300" height="400">\n' +
    '  <title>' + t.label + ' · ' + t.family + '</title>\n' +
    '  <g transform="translate(0 ' + ART_OFFSET_Y.toFixed(3) + ')">\n' +
    '    ' + t.art + '\n' +
    '  </g>\n' +
    '</svg>\n';
}

function tileSvg(t) {
  return xmlHead + ' viewBox="0 0 248 330" width="248" height="330">\n' +
    '  <title>' + t.label + ' · ' + t.family + '</title>\n' +
    '  <defs>\n' +
    '    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">\n' +
    '      <stop offset="0" stop-color="#fffdf6"/>\n' +
    '      <stop offset=".58" stop-color="#f6ecd6"/>\n' +
    '      <stop offset="1" stop-color="#ead9b7"/>\n' +
    '    </linearGradient>\n' +
    '    <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">\n' +
    '      <stop offset="0" stop-color="#4a9476"/>\n' +
    '      <stop offset=".58" stop-color="#1f5a4a"/>\n' +
    '      <stop offset="1" stop-color="#164236"/>\n' +
    '    </linearGradient>\n' +
    '    <clipPath id="faceClip"><rect x="2" y="2" width="236" height="316" rx="26"/></clipPath>\n' +
    '  </defs>\n' +
    '  <rect x="8" y="10" width="240" height="320" rx="26" fill="#0a2822"/>\n' +
    '  <rect x="4" y="6" width="240" height="320" rx="26" fill="url(#rim)"/>\n' +
    '  <g clip-path="url(#faceClip)">\n' +
    '    <rect x="2" y="2" width="236" height="316" rx="26" fill="url(#paper)"/>\n' +
    '    <circle cx="66" cy="44" r="112" fill="#fff" opacity=".22"/>\n' +
    '  </g>\n' +
    '  <rect x="2" y="2" width="236" height="316" rx="26" fill="none" stroke="#e3cfa8" stroke-width="3"/>\n' +
    '  <rect x="12" y="12" width="216" height="296" rx="21" fill="none" stroke="#b8892f" stroke-opacity=".3" stroke-width="1.5"/>\n' +
    '  <g transform="translate(20 60) scale(2)">\n' +
    '    ' + t.art + '\n' +
    '  </g>\n' +
    '</svg>\n';
}

const manifest = {
  name: '浮光麻将牌面',
  version: '1.1',
  viewBox: '0 0 100 133.333',
  ratio: '3:4',
  tileSize: '81x108',
  thickness: { side: 'right+bottom', rim: 4, edge: 8 },
  families: ['灵兽', '铜钱', '竹节', '风', '龙', '秘宝'],
  tiles: {}
};

const symbols = [];
for (const [id, t] of Object.entries(TILES)) {
  fs.writeFileSync(path.join(outDir, 'face-' + id + '.svg'), faceSvg(t));
  fs.writeFileSync(path.join(outDir, 'tile-' + id + '.svg'), tileSvg(t));
  symbols.push('  <symbol id="fuang-' + id + '" viewBox="0 0 100 133.333"><g transform="translate(0 ' + ART_OFFSET_Y.toFixed(3) + ')">' + t.art + '</g></symbol>');
  manifest.tiles[id] = {
    label: t.label,
    family: t.family,
    color: t.color,
    face: 'face-' + id + '.svg',
    tile: 'tile-' + id + '.svg'
  };
}

fs.writeFileSync(
  path.join(root, 'tiles-sprite.svg'),
  xmlHead + ' style="display:none" aria-hidden="true">\n' + symbols.join('\n') + '\n</svg>\n'
);
fs.writeFileSync(path.join(root, 'tiles-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log('exported ' + Object.keys(TILES).length + ' tiles to ' + outDir);
