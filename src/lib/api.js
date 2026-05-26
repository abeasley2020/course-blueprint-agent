import {
  PROXY_URL,
  MODEL,
  MAX_TOKENS,
  TOOL,
  PASSPHRASE,
  SYSTEM_PROMPT,
  FEW_SHOT_MESSAGES,
  buildUserMessage,
} from '../prompts/blueprint.js'

export async function generateBlueprint({ brief, courseName, audience }) {
  const userMessage = buildUserMessage({ brief, courseName, audience })
  const requestBody = {
    passphrase: PASSPHRASE,
    tool: TOOL,
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages: [...FEW_SHOT_MESSAGES, { role: 'user', content: userMessage }],
  }

  console.log('[Blueprint] POST', PROXY_URL)
  console.log('[Blueprint] Request body:', requestBody)

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  console.log('[Blueprint] Response status:', res.status, res.statusText)

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text
  if (!text) throw new Error('Unexpected response format from API.')
  return text
}
