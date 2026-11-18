export type ColorMode = 'gradient' | 'stepped'

// tier index (UTG=0 .. SB=3, BTN=4, fold=5) -> fixed color
export const STEPPED_COLORS: readonly string[] = [
  '#7c3aed', // UTG violet
  '#2563eb', // MP blue
  '#0d9488', // CO teal
  '#65a30d', // SB olive
  '#d97706', // BTN amber
  '#52525b', // fold
]

export function gradientColor(percentile: number): string {
  const hue = 140 * (1 - Math.min(Math.max(percentile, 0), 100) / 100)
  return `hsl(${hue.toFixed(1)}, 65%, 48%)`
}
