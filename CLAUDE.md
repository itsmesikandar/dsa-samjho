# CLAUDE.md — DSA Hinglish site
## Start here
- Read PROGRESS.md first (source of truth). Don't scan the whole repo. Read only the needed PLAN.md section (§5 schema, §6 viz, §8 topics).
- Reference topic for quality + format: `content/arrays-strings/array/`. Engine demos: `src/components/viz/demo.ts`.
## Stack
- Next.js 16 App Router + TS + Tailwind v4, static export. No API routes, middleware, ISR. Deps only from PLAN.md §2.
- Markdown (marked) + code (shiki) render at build time; client components only for interactive parts.
## Content
- Topic = `content/<chapter>/<topic>/` → `topic.yaml`, `viz.ts`, `code/*.kt` + `*.java`. Order in `content/chapters.yaml`.
- Simple Hinglish (Roman script), short sentences, Indian daily-life analogies. Technical terms stay English.
- YAML prose: `|` blocks or quoted strings (a bare `: `, or `,` inside `{ }`, breaks YAML).
- Callouts: `> [!yaad]`, `> [!galti]`, `> [!tip]`, `> [!socho]`.
- Frame captions explain WHY. Paraphrase problems, never copy LeetCode/GFG text. Complexity = time + space + why.
## Code + tracers
- Kotlin: top-level functions + `fun main()`. Java: non-public `class Main` (first class in file) with static methods + `main`. ASCII only, Hinglish comments.
- File ends with a `// Output:` block (exact stdout). Arrays print as `[1, 2]` (`contentToString()` / `Arrays.toString`).
- Code-sync: trailing `//@name` marker; frame `line: 'name'`. Tracer `run()` returns the first output line (`listStr()` for arrays).
- Tracer helpers: `src/components/viz/engine/tracer.ts` (`tracer`, `array`, `ids`, `swap`, `listStr`). Panel types: `types.ts`.
- Tone meaning differs from default label? Set frame `legend` (e.g. `{ error: 'ghatao' }`).
## Checks
- Per topic: `npm run validate` + `npm run check:code`, then tick PROGRESS.md. Per chapter: `npm run build`, git commit.
- UI changes: check at 390px and desktop, light and dark, no horizontal overflow.
- Low on context: finish the current file, update the "Current" block in PROGRESS.md, stop.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
