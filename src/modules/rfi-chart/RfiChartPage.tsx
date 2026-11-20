import { useLayoutEffect, useRef, useState } from 'react'
import PageHeader from '../../shared/ui/PageHeader'
import HandGrid from './HandGrid'
import { RANGES, FOLD_COLOR } from '../../shared/range/ranges'

function NotationToggle({ plain, onChange }: { plain: boolean; onChange: (plain: boolean) => void }) {
  return (
    <div className="relative flex rounded-full bg-slate-200/80 p-0.5" role="group" aria-label="Cell label style">
      <span
        className="absolute bottom-0.5 left-0.5 top-0.5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ width: 'calc(50% - 2px)', transform: plain ? 'translateX(100%)' : 'translateX(0)' }}
      />
      {(['AKs', 'KA'] as const).map((label, i) => {
        const active = plain === (i === 1)
        return (
          <button
            key={label}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(i === 1)}
            className={`relative z-10 w-11 rounded-full py-1 text-sm font-medium transition-colors ${
              active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

const NOTATION_KEY = 'rfi-notation-v1'

export default function RfiChartPage() {
  const [plain, setPlain] = useState(() => localStorage.getItem(NOTATION_KEY) !== 'classic')
  const toggle = (v: boolean) => {
    setPlain(v)
    localStorage.setItem(NOTATION_KEY, v ? 'plain' : 'classic')
  }

  const legendRef = useRef<HTMLDivElement>(null)
  const [legendHeight, setLegendHeight] = useState(0)
  useLayoutEffect(() => {
    const el = legendRef.current!
    const ro = new ResizeObserver(() => setLegendHeight(el.offsetHeight))
    ro.observe(el)
    setLegendHeight(el.offsetHeight)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="RFI Chart" right={<NotationToggle plain={plain} onChange={toggle} />} />
      <div className="[container-type:size] flex min-h-0 flex-1 items-center justify-center px-3 py-3">
        <div className="flex max-w-full flex-col items-center">
          <HandGrid plain={plain} reserve={legendHeight} />
          <br/>
          <div
            ref={legendRef}
            className="flex flex-wrap justify-center gap-x-6 gap-y-2.5 px-2 pt-4 pb-4 text-sm text-slate-600"
          >
            {RANGES.map((r) => (
              <span key={r.id} className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-[4px]" style={{ background: r.color }} />
                {r.id} {r.cutoff}%
              </span>
            ))}
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-[4px]" style={{ background: FOLD_COLOR }} />
              Fold
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
