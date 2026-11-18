import PageHeader from '../../shared/ui/PageHeader'
import HandGrid from './HandGrid'
import { RANGES, FOLD_COLOR } from '../../shared/range/ranges'

export default function RfiChartPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="RFI Chart" />
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 px-4 pb-3 text-[11px] text-slate-300">
        {RANGES.map((r) => (
          <span key={r.id} className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
            {r.id} {r.cutoff}%
          </span>
        ))}
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: FOLD_COLOR }} />
          Fold
        </span>
      </div>
      <div className="[@container:size] flex min-h-0 flex-1 items-center justify-center px-3 pb-4">
        <HandGrid />
      </div>
    </div>
  )
}
