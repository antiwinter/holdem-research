// Solver-derived 6-max preflop ranges (user-provided). Ordered tightest first;
// tier coloring = tightest range containing the hand. Sizes match cutoffs
// within ~0.6pp (enforced by range.test.ts).
export interface RangeDef {
  id: string
  cutoff: number // combo-weighted % of all hands
  color: string
  hands: string[] // shorthand: '22+', 'ATs+', 'A5s-A2s', 'T9s'
}

export const FOLD_COLOR = '#d4d4d8'
export const FOLD_TEXT_COLOR = '#71717a'

export function textColorFor(hex: string): string {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  const l = ((Math.max(r, g, b) + Math.min(r, g, b)) / 2 / 255) * 100
  return l > 75 ? '#333' : '#fff'
}

export const RANGES: readonly RangeDef[] = [
  {
    id: '3BET',
    cutoff: 5.7,
    color: '#ff9e30',
    hands: ['JJ+', 'AKs', 'AKo', 'A5s-A2s', 'KQs', 'KJs', '76s', '65s', '54s'],
  },
  {
    id: 'UTG',
    cutoff: 14.3,
    color: '#ff837d',
    hands: ['22+', 'ATs+', 'A5s-A2s', 'KTs+', 'QTs+', 'JTs', 'T9s', '98s', 'AJo+', 'KQo'],
  },
  {
    id: 'HJ',
    cutoff: 18.9,
    color: '#d53aed',
    hands: ['22+', 'A2s+', 'K9s+', 'Q9s+', 'J9s+', 'T8s+', '98s', '87s', 'ATo+', 'KJo+'],
  },
  {
    id: 'CO',
    cutoff: 25.5,
    color: '#86a8f1',
    hands: ['22+', 'A2s+', 'K5s+', 'Q8s+', 'J8s+', 'T8s+', '97s+', '87s', '76s', '65s', '54s', 'A8o+', 'KTo+', 'QJo'],
  },
  {
    id: 'SB',
    cutoff: 33,
    color: '#1bbd31',
    hands: ['22+', 'A2s+', 'K4s+', 'Q6s+', 'J7s+', 'T7s+', '96s+', '86s+', '76s', '65s', '54s', 'A5o+', 'K9o+', 'QTo+', 'JTo'],
  },
  {
    id: 'BTN',
    cutoff: 43.3,
    color: '#d3ddb5',
    hands: ['22+', 'A2s+', 'K2s+', 'Q4s+', 'J6s+', 'T6s+', '95s+', '85s+', '75s+', '64s+', '54s', 'A2o+', 'K8o+', 'Q9o+', 'J9o+', 'T9o', '98o'],
  },
]
