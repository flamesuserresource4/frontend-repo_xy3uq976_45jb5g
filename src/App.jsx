import { useEffect, useState } from 'react'
import AppHeader from './components/AppHeader'
import DashboardSummary from './components/DashboardSummary'
import ProjectManager from './components/ProjectManager'
import TestCaseManager from './components/TestCaseManager'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [plan, setPlan] = useState('free')
  const [summary, setSummary] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  const fetchPlan = async () => {
    try {
      const res = await fetch(`${baseUrl}/plan`)
      const data = await res.json()
      setPlan(data.plan)
    } catch {}
  }

  const fetchSummary = async () => {
    try {
      const res = await fetch(`${baseUrl}/dashboard`)
      const data = await res.json()
      setSummary(data)
    } catch {}
  }

  useEffect(() => {
    fetchPlan()
    fetchSummary()
    const i = setInterval(fetchSummary, 3000)
    return () => clearInterval(i)
  }, [])

  const handleUpgrade = async () => {
    await fetch(`${baseUrl}/plan/upgrade`, { method: 'POST' })
    fetchPlan()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <AppHeader plan={plan} onUpgrade={handleUpgrade} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <DashboardSummary summary={summary} />

        <ProjectManager
          onSelect={setSelectedProject}
          selectedId={selectedProject}
          plan={plan}
          onNeedUpgrade={() => {}}
        />

        <TestCaseManager projectId={selectedProject} />
      </main>

      <footer className="text-center text-xs text-neutral-500 py-6">
        Inspired by Fadlian QA portfolio • Dark, focused, and professional
      </footer>
    </div>
  )
}

export default App
