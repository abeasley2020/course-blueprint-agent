import { useRef } from 'react'

export default function BriefForm({
  courseName,
  audience,
  brief,
  loading,
  onCourseNameChange,
  onAudienceChange,
  onBriefChange,
  onSubmit,
}) {
  const fileInputRef = useRef(null)

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onBriefChange(ev.target.result)
    reader.readAsText(file)
  }

  const handleUploadKeyDown = (e) => {
    // WAI-ARIA button role: activate on Enter OR Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      fileInputRef.current?.click()
    }
  }

  const canGenerate = brief.trim().length > 0 && !loading

  return (
    <section className="panel panel-left" aria-labelledby="brief-panel-heading">
      <div className="panel-header">
        <h2 id="brief-panel-heading" className="panel-label">ID Brief</h2>
        <span className="panel-hint">From SME Interview Agent</span>
      </div>

      <div className="panel-body">
        <form className="brief-form" onSubmit={onSubmit}>
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
              onChange={(e) => onCourseNameChange(e.target.value)}
            />
          </div>

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
              onChange={(e) => onAudienceChange(e.target.value)}
            />
          </div>

          <div
            className="upload-zone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload a brief file. Accepts .txt and .md"
            onKeyDown={handleUploadKeyDown}
          >
            <div className="upload-icon" aria-hidden="true">📄</div>
            <p className="upload-text">
              <span>Upload a file</span> or drag and drop
            </p>
            <p className="upload-text">.txt, .md</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>

          <div className="or-divider" aria-hidden="true">or paste below</div>

          <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label className="form-label" htmlFor="brief">
              ID Brief Text
            </label>
            <textarea
              id="brief"
              className="form-input brief-textarea"
              placeholder={`Paste your structured ID brief here...\n\nExpected sections:\n• Course overview & rationale\n• Course outcomes\n• Learner profile\n• Delivery format & constraints\n• SME notes`}
              value={brief}
              onChange={(e) => onBriefChange(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-generate" disabled={!canGenerate}>
            {loading ? 'Generating...' : 'Generate Blueprint'}
          </button>
        </form>
      </div>
    </section>
  )
}
