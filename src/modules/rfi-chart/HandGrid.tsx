import { GRID_CELLS, handInfo, FOLD_TIER } from '../../shared/range/range'
import { RANGES, FOLD_COLOR } from '../../shared/range/ranges'

export default function HandGrid() {
  return (
    <div
      className="@container grid aspect-square gap-px rounded-md"
      style={{
        width: 'min(100cqw, 100cqh)',
        gridTemplateColumns: 'repeat(13, 1fr)',
        gridTemplateRows: 'repeat(13, 1fr)',
      }}
    >
      {GRID_CELLS.map((cls) => {
        const info = handInfo(cls)
        return (
          <div
            key={cls}
            className="flex items-center justify-center text-[3cqw] font-semibold text-white/95"
            style={{ background: info.tier === FOLD_TIER ? FOLD_COLOR : RANGES[info.tier]!.color }}
          >
            {cls}
          </div>
        )
      })}
    </div>
  )
}
