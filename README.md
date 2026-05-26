# Course Blueprint Agent

A small React + Vite tool that converts an ID brief (from a faculty SME interview) into a backward-designed course blueprint via a single Claude call.

**Live demo:** https://abeasley2020.github.io/course-blueprint-agent/

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

GitHub Pages, via the `gh-pages` branch.

```bash
npm run deploy
```

That runs `vite build` and pushes `dist/` to the `gh-pages` branch on `origin`. The live site updates within a minute or two.

GitHub Pages serves from the `gh-pages` branch at https://abeasley2020.github.io/course-blueprint-agent/ — `vite.config.js` sets `base: '/course-blueprint-agent/'` so the bundle resolves under that path.

## Privacy and access

- **No persistent storage.** Brief text, course name, and audience are held in browser state only. Closing the tab discards everything.
- **No analytics.** The page loads no third-party scripts.
- **AI calls** are forwarded by the Cloudflare Worker proxy, which audits each request (who, when, which tool) but does not retain the brief text or the generated blueprint.
- **Passphrase distribution** is handled out-of-band. The passphrase is a low-trust gate against drive-by use; it is intentionally readable in the bundled client.
- **Faculty IP** stays in transit only — Anthropic's no-training default is preserved.

## Related projects

- [SME Interview Agent](https://github.com/abeasley2020/sme-interview-agent) — the upstream tool that produces the ID briefs this app consumes.
- [Cloudflare Worker proxy](https://github.com/abeasley2020/cloudflare-worker) — shared proxy that fronts Anthropic API calls for all of Andre's AIACP tools.

## Acknowledgments

Built for the **Purdue Course Design and Development** team and the broader [AIACP](https://github.com/abeasley2020) framework. Generation powered by **Anthropic Claude**. Auth and audit logging via a shared **Cloudflare Worker**.
