# Course Blueprint Agent

A small React + Vite tool that converts an ID brief (from a faculty SME interview) into a backward-designed course blueprint via a single Claude call.

**Live demo:** https://course-blueprint-agent.vercel.app

## Overview

The instructional design team at PUO Course Production partners with dozens of faculty each year. Early in every project, a senior manager synthesizes an SME interview into an "ID Brief" that captures the course's rationale, audience, intended outcomes, and constraints. The next step — converting that brief into a defensible course blueprint with Bloom-aligned outcomes, a module sequence, and an aligned assessment plan — is repetitive and time-consuming.

This tool handles that conversion. It is the second stage of a two-step pipeline: the [SME Interview Agent](https://github.com/abeasley2020/sme-interview-agent) produces the brief; this app consumes it and produces a backward-designed blueprint that the ID can refine and share with faculty.

It is intentionally small. One page, one form, one Claude call. No persistence, no editing, no exports — just a fast paper-to-pixels pass over the brief.

## How it works

```
┌────────────────────┐    ID brief    ┌──────────────────────────┐
│  SME Interview     │ ─────────────▶ │  Course Blueprint Agent  │
│  Agent (upstream)  │                │  (this app, browser)     │
└────────────────────┘                └──────────────┬───────────┘
                                                     │ POST + passphrase
                                                     ▼
                                       ┌──────────────────────────┐
                                       │  Cloudflare Worker proxy │
                                       │  (auth, audit log)       │
                                       └──────────────┬───────────┘
                                                      ▼
                                       ┌──────────────────────────┐
                                       │  Anthropic Messages API  │
                                       │  claude-sonnet-4 (May)   │
                                       └──────────────────────────┘
```

1. The user pastes or uploads an ID brief and optionally fills in the course name and target audience.
2. The app posts a single message to a shared Cloudflare Worker proxy, with a hardcoded system prompt that asks for a five-section blueprint.
3. The proxy authenticates the request (passphrase + tool name), forwards it to Anthropic, and audit-logs the call.
4. The response markdown is rendered to the right panel by a hand-rolled markdown-to-React function. Tables get Purdue-gold styling.

The output exists only as on-screen markdown. Closing the tab discards it.

## Features

- **Brief input** by paste, file upload (`.txt`, `.md`), or direct typing.
- **Copy and download** — copy the rendered blueprint as markdown, or download it as a `.md` file named after the course.
- **Backward-designed output** in five sections:
  1. Course Overview (title, audience, delivery format, duration)
  2. Course Outcomes mapped to Bloom's Taxonomy
  3. Module Sequence (titles, objectives, activity types, seat time)
  4. Assessment Strategy (formative and summative, aligned to outcomes)
  5. Design Notes and Flags (gaps, risks, SME assumptions to verify)
- **Purdue-themed markdown rendering** — tables in Purdue gold (`#CFB991`), zebra-striped rows, headings styled for print.
- **No accounts, no persistence** — anyone on the team can use it without signing in.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite (plain JSX) |
| Markdown | `react-markdown` + `remark-gfm` (tables), wrapped in [src/components/Markdown.jsx](src/components/Markdown.jsx) |
| State | `useState` only — no store, no router |
| AI access | [Anthropic Messages API](https://docs.anthropic.com/en/api/messages) via shared Cloudflare Worker proxy |
| Model | `claude-sonnet-4-20250514` at `max_tokens: 4000` |
| Hosting | GitHub Pages (`gh-pages` branch) |
| Auth | Passphrase + tool name, gated at the proxy |

## File structure

```
course-blueprint-agent/
├── public/                       # static assets served as-is
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx                   # top-level orchestration (~55 lines)
│   ├── App.css                   # Purdue-themed component styles
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # global resets + brand tokens
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── BriefForm.jsx         # left panel — inputs, file upload
│   │   ├── BlueprintOutput.jsx   # right panel — output + copy/download buttons
│   │   └── Markdown.jsx          # react-markdown + remark-gfm wrapper
│   ├── lib/
│   │   ├── api.js                # generateBlueprint() — calls the proxy
│   │   ├── clipboard.js          # copyToClipboard()
│   │   └── download.js           # downloadMarkdown(), slugifyFilename()
│   ├── prompts/
│   │   └── blueprint.js          # system prompt + few-shot examples + model config
│   └── assets/                   # react.svg, vite.svg, hero.png
├── index.html                    # Vite root
├── vite.config.js                # `base: '/course-blueprint-agent/'` for gh-pages
├── eslint.config.js
└── package.json                  # scripts: dev, build, lint, preview, deploy
```

The system prompt, model name, proxy URL, and few-shot examples all live in [src/prompts/blueprint.js](src/prompts/blueprint.js) — that's the file to edit when tuning generation quality.

## Local development

### Install

```bash
npm install
```

### Run

```bash
npm run dev
```

The dev server starts on http://localhost:5173. No environment variables are required — the proxy URL and passphrase are baked into the client. (The passphrase is a low-trust gate, not a secret; the actual auth-and-audit logic lives in the Cloudflare Worker.)

### Lint

```bash
npm run lint
```

### Production build (without deploying)

```bash
npm run build
npm run preview
```

The preview server serves the built bundle on http://localhost:4173.

## Deployment

Vercel, via the [GitHub integration](https://vercel.com/docs/git) on this repo.

Every push to `main` triggers a production deploy automatically. The Vercel project is `andrebeasley2012-2848s-projects/course-blueprint-agent` and the canonical production URL is https://course-blueprint-agent.vercel.app.

To deploy from the CLI on demand:

```bash
vercel              # preview deployment
vercel --prod       # production deployment
```

To inspect or roll back:

```bash
vercel ls                      # recent deployments
vercel inspect <url>           # build info for a specific deploy
vercel rollback <url>          # promote an older deploy to production
```

The previous GitHub Pages deployment at `abeasley2020.github.io/course-blueprint-agent` is no longer the source of truth; the `gh-pages` branch remains for history but receives no new pushes.

## Privacy and access

- **No persistent storage.** Brief text, course name, and audience are held in browser state only. Closing the tab discards everything.
- **No analytics.** The page loads no third-party scripts.
- **AI calls** are forwarded by the Cloudflare Worker proxy, which audits each request (who, when, which tool) but does not retain the brief text or the generated blueprint.
- **Passphrase distribution** is handled out-of-band. The passphrase is a low-trust gate against drive-by use; it is intentionally readable in the bundled client.
- **Faculty IP** stays in transit only — Anthropic's no-training default is preserved.

## Accessibility

Built and verified against **WCAG 2.2 Level AAA** plus the Purdue accessibility checklist.

### Compliance

- **Contrast (SC 1.4.6)** — every text/background combination clears 7:1 for normal text and 4.5:1 for large text. Gold (`#CFB991`) appears only as a background or large accent (table headers, primary buttons), never as small text on white. The text-on-gold variant is Purdue Bold Gold equivalent `#5C4400` (8.4:1 on white).
- **Focus appearance (SC 2.4.13)** — every interactive element has a solid 3 px outline at the gold-focus color (`#7A5C1E`, 5.6:1 against white) with a 2 px offset. Not a low-alpha glow.
- **Target size (SC 2.5.5)** — every button, input, and clickable zone is at least 44 × 44 CSS pixels.
- **Visual presentation (SC 1.4.8)** — body text is 16 px, blueprint content caps at 80 characters per line, paragraph spacing is 1.5 × line height, no full justification.
- **Status messages (SC 4.1.3)** — the generation spinner is wrapped in `role="status"` with `aria-live="polite"`; the error panel uses `role="alert"`. Decorative emoji and spinners are `aria-hidden`.
- **Section headings (SC 2.4.10)** — single `<h1>` (the app title), `<h2>` for each panel, model-generated blueprint headings are demoted by one level in [src/components/Markdown.jsx](src/components/Markdown.jsx) so there is no second `<h1>`.
- **Keyboard (SC 2.1.1)** — every control reachable and activatable from the keyboard. The file-upload zone activates on Enter and Space (WAI-ARIA button role). A skip-to-main-content link appears on first Tab.
- **Page title (SC 2.4.2)** — descriptive: "Course Blueprint Agent — Backward Design Generator".

### Documented exceptions (AAA criteria not auto-fixed)

Three AAA criteria don't apply cleanly to this tool's audience and are deliberately not "fixed":

- **SC 3.1.5 Reading Level** — the app's microcopy uses ID-professional vocabulary ("ID brief", "Bloom's Taxonomy", "backward design", "module sequence", "formative", "summative"). The audience is instructional designers and SMEs; this jargon is the working language of the field. Providing a "lower-secondary" simplified version would degrade the experience for the intended user.
- **SC 3.1.4 Abbreviations** — "ID" (Instructional Designer), "SME" (Subject-Matter Expert), and "CO" (Course Outcome, in the generated tables) are the audience's standard abbreviations. Expanding them inline would clutter the experience.
- **SC 2.4.8 Location** — single-page app, not part of a navigable set, so location indicators don't apply.

If this tool is ever opened to learners or general audiences, the first two exceptions become real and need a simpler-language mode.

### Color contrast reference

| Use | Color | Background | Ratio |
|---|---|---|---|
| Body text | `#0D0D0D` | `#FFFFFF` | 19.5:1 |
| Body text on off-white | `#0D0D0D` | `#F7F6F3` | 18.8:1 |
| Subdued text | `#595959` | `#FFFFFF` | 7.0:1 |
| Gold-dark text | `#5C4400` | `#FFFFFF` | 8.4:1 |
| Error title | `#911818` | `#FFFFFF` | 8.4:1 |
| Header text | `#F5F0E8` | `#0D0D0D` | 18:1 |
| Button on gold | `#0D0D0D` | `#CFB991` | 10.5:1 |
| Table header | `#0D0D0D` | `#CFB991` | 10.5:1 |
| Focus indicator | `#7A5C1E` outline | any | ≥ 3:1 |

## Related projects

- [SME Interview Agent](https://github.com/abeasley2020/sme-interview-agent) — the upstream tool that produces the ID briefs this app consumes.
- [Cloudflare Worker proxy](https://github.com/abeasley2020/cloudflare-worker) — shared proxy that fronts Anthropic API calls for all of Andre's AIACP tools.

## Acknowledgments

Built for the **Purdue Course Design and Development** team and the broader [AIACP](https://github.com/abeasley2020) framework. Generation powered by **Anthropic Claude**. Auth and audit logging via a shared **Cloudflare Worker**.
