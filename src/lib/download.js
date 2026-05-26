export function downloadMarkdown(text, filename = 'blueprint.md') {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  triggerDownload(blob, filename)
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function slugifyFilename(courseName, ext = 'md') {
  const base = (courseName || 'blueprint')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'blueprint'
  return `${base}.${ext}`
}
