import { useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import { useKeys } from '../../shared/ui/useKeys'
import PlayingCard from '../../shared/cards/PlayingCard'
import { randomCombo, type Card, type HandClass } from '../../shared/cards/cards'
import { handInfo, ALL_CLASSES, FOLD_TIER } from '../../shared/range/range'
import { RANGES, TIER_THEMES, FOLD_THEME } from '../../shared/range/ranges'
import { dueIds, review, undoLast } from '../../shared/fsrs/store'
import { useCards } from '../../shared/fsrs/useFsrs'
import { applyGrade, formatInterval, type Grade } from '../../shared/fsrs/scheduler'

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
  const [history, setHistory] = useState<Round[]>([])
  const info = handInfo(round.cls)
  const fold = info.tier === FOLD_TIER
  const range = fold ? null : RANGES[info.tier]!
  const theme = fold ? FOLD_THEME : TIER_THEMES[info.tier]!
  const due = dueIds().length
  const card = useCards()[round.cls]
  const againIn = formatInterval(applyGrade(card, 'fail').due.getTime() - Date.now())
  const goodIn = formatInterval(applyGrade(card, 'pass').due.getTime() - Date.now())

  const grade = (g: Grade) => {
    setHistory((h) => [...h, round])
    review(round.cls, g)
    setRevealed(false)
    setRound(startRound(round.cls))
  }

  const undo = () => {
    if (history.length === 0) return
    undoLast()
    setRound(history[history.length - 1]!)
    setHistory((h) => h.slice(0, -1))
    setRevealed(false)
  }

  useKeys({
    ' ': () => !revealed && setRevealed(true),
    'k|arrowup': () => revealed && grade('fail'),
    'j|arrowdown': () => revealed && grade('pass'),
    'h|mod+z': undo,
  })

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="RFI Practice"
        right={
          history.length > 0 ? (
            <button
              type="button"
              onClick={undo}
              className="rounded-full bg-slate-200/80 px-4 py-1.5 text-sm font-medium text-slate-600 active:text-slate-900"
            >
              Undo
            </button>
          ) : undefined
        }
      />
      <div className="px-5 pb-1 text-sm text-slate-500">{due} due</div>
      <div className="relative flex min-h-0 flex-1">
        {revealed ? (
          <>
            <button type="button" aria-label="Again" className="flex-1" onClick={() => grade('fail')} />
            <div className="flex-1" />
            <button type="button" aria-label="Good" className="flex-1" onClick={() => grade('pass')} />
          </>
        ) : (
          <button type="button" aria-label="Reveal" className="flex-1" onClick={() => setRevealed(true)} />
        )}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
          <div className="flex w-full max-w-xs gap-4 text-7xl">
            <PlayingCard card={round.combo[0]} />
            <PlayingCard card={round.combo[1]} />
          </div>
          {revealed && (
            <span
              className="rounded-full px-5 py-2 text-xl font-semibold"
              style={{ background: theme.bg, color: theme.text }}
            >
              {fold ? 'Fold' : `${range!.id} ${range!.cutoff}%`}
            </span>
          )}
        </div>
      </div>
      {revealed && (
        <div className="px-5 pb-6">
          <div className="flex gap-3 [&>*]:flex-1">
            <button
              type="button"
              onClick={() => grade('fail')}
              className="rounded-full bg-red-100 py-4 font-medium text-red-700"
            >
              Again <span className="font-normal opacity-70">{againIn}</span>
            </button>
            <button
              type="button"
              onClick={() => grade('pass')}
              className="rounded-full bg-emerald-100 py-4 font-medium text-emerald-700"
            >
              Good <span className="font-normal opacity-70">{goodIn}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
