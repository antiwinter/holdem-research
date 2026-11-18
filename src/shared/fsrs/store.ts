import { applyGrade, isDue, type Grade } from './scheduler'
import type { Card } from 'ts-fsrs'

const KEY = 'fsrs-cards-v1'

function revive(c: Card): Card {
  return { ...c, due: new Date(c.due), last_review: c.last_review ? new Date(c.last_review) : undefined }
}

function load(): Record<string, Card> {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const data = JSON.parse(raw) as Record<string, Card>
    return Object.fromEntries(Object.entries(data).map(([id, c]) => [id, revive(c)]))
  } catch {
    return {}
  }
}

let cards: Record<string, Card> = load()
const listeners = new Set<() => void>()

export function getCards(): Readonly<Record<string, Card>> {
  return cards
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function review(id: string, grade: Grade): void {
  cards = { ...cards, [id]: applyGrade(cards[id], grade) }
  localStorage.setItem(KEY, JSON.stringify(cards))
  listeners.forEach((l) => l())
}

export function dueIds(now = new Date()): string[] {
  return Object.entries(cards)
    .filter(([, c]) => isDue(c, now))
    .sort((a, b) => a[1].due.getTime() - b[1].due.getTime())
    .map(([id]) => id)
}
