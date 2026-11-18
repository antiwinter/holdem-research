import { Link } from 'react-router'

export default function PageHeader({ title }: { title: string }) {
  return (
    <header className="flex items-center gap-1 px-3 pb-2 pt-3">
      <Link to="/" aria-label="Home" className="-ml-1 rounded-full px-3 py-2 text-xl leading-none text-slate-400 active:text-slate-900">
        ←
      </Link>
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  )
}
