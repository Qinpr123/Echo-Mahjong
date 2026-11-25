/* 浮光麻将 · 牌面资产 v1
 * 24 面：4 灵兽 / 6 铜钱 / 6 竹节 / 4 风 / 2 龙 / 叶 / 云
 * 统一 100×100 viewBox；线条在 84px 下约 2.2–2.6px，56px 下仍可辨。
 * 所有图形原创，不复制 Vita Mahjong 素材。
 */
(() => {
  'use strict';

  const C = {
    ink: '#26332e',
    inkSoft: '#3d4a43',
    ivory: '#f6edd8',
    ivoryDeep: '#e8d7b5',
    jade: '#2f7d5b',
    jadeDark: '#1f5a4a',
    jadeLight: '#7fbf9f',
    blue: '#2f5d8a',
    blueDark: '#1d3f63',
    red: '#b23a2f',
    coral: '#d0603c',
    gold: '#b8892f',
    goldLight: '#e2c170',
    goldDark: '#7f5a17',
    fog: '#8fb8ae'
  };

  const A = (inner) =>
    '<g stroke-linecap="round" stroke-linejoin="round">' + inner + '</g>';

  function coin(cx, cy, r) {
    return A(
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + C.jadeDark + '" stroke="' + C.gold + '" stroke-width="2.2"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - 4) + '" fill="' + C.jade + '" stroke="none"/>' +
      '<rect x="' + (cx - r * 0.3) + '" y="' + (cy - r * 0.3) + '" width="' + (r * 0.6) + '" height="' + (r * 0.6) + '" rx="2" fill="' + C.ivory + '" stroke="' + C.ink + '" stroke-width="1.3"/>' +
      '<path d="M' + (cx - r * 0.5) + ' ' + (cy - r * 0.55) + ' q' + (r * 0.2) + ' ' + (-r * 0.2) + ' ' + (r * 0.45) + ' ' + (-r * 0.05) + '" fill="none" stroke="' + C.jadeLight + '" stroke-width="1.4" opacity=".8"/>'
    );
  }

  function stalks(items) {
    return A(items.join(''));
  }

  function stalk(x, y, h, leaf) {
    const tie1 = y + h * 0.34;
    const tie2 = y + h * 0.68;
    let s =
      '<rect x="' + (x - 5) + '" y="' + y + '" width="10" height="' + h + '" rx="5" fill="' + C.jade + '" stroke="' + C.ink + '" stroke-width="2"/>' +
      '<path d="M' + (x - 2.5) + ' ' + (y + 7) + ' v' + (h - 14) + '" fill="none" stroke="' + C.jadeLight + '" stroke-width="2" opacity=".7"/>' +
      '<rect x="' + (x - 6.5) + '" y="' + tie1 + '" width="13" height="4" rx="2" fill="' + C.gold + '" stroke="' + C.goldDark + '" stroke-width=".8"/>' +
      '<rect x="' + (x - 6.5) + '" y="' + tie2 + '" width="13" height="4" rx="2" fill="' + C.gold + '" stroke="' + C.goldDark + '" stroke-width=".8"/>';
    if (leaf) {
      s +=
        '<path d="M' + x + ' ' + (y + 10) + ' q-16 -5 -20 -17 q14 0 20 11" fill="' + C.jadeDark + '" stroke="' + C.ink + '" stroke-width="2"/>' +
        '<path d="M' + x + ' ' + (y + 20) + ' q15 -3 19 -15 q-13 -1 -19 9" fill="' + C.jade + '" stroke="' + C.ink + '" stroke-width="2"/>';
    }
    return s;
  }

  const ART = {
    /* ---------------- 灵兽 ---------------- */
    cat: A(
      '<path d="M33 42 L26 20 L43 30 Z" fill="' + C.jade + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M67 42 L74 20 L57 30 Z" fill="' + C.jade + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M34 31 L30 24 L37 28 Z" fill="' + C.coral + '" stroke="none"/>' +
      '<path d="M66 31 L70 24 L63 28 Z" fill="' + C.coral + '" stroke="none"/>' +
      '<circle cx="50" cy="47" r="22" fill="' + C.jade + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M32 62 Q50 54 68 62 L67 80 Q50 88 33 80 Z" fill="' + C.jade + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M67 72 Q80 70 79 57 Q78 51 73 53" fill="none" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M40 43 q4 -3 8 0 M52 43 q4 -3 8 0" fill="none" stroke="' + C.ink + '" stroke-width="1.8"/>' +
      '<circle cx="42" cy="45" r="2.2" fill="' + C.goldLight + '" stroke="none"/>' +
      '<circle cx="58" cy="45" r="2.2" fill="' + C.goldLight + '" stroke="none"/>' +
      '<path d="M47 51 L50 54 L53 51" fill="' + C.coral + '" stroke="none"/>' +
      '<path d="M50 54 v4 M50 58 q-4 3 -7 1 M50 58 q4 3 7 1" fill="none" stroke="' + C.ink + '" stroke-width="1.5"/>' +
      '<path d="M27 50 h-7 M28 56 l-6 2 M73 50 h7 M72 56 l6 2" fill="none" stroke="' + C.ink + '" stroke-width="1.3"/>' +
      '<path d="M39 69 q11 7 22 0" fill="none" stroke="' + C.gold + '" stroke-width="2"/>' +
      '<circle cx="50" cy="75" r="2.4" fill="' + C.gold + '" stroke="none"/>'
    ),
    dog: A(
      '<path d="M31 40 Q18 34 21 54 Q23 68 37 60" fill="' + C.blue + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M69 40 Q82 34 79 54 Q77 68 63 60" fill="' + C.blue + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<circle cx="50" cy="47" r="22" fill="' + C.blue + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<ellipse cx="50" cy="58" rx="15" ry="12" fill="' + C.ivory + '" stroke="none"/>' +
      '<circle cx="50" cy="53" r="4.2" fill="' + C.ink + '" stroke="none"/>' +
      '<path d="M50 57 v4 M50 61 q-4 3 -7 1 M50 61 q4 3 7 1" fill="none" stroke="' + C.ink + '" stroke-width="1.5"/>' +
      '<circle cx="41" cy="44" r="2.2" fill="' + C.ivory + '" stroke="none"/>' +
      '<circle cx="59" cy="44" r="2.2" fill="' + C.ivory + '" stroke="none"/>' +
      '<path d="M50 62 q0 6 -4 7 q-3 -2 0 -5" fill="' + C.coral + '" stroke="none"/>' +
      '<path d="M34 75 q16 8 32 0" fill="none" stroke="' + C.gold + '" stroke-width="2"/>' +
      '<circle cx="50" cy="81" r="3" fill="' + C.gold + '" stroke="none"/>' +
      '<path d="M29 38 q-1 -3 2 -4 M71 38 q1 -3 -2 -4" fill="none" stroke="' + C.ink + '" stroke-width="1.4"/>'
    ),
    fish: A(
      '<path d="M22 50 Q38 29 64 38 Q78 43 84 50 Q78 57 64 62 Q38 71 22 50 Z" fill="' + C.coral + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M20 50 L6 36 Q14 50 6 64 Z" fill="' + C.red + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M44 33 Q48 21 58 28 Q54 38 44 33 Z" fill="' + C.gold + '" stroke="' + C.ink + '" stroke-width="2"/>' +
      '<path d="M45 67 Q49 79 59 72 Q55 62 45 67 Z" fill="' + C.gold + '" stroke="' + C.ink + '" stroke-width="2"/>' +
      '<circle cx="64" cy="47" r="3.2" fill="' + C.ivory + '" stroke="none"/>' +
      '<circle cx="65" cy="47" r="1.5" fill="' + C.ink + '" stroke="none"/>' +
      '<path d="M30 44 q7 6 0 12 M39 40 q7 10 0 20 M48 38 q7 12 0 24" fill="none" stroke="' + C.ivory + '" stroke-width="1.4" opacity=".85"/>' +
      '<path d="M76 50 q4 2 6 0" fill="none" stroke="' + C.ink + '" stroke-width="1.6"/>' +
      '<circle cx="27" cy="32" r="3" fill="none" stroke="' + C.blue + '" stroke-width="1.4"/>' +
      '<circle cx="19" cy="23" r="2" fill="none" stroke="' + C.blue + '" stroke-width="1.4"/>'
    ),
    monkey: A(
      '<circle cx="28" cy="43" r="10" fill="' + C.red + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<circle cx="72" cy="43" r="10" fill="' + C.red + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<circle cx="28" cy="43" r="5" fill="' + C.goldLight + '" stroke="none"/>' +
      '<circle cx="72" cy="43" r="5" fill="' + C.goldLight + '" stroke="none"/>' +
      '<circle cx="50" cy="47" r="23" fill="' + C.red + '" stroke="' + C.ink + '" stroke-width="2.4"/>' +
      '<path d="M34 45 Q50 30 66 45 Q68 62 50 69 Q32 62 34 45 Z" fill="' + C.goldLight + '" stroke="none"/>' +
      '<circle cx="42" cy="45" r="2.5" fill="' + C.ink + '" stroke="none"/>' +
      '<circle cx="58" cy="45" r="2.5" fill="' + C.ink + '" stroke="none"/>' +
      '<path d="M50 49 v3 M45 55 q5 4 10 0" fill="none" stroke="' + C.ink + '" stroke-width="1.6"/>' +
      '<path d="M68 68 q15 2 13 16" fill="none" stroke="' + C.red + '" stroke-width="5"/>' +
      '<path d="M33 71 q17 8 34 0" fill="none" stroke="' + C.gold + '" stroke-width="2"/>' +
      '<path d="M38 27 q-3 -6 2 -9 M62 27 q3 -6 -2 -9" fill="none" stroke="' + C.ink + '" stroke-width="2"/>'
    ),

    /* ---------------- 铜钱 1–6 ---------------- */
    coin1: coin(50, 50, 23),
    coin2: A(coin(50, 34, 15) + coin(50, 66, 15)),
    coin3: A(coin(50, 30, 14) + coin(35, 66, 14) + coin(65, 66, 14)),
    coin4: A(coin(34, 34, 13) + coin(66, 34, 13) + coin(34, 66, 13) + coin(66, 66, 13)),
    coin5: A(coin(30, 30, 11) + coin(70, 30, 11) + coin(50, 50, 13) + coin(30, 70, 11) + coin(70, 70, 11)),
    coin6: A(coin(35, 25, 10.5) + coin(65, 25, 10.5) + coin(35, 50, 10.5) + coin(65, 50, 10.5) + coin(35, 75, 10.5) + coin(65, 75, 10.5)),

    /* ---------------- 竹节 1–6 ---------------- */
    bamboo1: stalks([stalk(50, 12, 72, true)]),
    bamboo2: stalks([stalk(38, 16, 66, true), stalk(62, 16, 66, false)]),
    bamboo3: stalks([stalk(32, 20, 60, true), stalk(50, 12, 70, false), stalk(68, 20, 60, true)]),
    bamboo4: stalks([stalk(34, 14, 34), stalk(66, 14, 34), stalk(34, 52, 34), stalk(66, 52, 34)]),
    bamboo5: stalks([stalk(30, 10, 28), stalk(70, 10, 28), stalk(50, 36, 28), stalk(30, 62, 28), stalk(70, 62, 28)]),
    bamboo6: stalks([stalk(35, 8, 26), stalk(65, 8, 26), stalk(35, 37, 26), stalk(65, 37, 26), stalk(35, 66, 26), stalk(65, 66, 26)]),

    /* ---------------- 风 ---------------- */
    east: A(
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + C.gold + '" stroke-width="1.4" opacity=".55"/>' +
      '<path d="M87 50 l-9 -5 v10 Z" fill="' + C.red + '" stroke="none"/>' +
      '<path d="M22 22 l5 5 M78 22 l-5 5 M22 78 l5 -5 M78 78 l-5 -5" fill="none" stroke="' + C.gold + '" stroke-width="1.2" opacity=".55"/>' +
      '<text x="50" y="60" text-anchor="middle" font-family="\'Songti SC\',\'Noto Serif SC\',STSong,serif" font-size="49" font-weight="700" fill="' + C.blue + '">東</text>' +
      '<circle cx="50" cy="83" r="2" fill="' + C.gold + '" stroke="none"/>'
    ),
    south: A(
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + C.gold + '" stroke-width="1.4" opacity=".55"/>' +
      '<path d="M50 87 l-5 -9 h10 Z" fill="' + C.red + '" stroke="none"/>' +
      '<path d="M22 22 l5 5 M78 22 l-5 5 M22 78 l5 -5 M78 78 l-5 -5" fill="none" stroke="' + C.gold + '" stroke-width="1.2" opacity=".55"/>' +
      '<text x="50" y="60" text-anchor="middle" font-family="\'Songti SC\',\'Noto Serif SC\',STSong,serif" font-size="49" font-weight="700" fill="' + C.blue + '">南</text>' +
      '<circle cx="17" cy="50" r="2" fill="' + C.gold + '" stroke="none"/>'
    ),
    west: A(
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + C.gold + '" stroke-width="1.4" opacity=".55"/>' +
      '<path d="M13 50 l9 -5 v10 Z" fill="' + C.red + '" stroke="none"/>' +
      '<path d="M22 22 l5 5 M78 22 l-5 5 M22 78 l5 -5 M78 78 l-5 -5" fill="none" stroke="' + C.gold + '" stroke-width="1.2" opacity=".55"/>' +
      '<text x="50" y="60" text-anchor="middle" font-family="\'Songti SC\',\'Noto Serif SC\',STSong,serif" font-size="49" font-weight="700" fill="' + C.blue + '">西</text>' +
      '<circle cx="83" cy="50" r="2" fill="' + C.gold + '" stroke="none"/>'
    ),
    north: A(
      '<circle cx="50" cy="50" r="38" fill="none" stroke="' + C.gold + '" stroke-width="1.4" opacity=".55"/>' +
      '<path d="M50 13 l-5 9 h10 Z" fill="' + C.red + '" stroke="none"/>' +
      '<path d="M22 22 l5 5 M78 22 l-5 5 M22 78 l5 -5 M78 78 l-5 -5" fill="none" stroke="' + C.gold + '" stroke-width="1.2" opacity=".55"/>' +
      '<text x="50" y="60" text-anchor="middle" font-family="\'Songti SC\',\'Noto Serif SC\',STSong,serif" font-size="49" font-weight="700" fill="' + C.blue + '">北</text>' +
      '<circle cx="50" cy="17" r="2" fill="' + C.gold + '" stroke="none"/>'
    ),

    /* ---------------- 龙 ---------------- */
    zhong: A(
      '<circle cx="50" cy="50" r="37" fill="none" stroke="' + C.gold + '" stroke-width="1.8" opacity=".6"/>' +
      '<path d="M50 9 l4 10 h-8 Z" fill="' + C.gold + '" stroke="none"/>' +
      '<text x="50" y="64" text-anchor="middle" font-family="\'Songti SC\',\'Noto Serif SC\',STSong,serif" font-size="54" font-weight="700" fill="' + C.red + '">中</text>' +
      '<path d="M25 81 q12 -7 25 0 q13 7 25 0" fill="none" stroke="' + C.gold + '" stroke-width="2"/>'
    ),
    fa: A(
      '<circle cx="50" cy="50" r="37" fill="none" stroke="' + C.gold + '" stroke-width="1.8" opacity=".6"/>' +
      '<path d="M50 9 l4 10 h-8 Z" fill="' + C.gold + '" stroke="none"/>' +
      '<text x="50" y="62" text-anchor="middle" font-family="\'Songti SC\',\'Noto Serif SC\',STSong,serif" font-size="49" font-weight="700" fill="' + C.jade + '">發</text>' +
      '<path d="M25 81 q12 -7 25 0 q13 7 25 0" fill="none" stroke="' + C.gold + '" stroke-width="2"/>'
    ),

    /* ---------------- 草木·天气 ---------------- */
    leaf: A(
      '<path d="M50 12 C66 28 75 47 50 86 C25 47 34 28 50 12 Z" fill="' + C.goldLight + '" stroke="' + C.goldDark + '" stroke-width="2.2"/>' +
      '<path d="M50 18 C61 34 65 49 50 76" fill="none" stroke="' + C.goldDark + '" stroke-width="2.2"/>' +
      '<path d="M50 35 l-12 -8 M50 47 l14 -10 M50 59 l-12 -8 M50 70 l10 -7" fill="none" stroke="' + C.gold + '" stroke-width="1.6"/>' +
      '<path d="M50 86 q-4 6 -8 8" fill="none" stroke="' + C.goldDark + '" stroke-width="2.2"/>'
    ),
    cloud: A(
      '<path d="M24 55 q0 -15 15 -15 q3 -14 18 -12 q13 2 14 15 q12 1 12 13 q0 13 -15 13 h-31 q-13 0 -13 -14 Z" fill="' + C.fog + '" stroke="' + C.blueDark + '" stroke-width="2.2"/>' +
      '<path d="M31 70 q10 7 20 0 q10 -7 20 0" fill="none" stroke="' + C.blue + '" stroke-width="4"/>' +
      '<path d="M36 79 q8 4 16 0" fill="none" stroke="' + C.blueDark + '" stroke-width="3"/>' +
      '<path d="M22 32 h10 M68 32 h10" fill="none" stroke="' + C.blue + '" stroke-width="2"/>' +
      '<circle cx="27" cy="23" r="2" fill="' + C.blue + '" stroke="none"/>' +
      '<circle cx="75" cy="20" r="1.6" fill="' + C.blue + '" stroke="none"/>'
    )
  };

  const META = {
    cat: { label: '猫', family: '灵兽', color: C.jade },
    dog: { label: '犬', family: '灵兽', color: C.blue },
    fish: { label: '鱼', family: '灵兽', color: C.coral },
    monkey: { label: '猴', family: '灵兽', color: C.red },
    coin1: { label: '铜钱一', family: '铜钱', color: C.jade },
    coin2: { label: '铜钱二', family: '铜钱', color: C.jade },
    coin3: { label: '铜钱三', family: '铜钱', color: C.jade },
    coin4: { label: '铜钱四', family: '铜钱', color: C.jade },
    coin5: { label: '铜钱五', family: '铜钱', color: C.jade },
    coin6: { label: '铜钱六', family: '铜钱', color: C.jade },
    bamboo1: { label: '竹节一', family: '竹节', color: C.jade },
    bamboo2: { label: '竹节二', family: '竹节', color: C.jade },
    bamboo3: { label: '竹节三', family: '竹节', color: C.jade },
    bamboo4: { label: '竹节四', family: '竹节', color: C.jade },
    bamboo5: { label: '竹节五', family: '竹节', color: C.jade },
    bamboo6: { label: '竹节六', family: '竹节', color: C.jade },
    east: { label: '東', family: '风', color: C.blue },
    south: { label: '南', family: '风', color: C.blue },
    west: { label: '西', family: '风', color: C.blue },
    north: { label: '北', family: '风', color: C.blue },
    zhong: { label: '中', family: '龙', color: C.red },
    fa: { label: '發', family: '龙', color: C.jade },
    leaf: { label: '叶', family: '草木', color: C.gold },
    cloud: { label: '云', family: '天气', color: C.blue }
  };

  const TILES = {};
  for (const id of Object.keys(ART)) {
    TILES[id] = { id, art: ART[id], ...META[id] };
  }

  window.FUANG_TILE_ART = ART;
  window.FUANG_TILES = TILES;
})();
