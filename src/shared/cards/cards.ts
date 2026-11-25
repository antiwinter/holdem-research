// card encoding: rank*4 + suit; rank 0..12 = 2..A, suit 0..3 = d s c h
export const RANK_CH = '23456789TJQKA'
export const SUIT_CH = 'dsch'
export const SUIT_GLYPH = ['♦', '♠', '♣', '♥']

const RANK_IDX: Record<string, number> = { 2: 0, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, t: 8, j: 9, q: 10, k: 11, a: 12, 1: 12 }
const SUIT_IDX: Record<string, number> = { d: 0, s: 1, c: 2, h: 3 }

export type Card = number
export const rankOf = (c: Card) => c >> 2
export const suitOf = (c: Card) => c & 3
export const makeCard = (rank: number, suit: number): Card => rank * 4 + suit

// Parses rank runs sharing one suit char: "a5d" = Ad 5d, "38s6h" = 3s 8s 6h.
export function parseCards(str: string, label = 'cards'): Card[] {
  const cards: Card[] = []
  let ranks: number[] = []
  for (const ch of str.toLowerCase()) {
    const r = RANK_IDX[ch]
    if (r !== undefined) {
      ranks.push(r)
      continue
    }
    const s = SUIT_IDX[ch]
    if (s === undefined) throw new Error(`${label} "${str}": invalid character "${ch}"`)
    if (ranks.length === 0) throw new Error(`${label} "${str}": suit "${ch}" with no preceding rank`)
    for (const rr of ranks) cards.push(makeCard(rr, s))
    ranks = []
  }
  if (ranks.length > 0) throw new Error(`${label} "${str}": missing suit after rank(s)`)
  return cards
}

export const cardStr = (c: Card) => RANK_CH[rankOf(c)]! + SUIT_CH[suitOf(c)]

// 'AA' | 'AKs' | 'AKo' — rank chars descending
export type HandClass = string

export function handClass(a: Card, b: Card): HandClass {
  const [hi, lo] = rankOf(a) >= rankOf(b) ? [a, b] : [b, a]
  const hiR = RANK_CH[rankOf(hi)]!
  const loR = RANK_CH[rankOf(lo)]!
  if (rankOf(hi) === rankOf(lo)) return hiR + loR
  return hiR + loR + (suitOf(a) === suitOf(b) ? 's' : 'o')
}

export function classCombos(cls: HandClass): number {
  if (cls.length === 2) return 6
  return cls[2] === 's' ? 4 : 12
}

export function randomCombo(cls: HandClass): [Card, Card] {
  const hi = RANK_IDX[cls[0]!.toLowerCase()]!
  const lo = RANK_IDX[cls[1]!.toLowerCase()]!
  const randSuit = () => (Math.random() * 4) | 0
  const s1 = randSuit()
  let s2 = s1
  if (cls[2] !== 's') while (s2 === s1) s2 = randSuit()
  const hiCard = makeCard(hi, s1)
  const loCard = makeCard(lo, s2)
  return Math.random() < 0.5 ? [hiCard, loCard] : [loCard, hiCard]
}
