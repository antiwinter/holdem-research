import { RANGES, type RangeDef } from './ranges'
import { parseRange } from './notation'
import { RANK_CH, classCombos, type HandClass } from '../cards/cards'

export const FOLD_TIER = RANGES.length
export const TOTAL_COMBOS = 1326

// row = high card A..2, col above diagonal suited, below offsuit
export const GRID_CELLS: readonly HandClass[] = (() => {
  const cells: HandClass[] = []
  for (let row = 0; row < 13; row++)
    for (let col = 0; col < 13; col++) {
      const r1 = RANK_CH[12 - row]!
      const r2 = RANK_CH[12 - col]!
      cells.push(row === col ? r1 + r1 : col > row ? r1 + r2 + 's' : r2 + r1 + 'o')
    }
  return cells
})()

export interface HandInfo {
  cls: HandClass
  tier: number // tightest containing range, FOLD_TIER = in none
  ranges: readonly number[] // all containing ranges, tightest first
}

const memberships = RANGES.map((r) => parseRange(r.hands))

const byClass = new Map<HandClass, HandInfo>()
for (const cls of GRID_CELLS) {
  const ranges: number[] = []
  memberships.forEach((set, i) => {
    if (set.has(cls)) ranges.push(i)
  })
  byClass.set(cls, { cls, tier: ranges.length > 0 ? ranges[0]! : FOLD_TIER, ranges })
}

export const ALL_CLASSES: readonly HandClass[] = GRID_CELLS

export function handInfo(cls: HandClass): HandInfo {
  return byClass.get(cls)!
}

export function rangesFor(cls: HandClass): RangeDef[] {
  return handInfo(cls).ranges.map((i) => RANGES[i]!)
}

export function rangeCombos(r: RangeDef): number {
  return [...parseRange(r.hands)].reduce((s, c) => s + classCombos(c), 0)
}
