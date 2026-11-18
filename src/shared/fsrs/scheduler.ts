import { createEmptyCard, fsrs, Rating, type Card } from 'ts-fsrs'

export type Grade = 'pass' | 'fail'

const scheduler = fsrs()

export function isDue(card: Card, now = new Date()): boolean {
  return card.due <= now
}

export function applyGrade(card: Card | undefined, grade: Grade, now = new Date()): Card {
  const c: Card = card ?? createEmptyCard(now)
  const rating = grade === 'pass' ? Rating.Good : Rating.Again
  return scheduler.next(c, now, rating).card
}
