import PageHeader from '../../shared/ui/PageHeader'
import HandGrid from './HandGrid'
import { RANGES, FOLD_COLOR } from '../../shared/range/ranges'

export default function RfiChartPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="RFI Chart" />
      <div className="[@container:size] flex min-h-0 flex-1 items-center justify-center px-3 pt-1">
        <HandGrid />
      </div>
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 px-4 pt-10 pb-6 text-sm text-slate-600">
        {RANGES.map((r) => (
          <span key={r.id} className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-[4px]" style={{ background: r.color }} />
            {r.id} {r.cutoff}%
          </span>
        ))}
        <span className="flex items-center gap-2">
          <span className="h-5 w-5 rounded-[4px]" style={{ background: FOLD_COLOR }} />
          Fold
        </span>
      </div>
    </div>
  )
}
