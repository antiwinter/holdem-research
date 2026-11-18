import { RANK_CH, type HandClass } from '../../shared/cards/cards'
import { handInfo } from '../../shared/range/range'
import { gradientColor, STEPPED_COLORS, type ColorMode } from '../../shared/range/colors'

const CELLS: HandClass[] = []
for (let row = 0; row < 13; row++)
  for (let col = 0; col < 13; col++) {
    const r1 = RANK_CH[12 - row]!
    const r2 = RANK_CH[12 - col]!
    if (row === col) CELLS.push(r1 + r2)
    else if (col > row) CELLS.push(r1 + r2 + 's')
    else CELLS.push(r2 + r1 + 'o')
  }

export default function HandGrid({ mode }: { mode: ColorMode }) {
  return (
    <div
      className="@container grid aspect-square gap-px rounded-md"
      style={{
        width: 'min(100cqw, 100cqh)',
        gridTemplateColumns: 'repeat(13, 1fr)',
        gridTemplateRows: 'repeat(13, 1fr)',
      }}
    >
      {CELLS.map((cls) => {
        const info = handInfo(cls)
        return (
          <div
            key={cls}
            className="flex items-center justify-center text-[3cqw] font-semibold text-white/95"
            style={{ background: mode === 'gradient' ? gradientColor(info.percentile) : STEPPED_COLORS[info.tier] }}
          >
            {cls}
          </div>
        )
      })}
    </div>
  )
}
