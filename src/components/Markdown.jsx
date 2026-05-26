import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Demote model-generated headings by one level so the page has a single <h1>
// (the app title in the Header). The model's "# Blueprint title" becomes <h2>,
// section "## ..." becomes <h3>, and so on. CSS in App.css styles h2–h5
// inside .blueprint-content to preserve the prior visual hierarchy.
const components = {
  h1: 'h2',
  h2: 'h3',
  h3: 'h4',
  h4: 'h5',
  h5: 'h6',
  h6: 'h6',
}

export default function Markdown({ children }) {
  return (
    <div className="blueprint-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
