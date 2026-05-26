// One-click handoff from the Course Intake Agent. When the intake admin
// clicks "Open in Blueprint Agent" we open this app with a URL fragment of
// the form `#intake=<base64-json>` carrying { brief, courseName, audience }.
//
// Fragments stay client-side, so the brief never travels through a Referer
// header or hits a server log on the way in.

const PREFIX = '#intake='

export function readIntakeFromHash() {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash
  if (!hash.startsWith(PREFIX)) return null

  try {
    const b64 = decodeURIComponent(hash.slice(PREFIX.length))
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    const json = new TextDecoder().decode(bytes)
    const data = JSON.parse(json)
    if (!data || typeof data !== 'object') return null
    return {
      brief: typeof data.brief === 'string' ? data.brief : '',
      courseName: typeof data.courseName === 'string' ? data.courseName : '',
      audience: typeof data.audience === 'string' ? data.audience : '',
    }
  } catch {
    return null
  }
}

// Strip the fragment so a reload doesn't re-seed (which would clobber any
// edits the user has made in the meantime). Uses replaceState so we don't
// add a history entry.
export function clearIntakeHash() {
  if (typeof window === 'undefined') return
  if (!window.location.hash.startsWith(PREFIX)) return
  window.history.replaceState(
    null,
    '',
    window.location.pathname + window.location.search,
  )
}
