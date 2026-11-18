import { Link } from 'react-router'
import { useCards } from '../../shared/fsrs/useFsrs'
import { dueIds } from '../../shared/fsrs/store'

export default function HomePage() {
  const cards = useCards()
  const due = dueIds().length
  const seen = Object.keys(cards).length

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 pt-14">
      <h1 className="text-3xl font-bold tracking-tight">Holdem Research</h1>
      <p className="mt-1 pb-8 text-sm text-slate-400">Preflop study drills · {seen}/169 seen</p>
      <nav className="flex flex-col gap-3">
        <Link
          to="/rfi-chart"
          className="rounded-2xl border border-slate-800 bg-slate-800/40 px-5 py-4 active:bg-slate-700/60"
        >
          <div className="font-semibold">RFI Chart</div>
          <div className="text-sm text-slate-400">13×13 open-raise ranges by position</div>
        </Link>
        <Link
          to="/rfi-practice"
          className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/40 px-5 py-4 active:bg-slate-700/60"
        >
          <div>
            <div className="font-semibold">RFI Practice</div>
            <div className="text-sm text-slate-400">Drill range numbers for every hand</div>
          </div>
          {due > 0 && (
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-medium text-emerald-300">
              {due} due
            </span>
          )}
        </Link>
        <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/40 px-5 py-4 opacity-50">
          <div>
            <div className="font-semibold">Equity Practice</div>
            <div className="text-sm text-slate-400">Equity vs random hand</div>
          </div>
          <span className="rounded-full bg-slate-700 px-2.5 py-1 text-xs">soon</span>
        </div>
      </nav>
    </div>
  )
}
