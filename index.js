#!/usr/bin/env node
'use strict';
const { Command } = require('commander');

// ---------- card encoding: rank*4 + suit ----------
const RANK_IDX = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, t: 8, j: 9, q: 10, k: 11, a: 12 };
const SUIT_IDX = { d: 0, s: 1, c: 2, h: 3 };
const RANK_CH = '23456789TJQKA';
const SUIT_CH = 'dsch';

function parseCards(str, label) {
  if (str.length % 2 !== 0) throw new Error(`${label} "${str}": odd length`);
  const cards = [];
  for (let i = 0; i < str.length; i += 2) {
    const r = RANK_IDX[str[i].toLowerCase()];
    const s = SUIT_IDX[str[i + 1].toLowerCase()];
    if (r === undefined || s === undefined)
      throw new Error(`${label} "${str}": invalid card "${str.slice(i, 2)}"`);
    cards.push(r * 4 + s);
  }
  return cards;
}

const cardStr = (c) => RANK_CH[c >> 2] + SUIT_CH[c & 3];
const cardsStr = (cs) => cs.map(cardStr).join(' ');

// ---------- 7-card evaluator (higher value = better hand) ----------
const POPC = new Uint8Array(8192);
const STRAIGHT = new Int8Array(8192).fill(-1);
{
  for (let m = 1; m < 8192; m++) POPC[m] = POPC[m >> 1] + (m & 1);
  const pats = [];
  for (let high = 14; high >= 6; high--) {
    let m = 0;
    for (let r = high; r > high - 5; r--) m |= 1 << (r - 2);
    pats.push([m, high]);
  }
  pats.push([(1 << 12) | 0b1111, 5]); // wheel A-5
  for (let m = 0; m < 8192; m++)
    for (const [pm, high] of pats)
      if ((m & pm) === pm) { STRAIGHT[m] = high; break; }
}

function top5(m) {
  let v = 0, pos = 16, left = 5;
  for (let r = 12; r >= 0 && left; r--)
    if ((m >>> r) & 1) { v |= r << pos; pos -= 4; left--; }
  return v;
}

const _rc = new Uint8Array(13);
const _sm = new Int32Array(4);

function evaluate7(a, b, c, d, e, f, g) {
  _rc.fill(0); _sm[0] = _sm[1] = _sm[2] = _sm[3] = 0;
  let r = a >> 2; _rc[r]++; _sm[a & 3] |= 1 << r;
  r = b >> 2; _rc[r]++; _sm[b & 3] |= 1 << r;
  r = c >> 2; _rc[r]++; _sm[c & 3] |= 1 << r;
  r = d >> 2; _rc[r]++; _sm[d & 3] |= 1 << r;
  r = e >> 2; _rc[r]++; _sm[e & 3] |= 1 << r;
  r = f >> 2; _rc[r]++; _sm[f & 3] |= 1 << r;
  r = g >> 2; _rc[r]++; _sm[g & 3] |= 1 << r;

  const m0 = _sm[0], m1 = _sm[1], m2 = _sm[2], m3 = _sm[3];
  let fm = -1;
  if (POPC[m0] > 4) fm = m0;
  else if (POPC[m1] > 4) fm = m1;
  else if (POPC[m2] > 4) fm = m2;
  else if (POPC[m3] > 4) fm = m3;
  if (fm >= 0) {
    const sf = STRAIGHT[fm];
    if (sf >= 0) return (8 << 26) | (sf << 20);
    return (5 << 26) | top5(fm);
  }

  const rankMask = m0 | m1 | m2 | m3;
  let quad = -1, t1 = -1, t2 = -1, p1 = -1, p2 = -1;
  for (let i = 12; i >= 0; i--) {
    const n = _rc[i];
    if (n === 4) quad = i;
    else if (n === 3) { if (t1 < 0) t1 = i; else t2 = i; }
    else if (n === 2) { if (p1 < 0) p1 = i; else if (p2 < 0) p2 = i; }
  }
  if (quad >= 0) {
    let k = -1;
    for (let i = 12; i >= 0; i--) if (i !== quad && _rc[i] > 0) { k = i; break; }
    return (7 << 26) | (quad << 20) | (k << 16);
  }
  if (t1 >= 0 && (t2 >= 0 || p1 >= 0))
    return (6 << 26) | (t1 << 20) | ((t2 > p1 ? t2 : p1) << 16);
  const st = STRAIGHT[rankMask];
  if (st >= 0) return (4 << 26) | (st << 20);
  if (t1 >= 0) return (3 << 26) | (t1 << 20) | top5(rankMask & ~(1 << t1));
  if (p2 >= 0) {
    let k = -1;
    for (let i = 12; i >= 0; i--) if (i !== p1 && i !== p2 && _rc[i] > 0) { k = i; break; }
    return (2 << 26) | (p1 << 20) | (p2 << 16) | (k << 12);
  }
  if (p1 >= 0) return (1 << 26) | (p1 << 20) | top5(rankMask & ~(1 << p1));
  return top5(rankMask);
}

