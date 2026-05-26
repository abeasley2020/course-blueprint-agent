import { useState } from 'react'
import Header from './components/Header.jsx'
import BriefForm from './components/BriefForm.jsx'
import BlueprintOutput from './components/BlueprintOutput.jsx'
import { generateBlueprint } from './lib/api.js'
import './App.css'

export default function App() {
  const [brief, setBrief] = useState('')
  const [courseName, setCourseName] = useState('')
  const [audience, setAudience] = useState('')
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setBlueprint(null)
    try {
      const text = await generateBlueprint({ brief, courseName, audience })
      setBlueprint(text)
    } catch (err) {
      console.log('[Blueprint] Fetch error:', { name: err.name, message: err.message, error: err })
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" className="workspace" tabIndex={-1}>
        <BriefForm
          courseName={courseName}
          audience={audience}
          brief={brief}
          loading={loading}
          onCourseNameChange={setCourseName}
          onAudienceChange={setAudience}
          onBriefChange={setBrief}
          onSubmit={handleGenerate}
        />
        <BlueprintOutput
          blueprint={blueprint}
          loading={loading}
          error={error}
          courseName={courseName}
          onDismissError={() => setError(null)}
        />
      </main>
    </div>
  )
}
