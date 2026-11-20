import { GRID_CELLS, GRID_LABELS } from '../../shared/range/range'
import type { CellTheme } from '../../shared/range/ranges'
import type { HandClass } from '../../shared/cards/cards'

export default function HandGrid({
  plain,
  reserve = 0,
  themeFor,
}: {
  plain: boolean
  reserve?: number
  themeFor: (cls: HandClass) => CellTheme
}) {
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
        const theme = themeFor(cls)
        return (
          <div
            key={cls}
            className="flex items-center justify-center rounded-[0.9cqw] text-[2.4cqw] font-medium"
            style={{ background: theme.bg, color: theme.text }}
          >
            {plain ? GRID_LABELS[i] : cls}
          </div>
        )
      })}
    </div>
  )
}
