// Hand-curated seed ordering, tightest first. Anything derived (percentiles,
// position tiers, chart colors, practice answers) comes from this one list —
// swap it for solver-derived data without touching anything else.
// Cutoffs are combo-weighted % (see range.ts), loosely modeled on standard 6-max RFI.
export const HAND_RANKING: readonly string[] = [
  'AA', 'KK', 'QQ', 'JJ', 'AKs', 'TT', 'AQs', 'AJs', 'AKo', 'ATs',
  '99', 'AQo', 'AJo', 'KQs', '88', 'KJs', 'QJs', 'KTs', 'A9s', 'ATo',
  'KQo', '77', 'A8s', 'QTs', 'KJo', 'A5s', 'A7s', 'A4s', 'K9s', 'JTs',
  'A6s', 'A3s', '66', 'QJo', 'A9o', 'KTo', 'Q9s', 'A2s', 'J9s', 'T9s',
  'K9o', 'JTo', '55', 'K8s', 'J8s', 'T8s', 'Q8s', 'A8o', '98s', 'K7s',
  'A5o', 'Q7s', '87s', '44', 'K6s', 'J7s', 'T7s', 'A4o', 'K5s', '97s',
  '76s', 'Q6s', 'A7o', 'T6s', 'J6s', '86s', 'Q5s', '33', 'K4s', '96s',
  'A3o', 'T9o', 'J9o', 'K3s', '65s', 'Q4s', '75s', 'A6o', 'QTo', 'J5s',
  'Q9o', 'K2s', 'T5s', '22', '54s', 'Q3s', '85s', 'J4s', 'K8o', 'A2o',
  'T8o', 'Q2s', 'J8o', '64s', '43s', 'J3s', 'K7o', '95s', 'T4s', '98o',
  'Q8o', '87o', 'T3s', '53s', 'J7o', 'J2s', '74s', 'K6o', '94s', '84s',
  'K5o', 'Q7o', 'T2s', '63s', 'K4o', '42s', '93s', '52s', 'K3o', 'K2o',
  'Q6o', '92s', 'Q5o', '83s', 'Q4o', '82s', 'Q3o', '73s', 'Q2o', '72s',
  'J6o', '62s', 'J5o', '32s', 'J4o', 'T7o', 'J3o', 'T6o', 'J2o', 'T5o',
  '97o', 'T4o', '96o', 'T3o', '95o', 'T2o', '94o', '93o', '92o', '86o',
  '85o', '84o', '83o', '82o', '76o', '75o', '74o', '73o', '72o', '65o',
  '64o', '63o', '62o', '54o', '53o', '52o', '43o', '42o', '32o',
]

export type PositionId = 'UTG' | 'MP' | 'CO' | 'SB' | 'BTN'

// Ordered by cutoff ascending: a hand in tier i is opened by every position i..end.
export const POSITIONS: readonly { id: PositionId; cutoff: number }[] = [
  { id: 'UTG', cutoff: 15.4 },
  { id: 'MP', cutoff: 17.8 },
  { id: 'CO', cutoff: 25.5 },
  { id: 'SB', cutoff: 42.0 },
  { id: 'BTN', cutoff: 45.0 },
]
