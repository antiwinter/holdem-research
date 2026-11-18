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
      <p className="mt-1 pb-8 text-sm text-slate-500">Preflop study drills · {seen}/169 seen</p>
      <nav className="flex flex-col gap-3">
        <Link
          to="/rfi-chart"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 active:bg-slate-100"
        >
          <div className="font-semibold">RFI Chart</div>
          <div className="text-sm text-slate-500">13×13 preflop ranges: 3bet &amp; RFI by position</div>
        </Link>
        <Link
          to="/rfi-practice"
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 active:bg-slate-100"
        >
          <div>
            <div className="font-semibold">RFI Practice</div>
            <div className="text-sm text-slate-500">Drill range membership for every hand</div>
          </div>
          {due > 0 && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {due} due
            </span>
          )}
        </Link>
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 opacity-60">
          <div>
            <div className="font-semibold">Equity Practice</div>
            <div className="text-sm text-slate-500">Equity vs random hand</div>
          </div>
          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs text-slate-500">soon</span>
        </div>
      </nav>
    </div>
  )
}
