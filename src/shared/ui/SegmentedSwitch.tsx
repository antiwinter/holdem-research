export default function SegmentedSwitch<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  const idx = Math.max(options.findIndex((o) => o.value === value), 0)
  return (
    <div className="relative flex rounded-full bg-slate-800 p-1 text-sm">
      <div
        className="absolute inset-y-1 rounded-full bg-slate-600 transition-transform duration-200"
        style={{
          left: 2,
          width: `calc(${100 / options.length}% - ${4 / options.length}px)`,
          transform: `translateX(${idx * 100}%)`,
        }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          className={`relative z-10 flex-1 py-1.5 text-center font-medium ${
            o.value === value ? 'text-white' : 'text-slate-400'
          }`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
