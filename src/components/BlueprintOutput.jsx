import { useState } from 'react'
import Markdown from './Markdown.jsx'
import { copyToClipboard } from '../lib/clipboard.js'
import { downloadMarkdown, slugifyFilename } from '../lib/download.js'

export default function BlueprintOutput({ blueprint, loading, error, courseName, onDismissError }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!blueprint) return
    try {
      await copyToClipboard(blueprint)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (err) {
      console.warn('[Blueprint] Copy failed:', err)
    }
  }

  const handleDownload = () => {
    if (!blueprint) return
    downloadMarkdown(blueprint, slugifyFilename(courseName, 'md'))
  }

  const hasOutput = !!blueprint && !loading

  return (
    <section className="panel panel-right">
      <div className="panel-header">
        <span className="panel-label">Blueprint Output</span>
        {hasOutput ? (
          <div className="output-actions">
            <button type="button" className="btn-action" onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy markdown'}
            </button>
            <button type="button" className="btn-action btn-action-primary" onClick={handleDownload}>
              Download .md
            </button>
          </div>
        ) : (
          <span className="panel-hint">Backward-designed course structure</span>
        )}
      </div>

      <div className="panel-body">
        {loading && (
          <div className="output-loading">
            <div className="spinner" />
            <p className="output-loading-text">Generating blueprint...</p>
            <p className="output-loading-sub">Applying backward design principles to your brief</p>
          </div>
        )}

        {error && !loading && (
          <div className="output-error">
            <div className="output-error-icon">⚠</div>
            <p className="output-error-title">Generation failed</p>
            <p className="output-error-msg">{error}</p>
            <button className="btn-retry" onClick={onDismissError}>
              Dismiss
            </button>
          </div>
        )}

        {blueprint && !loading && <Markdown>{blueprint}</Markdown>}

        {!blueprint && !loading && !error && (
          <div className="output-empty">
            <div className="output-empty-icon">🎓</div>
            <p className="output-empty-title">No blueprint yet</p>
            <p className="output-empty-desc">
              Paste or upload your ID brief on the left, then click "Generate Blueprint" to produce
              a full backward-designed course structure with Bloom's-mapped outcomes, activities,
              and assessment alignment.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
