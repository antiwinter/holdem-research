import { describe, it, expect } from 'vitest'
import { expandToken, parseRange } from './notation'
import { RANGES, textColorFor } from './ranges'
import { GRID_CELLS, handInfo, FOLD_TIER, rangeCombos, TOTAL_COMBOS } from './range'
import { classCombos } from '../cards/cards'

describe('expandToken', () => {
  it('expands pairs', () => {
    expect(expandToken('AA')).toEqual(['AA'])
    expect(expandToken('22+')).toHaveLength(13)
    expect(expandToken('22+')[0]).toBe('22')
    expect(expandToken('22+')[12]).toBe('AA')
    expect(expandToken('77-22')).toHaveLength(6)
  })

  it('expands suited/offsuit upward within the high-card row', () => {
    expect(expandToken('ATs+')).toEqual(['ATs', 'AJs', 'AQs', 'AKs'])
    expect(expandToken('A2s+')).toHaveLength(12)
    expect(expandToken('AJo+')).toEqual(['AJo', 'AQo', 'AKo'])
    expect(expandToken('T8s+')).toEqual(['T8s', 'T9s'])
    expect(expandToken('97s+')).toEqual(['97s', '98s'])
    expect(expandToken('K2s+')).toHaveLength(11)
  })

  it('expands dash ranges in either direction (ascending output)', () => {
    expect(expandToken('A5s-A2s')).toEqual(['A2s', 'A3s', 'A4s', 'A5s'])
    expect(expandToken('A2s-A5s')).toEqual(['A2s', 'A3s', 'A4s', 'A5s'])
  })

  it('rejects invalid tokens', () => {
    expect(() => expandToken('AXo')).toThrow()
    expect(() => expandToken('a5s')).toThrow()
    expect(() => expandToken('22s')).toThrow()
    expect(() => expandToken('AQs-KJs')).toThrow()
    expect(expandToken('AKs+')).toEqual(['AKs'])
  })
})

describe('LUT integrity', () => {
  it('grid covers all 169 classes exactly once', () => {
    expect(GRID_CELLS).toHaveLength(169)
    expect(new Set(GRID_CELLS).size).toBe(169)
    expect(GRID_CELLS.reduce((s, c) => s + classCombos(c), 0)).toBe(TOTAL_COMBOS)
  })

  it('every range parses and its size matches its cutoff', () => {
    for (const r of RANGES) {
      const pct = (rangeCombos(r) / TOTAL_COMBOS) * 100
      expect(Math.abs(pct - r.cutoff), `${r.id}: ${pct.toFixed(2)}% vs cutoff ${r.cutoff}`).toBeLessThan(0.75)
    }
  })

  it('ranges are ordered by cutoff ascending', () => {
    const cutoffs = RANGES.map((r) => r.cutoff)
    expect([...cutoffs].sort((a, b) => a - b)).toEqual(cutoffs)
  })

  it('text color follows background lightness', () => {
    expect(textColorFor('#d3ddb5')).toBe('#333')
    expect(textColorFor('#ff9e30')).toBe('#fff')
    expect(textColorFor('#d53aed')).toBe('#fff')
    expect(textColorFor('#1bbd31')).toBe('#fff')
  })
})

describe('membership', () => {
  it('tightest range wins, membership can be non-contiguous', () => {
    expect(handInfo('76s').tier).toBe(0) // 3BET contains it, UTG/HJ do not
    expect(handInfo('76s').ranges).toEqual([0, 3, 4, 5]) // 3BET, CO, SB, BTN
    expect(handInfo('A5s').tier).toBe(0)
    expect(handInfo('A7s').tier).toBe(2) // HJ+ via A2s+, not UTG
    expect(handInfo('AA').tier).toBe(0)
    expect(handInfo('32o').tier).toBe(FOLD_TIER)
    expect(handInfo('32o').ranges).toEqual([])
  })

  it('parseRange unions tokens', () => {
    const set = parseRange(['JJ+', '76s'])
    expect(set.size).toBe(5)
    expect(set.has('JJ')).toBe(true)
    expect(set.has('76s')).toBe(true)
  })
})
