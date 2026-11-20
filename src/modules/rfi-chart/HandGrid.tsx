import { GRID_CELLS, GRID_LABELS, handInfo, FOLD_TIER } from '../../shared/range/range'
import { RANGES, FOLD_COLOR, FOLD_TEXT_COLOR, textColorFor } from '../../shared/range/ranges'

const TEXT_COLORS = RANGES.map((r) => textColorFor(r.color))

export default function HandGrid({ plain, reserve = 0 }: { plain: boolean; reserve?: number }) {
  return (
    <div
      className="@container grid aspect-square gap-[0.45cqw] rounded-md"
      style={{
        width: `min(100cqw, calc(100cqh - ${reserve}px))`,
        gridTemplateColumns: 'repeat(13, 1fr)',
        gridTemplateRows: 'repeat(13, 1fr)',
      }}
    >
      {GRID_CELLS.map((cls, i) => {
        const info = handInfo(cls)
        const fold = info.tier === FOLD_TIER
        return (
          <div
            key={cls}
            className="flex items-center justify-center rounded-[0.9cqw] text-[2.4cqw] font-medium"
            style={{
              background: fold ? FOLD_COLOR : RANGES[info.tier]!.color,
              color: fold ? FOLD_TEXT_COLOR : TEXT_COLORS[info.tier]!,
            }}
          >
            {plain ? GRID_LABELS[i] : cls}
          </div>
        )
      })}
    </div>
  )
}