// ---------- exhaustive equity vs a random hand ----------
function run(hero, board) {
  const used = new Set([...hero, ...board]);
  const deck = [];
  for (let c = 0; c < 52; c++) if (!used.has(c)) deck.push(c);

  const b0 = board[0], b1 = board[1], b2 = board[2], b3 = board[3];
  const h0 = hero[0], h1 = hero[1];
  const heroCache = new Int32Array(52 * 52).fill(-1);
  const cw = new Float64Array(52), ct = new Float64Array(52), cl = new Float64Array(52), cn = new Float64Array(52);
  let W = 0, T = 0, L = 0, N = 0;

  if (board.length === 4) {
    // turn: one river card left
    for (let i = 0; i < deck.length; i++)
      for (let j = i + 1; j < deck.length; j++) {
        const v1 = deck[i], v2 = deck[j];
        for (let k = 0; k < deck.length; k++) {
          if (k === i || k === j) continue;
          const rr = deck[k];
          let hv = heroCache[rr];
          if (hv < 0) { hv = evaluate7(h0, h1, b0, b1, b2, b3, rr); heroCache[rr] = hv; }
          const vv = evaluate7(v1, v2, b0, b1, b2, b3, rr);
          if (hv > vv) { W++; cw[rr]++; }
          else if (hv === vv) { T++; ct[rr]++; }
          else { L++; cl[rr]++; }
          N++; cn[rr]++;
        }
      }
  } else {
    // flop: turn + river left; credit each runout card's conditional tally
    for (let i = 0; i < deck.length; i++)
      for (let j = i + 1; j < deck.length; j++) {
        const v1 = deck[i], v2 = deck[j];
        for (let k = 0; k < deck.length; k++) {
          if (k === i || k === j) continue;
          const t = deck[k];
          for (let l = k + 1; l < deck.length; l++) {
            if (l === i || l === j) continue;
            const rr = deck[l];
            const key = t * 52 + rr;
            let hv = heroCache[key];
            if (hv < 0) { hv = evaluate7(h0, h1, b0, b1, b2, t, rr); heroCache[key] = hv; }
            const vv = evaluate7(v1, v2, b0, b1, b2, t, rr);
            if (hv > vv) { W++; cw[t]++; cw[rr]++; }
            else if (hv === vv) { T++; ct[t]++; ct[rr]++; }
            else { L++; cl[t]++; cl[rr]++; }
            N++; cn[t]++; cn[rr]++;
          }
        }
      }
  }
  return { W, T, L, N, cw, ct, cl, cn, deck };
}

// ---------- CLI ----------
module.exports = { parseCards, cardStr, evaluate7, run };

if (require.main !== module) return;

const program = new Command();
program
  .name('holdem-equity')
  .description("Texas Hold'em equity vs a random hand, with winning outs")
  .argument('<hand>', 'hero hole cards, e.g. 5s6d')
  .argument('<board>', 'community cards: flop (3 cards) or turn (4 cards), e.g. as8d7c')
  .action((handStr, boardStr) => {
    const hero = parseCards(handStr, 'hand');
    const board = parseCards(boardStr, 'board');
    if (hero.length !== 2) throw new Error(`hand must be exactly 2 cards, got ${hero.length}`);
    if (board.length !== 3 && board.length !== 4)
      throw new Error(`board must be 3 (flop) or 4 (turn) cards, got ${board.length}`);
    const all = [...hero, ...board];
    if (new Set(all).size !== all.length) throw new Error('duplicate card across hand and board');

    const t0 = Date.now();
    const { W, T, L, N, cw, ct, cl, cn, deck } = run(hero, board);
    const eq = (W + T / 2) / N;
    const street = board.length === 3 ? 'flop' : 'turn';
    const next = board.length === 3 ? 'turn' : 'river';

    console.log(`Hero  : ${cardsStr(hero)}`);
    console.log(`Board : ${cardsStr(board)}  (${street})`);
    console.log(`Vs    : random hand, all ${N.toLocaleString()} runouts`);
    console.log('');
    console.log(`Equity : ${(eq * 100).toFixed(2)}%  (win ${(W / N * 100).toFixed(2)}% / tie ${(T / N * 100).toFixed(2)}% / lose ${(L / N * 100).toFixed(2)}%)`);
    console.log('');

    const outs = deck
      .map((c) => {
        const n = cn[c];
        return { c, eq: (cw[c] + ct[c] / 2) / n, w: cw[c] / n, t: ct[c] / n, l: cl[c] / n };
      })
      .filter((o) => o.eq > 0.5)
      .sort((a, b) => b.eq - a.eq || (a.c >> 2) - (b.c >> 2));

    console.log(`Winning outs — ${next} cards giving >50% equity (${outs.length} of ${deck.length}):`);
    if (outs.length === 0) console.log('  (none — never ahead on any future card)');
    for (const o of outs)
      console.log(`  ${cardStr(o.c)}  ${(o.eq * 100).toFixed(1).padStart(5)}%   win ${(o.w * 100).toFixed(1).padStart(4)} / tie ${(o.t * 100).toFixed(1).padStart(4)} / lose ${(o.l * 100).toFixed(1).padStart(4)}`);

    console.log(`\n(calculated in ${((Date.now() - t0) / 1000).toFixed(2)}s)`);
  });

program.parseAsync().catch((err) => {
  console.error(`error: ${err.message}`);
  process.exit(1);
});
