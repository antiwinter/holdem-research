import { HAND_RANKING, POSITIONS, type PositionId } from './ranking'
import { classCombos, type HandClass } from '../cards/cards'

export const TOTAL_COMBOS = 1326
export const FOLD_TIER = POSITIONS.length

export interface HandInfo {
  cls: HandClass
  rank: number // 0 = tightest
  percentile: number // cumulative combo % through this hand, inclusive
  tier: number // index into POSITIONS, FOLD_TIER = opened by no one
}

const byClass = new Map<HandClass, HandInfo>()
{
  let cum = 0
  HAND_RANKING.forEach((cls, rank) => {
    cum += classCombos(cls)
    const percentile = (cum / TOTAL_COMBOS) * 100
    const tier = POSITIONS.findIndex((p) => p.cutoff >= percentile)
    byClass.set(cls, { cls, rank, percentile, tier: tier < 0 ? FOLD_TIER : tier })
  })
}

export const ALL_CLASSES: readonly HandClass[] = HAND_RANKING

export function handInfo(cls: HandClass): HandInfo {
  return byClass.get(cls)!
}

export function positionsFor(cls: HandClass): PositionId[] {
  const { tier } = handInfo(cls)
  if (tier === FOLD_TIER) return []
  return POSITIONS.slice(tier).map((p) => p.id)
}
