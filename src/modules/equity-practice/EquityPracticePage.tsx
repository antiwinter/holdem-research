import PageHeader from '../../shared/ui/PageHeader'

export default function EquityPracticePage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader title="Equity Practice" />
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="rounded-2xl border border-dashed border-slate-300 px-8 py-10 text-center text-slate-500">
          <div className="text-lg font-semibold text-slate-700">Coming soon</div>
          <div className="mt-1 text-sm">Equity vs random hand drills, powered by the evaluator in ref/cli</div>
        </div>
      </div>
    </div>
  )
}
