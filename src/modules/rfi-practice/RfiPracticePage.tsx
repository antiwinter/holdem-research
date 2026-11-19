import { useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import PlayingCard from '../../shared/cards/PlayingCard'
import { randomCombo, type Card, type HandClass } from '../../shared/cards/cards'
import { handInfo, ALL_CLASSES, FOLD_TIER } from '../../shared/range/range'
import { RANGES, FOLD_COLOR, FOLD_TEXT_COLOR, textColorFor } from '../../shared/range/ranges'
import { dueIds, review } from '../../shared/fsrs/store'
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
  const info = handInfo(round.cls)
  const fold = info.tier === FOLD_TIER
  const range = fold ? null : RANGES[info.tier]!
  const due = dueIds().length
  const card = useCards()[round.cls]
  const againIn = formatInterval(applyGrade(card, 'fail').due.getTime() - Date.now())
  const goodIn = formatInterval(applyGrade(card, 'pass').due.getTime() - Date.now())

  const grade = (g: Grade) => {
    review(round.cls, g)
    setRevealed(false)
    setRound(startRound(round.cls))
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="RFI Practice" />
      <div className="px-5 pb-1 text-sm text-slate-500">{due} due</div>
      <div className="relative flex min-h-0 flex-1">
        <button
          type="button"
          className="flex-1"
          onClick={() => (revealed ? grade('fail') : setRevealed(true))}
        />
        <button
          type="button"
          className="flex-1"
          onClick={() => (revealed ? grade('pass') : setRevealed(true))}
        />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-8 px-6">
          <div className="flex w-full max-w-xs gap-4 text-7xl">
            <PlayingCard card={round.combo[0]} />
            <PlayingCard card={round.combo[1]} />
          </div>
          {revealed && (
            <span
              className="rounded-full px-5 py-2 text-xl font-semibold"
              style={
                fold
                  ? { background: FOLD_COLOR, color: FOLD_TEXT_COLOR }
                  : { background: range!.color, color: textColorFor(range!.color) }
              }
            >
              {fold ? 'Fold' : `${range!.id} ${range!.cutoff}%`}
            </span>
          )}
        </div>
      </div>
      <div className="px-5 pb-6">
        <div className="flex gap-3 [&>*]:flex-1">
          <button
            type="button"
            disabled={!revealed}
            onClick={() => grade('fail')}
            className="rounded-full bg-red-100 py-4 font-medium text-red-700 disabled:opacity-30"
          >
            Again <span className="font-normal opacity-70">{againIn}</span>
          </button>
          <button
            type="button"
            disabled={!revealed}
            onClick={() => grade('pass')}
            className="rounded-full bg-emerald-100 py-4 font-medium text-emerald-700 disabled:opacity-30"
          >
            Good <span className="font-normal opacity-70">{goodIn}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
