import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import BriefForm from './components/BriefForm.jsx'
import BlueprintOutput from './components/BlueprintOutput.jsx'
import { generateBlueprint } from './lib/api.js'
import { readIntakeFromHash, clearIntakeHash } from './lib/hashIntake.js'
import './App.css'

// Read once at module load — handoff payload from the Course Intake Agent,
// if present in the URL fragment. Module-level so both useState initializers
// see the same object without re-parsing.
const handoff = readIntakeFromHash()

export default function App() {
  const [brief, setBrief] = useState(handoff?.brief ?? '')
  const [courseName, setCourseName] = useState(handoff?.courseName ?? '')
  const [audience, setAudience] = useState(handoff?.audience ?? '')
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Strip the fragment after the first paint so refreshing doesn't re-seed
  // over user edits. The seed has already been applied via useState above.
  useEffect(() => {
    if (handoff) clearIntakeHash()
  }, [])

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
