import { useState, useRef } from 'react'
import './App.css'

const PROXY_URL = 'https://anthropic-proxyandrebeasley2012workersdev.andrebeasley2012.workers.dev'
const MODEL = 'claude-sonnet-4-20250514'

const SYSTEM_PROMPT = `You are an expert instructional designer specializing in backward design. Given an ID brief from a faculty SME interview, generate a complete course blueprint with these sections: 1) Course Overview (title, audience, delivery format, estimated duration), 2) Course Outcomes mapped to Bloom's Taxonomy levels, 3) Module Sequence (recommended modules, each with title, learning objectives, suggested activity types, estimated seat time), 4) Assessment Strategy (formative and summative aligned to course outcomes), 5) Design Notes and Flags (gaps, risks, SME assumptions the ID team should watch for). Format in clean markdown with clear section headers.`

// ── Simple markdown → React elements ─────────────────────
function renderInline(text, key) {
  // Handle **bold** and *italic* inline patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)
  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i}>{part.slice(1, -1)}</em>
        if (part.startsWith('`') && part.endsWith('`'))
          return <code key={i}>{part.slice(1, -1)}</code>
        return part
      })}
    </span>
  )
}

function parseTableRow(line) {
  return line.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
}

function isTableSeparator(line) {
  return /^\|?[\s|:-]+\|$/.test(line.trim()) && line.includes('-')
}

