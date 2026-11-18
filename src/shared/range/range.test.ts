import { describe, it, expect } from 'vitest'
import { HAND_RANKING, POSITIONS } from './ranking'
import { handInfo, positionsFor, ALL_CLASSES, TOTAL_COMBOS, FOLD_TIER } from './range'
import { classCombos, RANK_CH } from '../cards/cards'

function fullGrid(): Set<string> {
  const classes = new Set<string>()
  for (let hi = 12; hi >= 0; hi--)
    for (let lo = 12; lo >= 0; lo--) {
      const r1 = RANK_CH[hi]!
      const r2 = RANK_CH[lo]!
      if (hi === lo) classes.add(r1 + r2)
      else if (hi > lo) classes.add(r1 + r2 + 's')
      else classes.add(r2 + r1 + 'o')
    }
  return classes
}

describe('ranking seed', () => {
  it('contains each of the 169 classes exactly once', () => {
    expect(HAND_RANKING.length).toBe(169)
    expect(new Set(HAND_RANKING).size).toBe(169)
    expect(new Set(HAND_RANKING)).toEqual(fullGrid())
  })

  it('combo weights sum to 1326', () => {
    expect(HAND_RANKING.reduce((s, cls) => s + classCombos(cls), 0)).toBe(TOTAL_COMBOS)
  })

  it('anchors: AA tightest, 32o loosest', () => {
    expect(HAND_RANKING[0]).toBe('AA')
    expect(HAND_RANKING[168]).toBe('32o')
  })
})

describe('derived range info', () => {
  it('percentiles are monotone and end at 100', () => {
    let prev = 0
    for (const cls of ALL_CLASSES) {
      const p = handInfo(cls).percentile
      expect(p).toBeGreaterThan(prev)
      prev = p
    }
    expect(prev).toBeCloseTo(100, 6)
  })

  it('AA percentile is its combo share', () => {
    expect(handInfo('AA').percentile).toBeCloseTo((6 / 1326) * 100, 6)
  })

  it('tier matches cutoffs', () => {
    for (const cls of ALL_CLASSES) {
      const { percentile, tier } = handInfo(cls)
      if (tier === FOLD_TIER) {
        for (const p of POSITIONS) expect(percentile).toBeGreaterThan(p.cutoff)
        expect(positionsFor(cls)).toEqual([])
      } else {
        expect(percentile).toBeLessThanOrEqual(POSITIONS[tier]!.cutoff)
        if (tier > 0) expect(percentile).toBeGreaterThan(POSITIONS[tier - 1]!.cutoff)
        expect(positionsFor(cls)).toEqual(POSITIONS.slice(tier).map((p) => p.id))
      }
    }
  })

  it('premium hands are opened everywhere, trash nowhere', () => {
    expect(positionsFor('AA')).toEqual(['UTG', 'MP', 'CO', 'SB', 'BTN'])
    expect(positionsFor('32o')).toEqual([])
  })
})
