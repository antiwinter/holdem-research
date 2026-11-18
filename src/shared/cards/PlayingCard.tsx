import { rankOf, suitOf, RANK_CH, SUIT_GLYPH, type Card } from './cards'

export default function PlayingCard({ card, className = '' }: { card: Card; className?: string }) {
  const s = suitOf(card)
  const red = s === 0 || s === 3 // ♦ ♥
  return (
    <div
      className={`playing-card flex aspect-[5/7] w-full select-none items-center justify-center rounded-2xl bg-white shadow-xl ${
        red ? 'text-red-600' : 'text-neutral-900'
      } ${className}`}
    >
      <span className="rank">{RANK_CH[rankOf(card)]}</span>
      <span className="suit">{SUIT_GLYPH[s]}</span>
    </div>
  )
}
