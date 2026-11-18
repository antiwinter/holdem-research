import { useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import SegmentedSwitch from '../../shared/ui/SegmentedSwitch'
import HandGrid from './HandGrid'
import { POSITIONS } from '../../shared/range/ranking'
import { FOLD_TIER } from '../../shared/range/range'
import { STEPPED_COLORS, type ColorMode } from '../../shared/range/colors'

const MODE_KEY = 'rfi-chart:mode'

export default function RfiChartPage() {
  const [mode, setMode] = useState<ColorMode>(() =>
    localStorage.getItem(MODE_KEY) === 'stepped' ? 'stepped' : 'gradient',
  )
  const switchMode = (m: ColorMode) => {
    setMode(m)
    localStorage.setItem(MODE_KEY, m)
  }

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="RFI Chart" />
      <div className="px-4 pb-3">
        <SegmentedSwitch
          options={[
            { value: 'gradient', label: 'Gradient' },
            { value: 'stepped', label: 'By Position' },
          ]}
          value={mode}
          onChange={switchMode}
        />
        {mode === 'stepped' && (
          <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-300">
            {POSITIONS.map((p, i) => (
              <span key={p.id} className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STEPPED_COLORS[i] }} />
                {p.id} {p.cutoff}%
              </span>
            ))}
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: STEPPED_COLORS[FOLD_TIER] }} />
              Fold
            </span>
          </div>
        )}
      </div>
      <div className="[@container:size] flex min-h-0 flex-1 items-center justify-center px-3 pb-4">
        <HandGrid mode={mode} />
      </div>
    </div>
  )
}
