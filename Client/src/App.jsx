import { useState } from 'react'
import AppHeader from './components/AppHeader'
import AppNavigation from './components/AppNavigation'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import TopStudents from './pages/TopStudents'

function App() {
  const [activeTab, setActiveTab] = useState('search')

  return (
    <main className="min-h-screen bg-[#0b1120] text-slate-50">
      <div className="min-h-screen bg-[linear-gradient(180deg,#1e3a8a_0,#172554_292px,#0b1120_292px)]">
        <AppHeader />
        <AppNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <section className="mx-auto mt-[18px] mb-12 w-[min(1100px,calc(100%-32px))]">
          {activeTab === 'search' && <Home />}
          {activeTab === 'chart' && <Dashboard />}
          {activeTab === 'top' && <TopStudents />}
        </section>
      </div>
    </main>
  )
}

export default App
