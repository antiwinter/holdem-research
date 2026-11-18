import { describe, it, expect } from 'vitest'
import { parseCards, cardStr, handClass, classCombos, randomCombo, makeCard, rankOf, suitOf } from './cards'

const c = (rankCh: string, suitCh: string) => {
  const [pair] = parseCards(rankCh.toLowerCase() + suitCh)
  return pair!
}

describe('parseCards', () => {
  it('parses plain rank+suit pairs', () => {
    expect(parseCards('as8d7c').map(cardStr)).toEqual(['As', '8d', '7c'])
  })

  it('parses rank runs sharing one suit', () => {
    expect(parseCards('a5d').map(cardStr)).toEqual(['Ad', '5d'])
    expect(parseCards('38s6h').map(cardStr)).toEqual(['3s', '8s', '6h'])
  })

  it('accepts 1 as ace alias', () => {
    expect(parseCards('1s')).toEqual(parseCards('as'))
  })

  it('rejects invalid input', () => {
    expect(() => parseCards('ax')).toThrow(/invalid character/)
    expect(() => parseCards('d')).toThrow(/no preceding rank/)
    expect(() => parseCards('a5')).toThrow(/missing suit/)
  })
})

describe('handClass', () => {
  it('classifies pairs, suited, offsuit', () => {
    expect(handClass(c('a', 's'), c('k', 's'))).toBe('AKs')
    expect(handClass(c('a', 's'), c('k', 'h'))).toBe('AKo')
    expect(handClass(c('k', 'd'), c('a', 'c'))).toBe('AKo')
    expect(handClass(c('8', 'c'), c('8', 'd'))).toBe('88')
  })
})

describe('classCombos', () => {
  it('weights pairs 6, suited 4, offsuit 12', () => {
    expect(classCombos('AA')).toBe(6)
    expect(classCombos('AKs')).toBe(4)
    expect(classCombos('AKo')).toBe(12)
  })
})

describe('randomCombo', () => {
  it('produces cards matching the class', () => {
    for (const cls of ['AA', 'AKs', 'AKo', '72o', '32s']) {
      for (let i = 0; i < 50; i++) {
        const [a, b] = randomCombo(cls)
        expect(handClass(a, b)).toBe(cls)
        expect(a).not.toBe(b)
      }
    }
  })
})

describe('encoding', () => {
  it('round-trips rank and suit', () => {
    const card = makeCard(12, 3)
    expect(rankOf(card)).toBe(12)
    expect(suitOf(card)).toBe(3)
  })
})
