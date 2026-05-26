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

  const canGenerate = brief.trim().length > 0 && !loading

  return (
    <section className="panel panel-left">
      <div className="panel-header">
        <span className="panel-label">ID Brief</span>
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
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          >
            <div className="upload-icon">📄</div>
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
            />
          </div>

          <div className="or-divider">or paste below</div>

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
