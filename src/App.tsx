import { Routes, Route, useLocation, useNavigate } from 'react-router'
import HomePage from './modules/home/HomePage'
import RfiChartPage from './modules/rfi-chart/RfiChartPage'
import RfiPracticePage from './modules/rfi-practice/RfiPracticePage'
import EquityPracticePage from './modules/equity-practice/EquityPracticePage'
import { useKeys } from './shared/ui/useKeys'

export default function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useKeys({ escape: () => pathname !== '/' && navigate('/') })

  return (
    <div className="safe-area mx-auto flex h-dvh w-full max-w-[900px] flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rfi-chart" element={<RfiChartPage />} />
        <Route path="/rfi-practice" element={<RfiPracticePage />} />
        <Route path="/equity-practice" element={<EquityPracticePage />} />
      </Routes>
    </div>
  )
}
