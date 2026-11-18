import { useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import PlayingCard from '../../shared/cards/PlayingCard'
import { randomCombo, type Card, type HandClass } from '../../shared/cards/cards'
import { handInfo, positionsFor, ALL_CLASSES } from '../../shared/range/range'
import { POSITIONS } from '../../shared/range/ranking'
import { STEPPED_COLORS } from '../../shared/range/colors'
import { dueIds, review } from '../../shared/fsrs/store'
import type { Grade } from '../../shared/fsrs/scheduler'

interface Round {
  cls: HandClass
  combo: [Card, Card]
}

function pickClass(prev: HandClass | null): HandClass {
  const due = dueIds().filter((id) => id !== prev)
  if (due.length > 0) return due[0]!
  const pool = ALL_CLASSES.filter((c) => c !== prev)
  return pool[Math.floor(Math.random() * pool.length)]!
}

function startRound(prev: HandClass | null): Round {
  const cls = pickClass(prev)
  return { cls, combo: randomCombo(cls) }
}

export default function RfiPracticePage() {
  const [round, setRound] = useState<Round>(() => startRound(null))
  const [revealed, setRevealed] = useState(false)
  const info = handInfo(round.cls)
  const opened = positionsFor(round.cls)
  const due = dueIds().length

  const grade = (g: Grade) => {
    review(round.cls, g)
    setRevealed(false)
    setRound(startRound(round.cls))
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="RFI Practice" />
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-8 px-6"
      >
        <div className="flex w-full max-w-xs gap-4 text-7xl">
          <PlayingCard card={round.combo[0]} />
          <PlayingCard card={round.combo[1]} />
        </div>
        {revealed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="text-4xl font-bold tracking-tight">
              {round.cls} <span className="text-slate-400">·</span> {info.percentile.toFixed(1)}%
            </div>
            <div className="flex gap-1.5">
              {POSITIONS.map((p, i) => {
                const on = opened.includes(p.id)
                return (
                  <span
                    key={p.id}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      on ? 'text-white' : 'bg-slate-800 text-slate-500'
                    }`}
                    style={on ? { background: STEPPED_COLORS[i] } : undefined}
                  >
                    {p.id}
                  </span>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">tap to reveal</div>
        )}
      </button>
      <div className="px-5 pb-6">
        <div className="pb-3 text-center text-xs text-slate-500">{due} due</div>
        <div className="flex gap-3 [&>*]:flex-1">
          <button
            type="button"
            disabled={!revealed}
            onClick={() => grade('fail')}
            className="rounded-2xl bg-red-600 py-4 font-semibold text-white disabled:opacity-30"
          >
            Fail
          </button>
          <button
            type="button"
            disabled={!revealed}
            onClick={() => grade('pass')}
            className="rounded-2xl bg-emerald-600 py-4 font-semibold text-white disabled:opacity-30"
          >
            Pass
          </button>
        </div>
      </div>
    </div>
  )
}
