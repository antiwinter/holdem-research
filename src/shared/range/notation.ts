import { RANK_CH, type HandClass } from '../cards/cards'

const rankIdx = (ch: string) => {
  const i = RANK_CH.indexOf(ch.toUpperCase())
  if (i < 0) throw new Error(`invalid rank "${ch}"`)
  return i
}

const cls = (hi: number, lo: number, suited: boolean | null): HandClass =>
  suited === null ? RANK_CH[hi]! + RANK_CH[hi]! : RANK_CH[hi]! + RANK_CH[lo]! + (suited ? 's' : 'o')

const TOKEN = /^([2-9TJQKA])([2-9TJQKA])(s|o)?(\+|-([2-9TJQKA])([2-9TJQKA])(s|o)?)?$/

// 'AA' | '22+' | 'ATs+' | 'A5s-A2s' | '77-22'
export function expandToken(token: string): HandClass[] {
  const m = TOKEN.exec(token)
  if (!m) throw new Error(`invalid hand token "${token}"`)
  const [, hiCh, loCh, s1, tail, eHiCh, eLoCh, s2] = m
  const hi = rankIdx(hiCh!)
  const lo = rankIdx(loCh!)
  const suited = s1 === undefined ? null : s1 === 's'

  if (suited === null ? hi !== lo : hi <= lo) throw new Error(`invalid hand "${token}"`)
  if (s2 !== undefined && s2 !== s1) throw new Error(`suit mismatch in "${token}"`)

  if (tail === '+') {
    const top = suited === null ? 12 : hi - 1
    const out: HandClass[] = []
    for (let l = lo; l <= top; l++) out.push(suited === null ? cls(l, l, null) : cls(hi, l, suited))
    return out
  }
  if (tail !== undefined) {
    const eHi = rankIdx(eHiCh!)
    const eLo = rankIdx(eLoCh!)
    if (suited === null) {
      const [a, b] = eHi < hi ? [eHi, hi] : [hi, eHi]
      if (a === b) throw new Error(`invalid pair range "${token}"`)
      const out: HandClass[] = []
      for (let r = a; r <= b; r++) out.push(cls(r, r, null))
      return out
    }
    if (eHi !== hi) throw new Error(`high card must match in "${token}"`)
    const [a, b] = eLo < lo ? [eLo, lo] : [lo, eLo]
    const out: HandClass[] = []
    for (let l = a; l <= b; l++) out.push(cls(hi, l, suited))
    return out
  }
  return [cls(hi, lo, suited)]
}

export function parseRange(tokens: readonly string[]): ReadonlySet<HandClass> {
  const set = new Set<HandClass>()
  for (const t of tokens) for (const c of expandToken(t)) set.add(c)
  return set
}