function renderTable(headerLine, bodyLines, key) {
  const headers = parseTableRow(headerLine)
  const thStyle = {
    background: '#CFB991',
    color: '#0D0D0D',
    fontWeight: 'bold',
    padding: '10px 12px',
    textAlign: 'left',
    border: '1px solid #B8A47A',
  }
  const tdStyle = {
    padding: '10px 12px',
    border: '1px solid #D6C9A8',
    verticalAlign: 'top',
  }
  return (
    <table key={key} style={{ width: '100%', borderCollapse: 'collapse', margin: '16px 0' }}>
      <thead>
        <tr>{headers.map((h, i) => <th key={i} style={thStyle}>{renderInline(h === 'Outcome' ? 'Course Outcome' : h, i)}</th>)}</tr>
      </thead>
      <tbody>
        {bodyLines.map((row, ri) => {
          const cells = parseTableRow(row)
          const rowBg = ri % 2 === 0 ? '#F7F6F3' : '#FFFFFF'
          return (
            <tr key={ri}>
              {cells.map((cell, ci) => (
                <td key={ci} style={{ ...tdStyle, background: rowBg }}>{renderInline(cell, ci)}</td>
              ))}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function renderMarkdown(text) {
  const lines = text.split('\n')
  const elements = []
  let ulItems = []
  let olItems = []
  let k = 0

  const flushUl = () => {
    if (ulItems.length) {
      elements.push(<ul key={k++}>{ulItems}</ul>)
      ulItems = []
    }
  }
  const flushOl = () => {
    if (olItems.length) {
      elements.push(<ol key={k++}>{olItems}</ol>)
      olItems = []
    }
  }
  const flushLists = () => { flushUl(); flushOl() }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Markdown table — detect header row followed by separator
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushLists()
      const headerLine = line
      const bodyLines = []
      i += 2 // skip header and separator
      while (i < lines.length && lines[i].includes('|')) {
        bodyLines.push(lines[i])
        i++
      }
      i-- // outer loop will increment
      elements.push(renderTable(headerLine, bodyLines, k++))
      continue
    }

    // Horizontal rule
    if (/^[-*]{3,}$/.test(line.trim())) {
      flushLists()
      elements.push(<hr key={k++} />)
      continue
    }

    // Headings
    if (line.startsWith('#### ')) {
      flushLists()
      elements.push(<h4 key={k++}>{renderInline(line.slice(5), k)}</h4>)
      continue
    }
    if (line.startsWith('### ')) {
      flushLists()
      elements.push(<h3 key={k++}>{renderInline(line.slice(4), k)}</h3>)
      continue
    }
    if (line.startsWith('## ')) {
      flushLists()
      elements.push(<h2 key={k++}>{renderInline(line.slice(3), k)}</h2>)
      continue
    }
    if (line.startsWith('# ')) {
      flushLists()
      elements.push(<h1 key={k++}>{renderInline(line.slice(2), k)}</h1>)
      continue
    }

    // Unordered list item
    if (/^[-*•] /.test(line)) {
      flushOl()
      ulItems.push(<li key={k++}>{renderInline(line.slice(2), k)}</li>)
      continue
    }

    // Ordered list item
    if (/^\d+\. /.test(line)) {
      flushUl()
      const content = line.replace(/^\d+\. /, '')
      olItems.push(<li key={k++}>{renderInline(content, k)}</li>)
      continue
    }

    // Blank line — flush lists, add spacing
    if (line.trim() === '') {
      flushLists()
      elements.push(<div key={k++} className="md-spacer" />)
      continue
    }

    // Regular paragraph line
    flushLists()
    elements.push(<p key={k++}>{renderInline(line, k)}</p>)
  }

  flushLists()
  return elements
}

// ─────────────────────────────────────────────────────────

function App() {
  const [brief, setBrief] = useState('')
  const [courseName, setCourseName] = useState('')
  const [audience, setAudience] = useState('')
  const [blueprint, setBlueprint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setBrief(ev.target.result)
    reader.readAsText(file)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setBlueprint(null)

    const userContent = [
      courseName && `**Course / Program Name:** ${courseName}`,
      audience && `**Target Audience:** ${audience}`,
      `**ID Brief:**\n\n${brief}`,
    ]
      .filter(Boolean)
      .join('\n\n')

    const requestBody = {
      passphrase: 'CourseProduction2027!',
      tool: 'blueprint',
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    }
    console.log('[Blueprint] POST', PROXY_URL)
    console.log('[Blueprint] Request body:', requestBody)

    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      console.log('[Blueprint] Response status:', res.status, res.statusText)
      console.log('[Blueprint] Response headers:', Object.fromEntries(res.headers.entries()))

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`API error ${res.status}: ${text}`)
      }

      const data = await res.json()
      const text = data?.content?.[0]?.text
      if (!text) throw new Error('Unexpected response format from API.')
      setBlueprint(text)
    } catch (err) {
      console.log('[Blueprint] Fetch error:', { name: err.name, message: err.message, error: err })
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Button enabled only when textarea has content
  const canGenerate = brief.trim().length > 0 && !loading

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-logo">CB</div>
        <span className="header-title">Course Blueprint Agent</span>
        <span className="header-subtitle">— Backward Design Generator</span>
        <span className="header-badge">Beta</span>
      </header>

      {/* ── Two-panel workspace ── */}
      <main className="workspace">
        {/* Left: Input */}
        <section className="panel panel-left">
          <div className="panel-header">
            <span className="panel-label">ID Brief</span>
            <span className="panel-hint">From SME Interview Agent</span>
          </div>

          <div className="panel-body">
            <form className="brief-form" onSubmit={handleGenerate}>
              {/* Course name */}
              <div className="form-group">
                <label className="form-label" htmlFor="courseName">
                  Course / Program Name
                </label>
                <input
                  id="courseName"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Introduction to Data Literacy"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              {/* Target audience */}
              <div className="form-group">
                <label className="form-label" htmlFor="audience">
                  Target Audience
                </label>
                <input
                  id="audience"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Mid-career professionals, no prior statistics background"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>

              {/* File upload */}
              <div
                className="upload-zone"
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              >
                <div className="upload-icon">📄</div>
                <p className="upload-text">
                  <span>Upload a file</span> or drag and drop
                </p>
                <p className="upload-text">.txt, .md, .docx</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
              </div>

              <div className="or-divider">or paste below</div>

              {/* Brief textarea */}
              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label" htmlFor="brief">
                  ID Brief Text
                </label>
                <textarea
                  id="brief"
                  className="form-input brief-textarea"
                  placeholder={`Paste your structured ID brief here...\n\nExpected sections:\n• Course overview & rationale\n• Course outcomes\n• Learner profile\n• Delivery format & constraints\n• SME notes`}
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-generate"
                disabled={!canGenerate}
              >
                {loading ? 'Generating...' : 'Generate Blueprint'}
              </button>
            </form>
          </div>
        </section>

        {/* Right: Output */}
        <section className="panel panel-right">
          <div className="panel-header">
            <span className="panel-label">Blueprint Output</span>
            <span className="panel-hint">Backward-designed course structure</span>
          </div>

          <div className="panel-body">
            {/* Loading */}
            {loading && (
              <div className="output-loading">
                <div className="spinner" />
                <p className="output-loading-text">Generating blueprint...</p>
                <p className="output-loading-sub">
                  Applying backward design principles to your brief
                </p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="output-error">
                <div className="output-error-icon">⚠</div>
                <p className="output-error-title">Generation failed</p>
                <p className="output-error-msg">{error}</p>
                <button className="btn-retry" onClick={() => setError(null)}>
                  Dismiss
                </button>
              </div>
            )}

            {/* Blueprint output */}
            {blueprint && !loading && (
              <div className="blueprint-content">
                {renderMarkdown(blueprint)}
              </div>
            )}

            {/* Empty state */}
            {!blueprint && !loading && !error && (
              <div className="output-empty">
                <div className="output-empty-icon">🎓</div>
                <p className="output-empty-title">No blueprint yet</p>
                <p className="output-empty-desc">
                  Paste or upload your ID brief on the left, then click
                  "Generate Blueprint" to produce a full backward-designed
                  course structure with Bloom's-mapped outcomes, activities,
                  and assessment alignment.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
