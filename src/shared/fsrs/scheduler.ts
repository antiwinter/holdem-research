import { createEmptyCard, fsrs, Rating, type Card } from 'ts-fsrs'

export type Grade = 'pass' | 'fail'

const scheduler = fsrs()

export function isDue(card: Card, now = new Date()): boolean {
  return card.due <= now
}

export type Maturity = 'unlearned' | 'young' | 'mature'

const MATURE_DAYS = 21 // Anki's mature threshold

export function maturity(card: Card | undefined): Maturity {
  if (!card) return 'unlearned'
  return card.scheduled_days >= MATURE_DAYS ? 'mature' : 'young'
}

export function applyGrade(card: Card | undefined, grade: Grade, now = new Date()): Card {
  const c: Card = card ?? createEmptyCard(now)
  const rating = grade === 'pass' ? Rating.Good : Rating.Again
  return scheduler.next(c, now, rating).card
}

const MIN = 60_000
const HOUR = 60 * MIN
const DAY = 24 * HOUR
const MONTH = 30 * DAY
const YEAR = 365 * DAY

function q(n: number): string {
  return String(Math.round(n * 10) / 10)
}

export function formatInterval(ms: number): string {
  if (ms < HOUR) return `${Math.max(1, Math.round(ms / MIN))}min`
  if (ms < DAY) return `${q(ms / HOUR)}h`
  if (ms < MONTH) return `${q(ms / DAY)}d`
  if (ms < YEAR) return `${q(ms / MONTH)}mo`
  return `${q(ms / YEAR)}y`
}
