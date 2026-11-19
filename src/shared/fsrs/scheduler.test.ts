import { describe, expect, it } from 'vitest'
import { formatInterval } from './scheduler'

const MIN = 60_000
const DAY = 86_400_000

describe('formatInterval', () => {
  it('formats across unit scales', () => {
    expect(formatInterval(3 * MIN)).toBe('3min')
    expect(formatInterval(90 * MIN)).toBe('1.5h')
    expect(formatInterval(45 * DAY)).toBe('1.5mo')
    expect(formatInterval(400 * DAY)).toBe('1.1y')
  })
})
