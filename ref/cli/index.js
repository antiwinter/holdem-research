#!/usr/bin/env node
'use strict';
const { Command } = require('commander');
const { parseCards, cardsStr, cardStr } = require('./cards');
const { run } = require('./equity');

const program = new Command();
program
  .name('holdem-equity')
  .description("Texas Hold'em equity vs a random hand, with winning outs")
  .argument('<hand>', 'hero hole cards, e.g. 5s6d or a5d (shared suit)')
  .argument('<board>', 'community cards: flop (3) or turn (4), e.g. as8d7c or 38s6h')
  .action((handStr, boardStr) => {
    const hero = parseCards(handStr, 'hand');
    const board = parseCards(boardStr, 'board');
    if (hero.length !== 2) throw new Error(`hand must be exactly 2 cards, got ${hero.length}`);
    if (board.length !== 3 && board.length !== 4)
      throw new Error(`board must be 3 (flop) or 4 (turn) cards, got ${board.length}`);
    const all = [...hero, ...board];
    if (new Set(all).size !== all.length) throw new Error('duplicate card in hand or board');

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
