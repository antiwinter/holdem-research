'use strict';

// card encoding: rank*4 + suit
// "1" is an alias for ace
const RANK_IDX = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, t: 8, j: 9, q: 10, k: 11, a: 12, 1: 12 };
const SUIT_IDX = { d: 0, s: 1, c: 2, h: 3 };
const RANK_CH = '23456789TJQKA';
const SUIT_CH = 'dsch';

// Parses rank runs sharing one suit char: "a5d" = Ad 5d, "38s6h" = 3s 8s 6h.
// Plain rank+suit pairs ("as8d7c") parse identically.
function parseCards(str, label) {
  const cards = [];
  let ranks = [];
  for (const ch of str.toLowerCase()) {
    const r = RANK_IDX[ch];
    if (r !== undefined) { ranks.push(r); continue; }
    const s = SUIT_IDX[ch];
    if (s === undefined) throw new Error(`${label} "${str}": invalid character "${ch}"`);
    if (ranks.length === 0) throw new Error(`${label} "${str}": suit "${ch}" with no preceding rank`);
    for (const rr of ranks) cards.push(rr * 4 + s);
    ranks = [];
  }
  if (ranks.length > 0) throw new Error(`${label} "${str}": missing suit after rank(s)`);
  return cards;
}

const cardStr = (c) => RANK_CH[c >> 2] + SUIT_CH[c & 3];
const cardsStr = (cs) => cs.map(cardStr).join(' ');

module.exports = { RANK_IDX, SUIT_IDX, parseCards, cardStr, cardsStr };
