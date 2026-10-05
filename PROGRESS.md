# PROGRESS

Source of truth. Update after every topic.
Status: `[ ]` todo · `[~]` in progress · `[x]` done (validate + check:code passed).

## Current
- Step: 3 (Content). Chapters 0, 1, 2 done (16 topics).
- Next action: chapter 3 → `two-pointers-opposite` (code/*.kt+java written; need check:code, viz.ts, topic.yaml).
  Plan: how = sorted squares; ex1 reverse vowels; ex2 container with most water; ex3 3Sum; visual = pair-elimination grid.
- Note: low RAM on this machine (~1 GB free) makes `npm run build` slow (24 min once); run it once per chapter.
- Engine: frame `legend` overrides tone labels (see CLAUDE.md).
- Last session note (2026-10-05): chapter 0 committed. Content caches are production-only (dev picks up new
  topics; first request after adding a topic may 404 once). Kotlin 2.4.20 in `tools/kotlinc`, JDK 21 at
  `~/.jdks/jbr-21.0.11` (check:code auto-detects). Visual checks via headless Chrome CDP script (scratchpad).

## Step 1 — Plan
- [x] PLAN.md
- [x] CLAUDE.md
- [x] PROGRESS.md

## Step 2 — Engine
- [x] git init + .gitignore
- [x] Scaffold Next.js 16 + TS 6 + Tailwind v4, static export config
- [x] Kotlin compiler in `tools/kotlinc` + `check:code` script (`scripts/check-code.ts`)
- [x] Content schema (zod) + loader + `validate` script + `gen` script (tracer registry)
- [x] Markdown renderer (marked + callouts) + shiki code highlight + Kotlin/Java tabs
- [x] Layout: top bar, sidebar, outline, mobile drawer, theme toggle, language toggle
- [x] Viz engine: VizPlayer, Controls, caption, VarsPanel, CodePane (code-sync), InputForm, tracer helpers
- [x] Viz panels: ArrayViz, MemoryViz, GridViz, BarsViz, LinkedListViz, StackQueueViz (+ring), HashTableViz, MapViz, TreeViz, GraphViz, RecursionTreeViz, ChartViz, TextViz
- [x] Playground page with demo frames for every panel
- [x] Topic page: all 14 section components
- [x] Mark complete, bookmark, quiz (localStorage)
- [x] Sample topic `arrays-strings/array` complete
- [x] `npm run build` passes, static export works

## Step 3 — Content

### 0. Foundations
- [x] memory-basics
- [x] big-o-time
- [x] space-complexity
- [x] analyze-code
- [x] problem-solving
- [ ] kotlin-java-toolkit

### 1. Arrays & Strings
- [x] array (built in Step 2)
- [x] dynamic-array
- [x] strings
- [x] matrix
- [x] prefix-sum
- [x] kadane

### 2. Hashing
- [x] hashing-internals
- [x] hashmap
- [x] hashset
- [x] frequency-count

### 3. Two Pointers & Sliding Window
- [ ] two-pointers-opposite
- [ ] two-pointers-same
- [ ] sliding-window-fixed
- [ ] sliding-window-variable

### 4. Recursion
- [ ] recursion-basics
- [ ] recursion-patterns

### 5. Sorting & Searching
- [ ] simple-sorts
- [ ] merge-sort
- [ ] quick-sort
- [ ] sorting-in-practice
- [ ] binary-search
- [ ] binary-search-variations
- [ ] binary-search-on-answer

### 6. Linked List
- [ ] singly-linked-list
- [ ] doubly-linked-list
- [ ] fast-slow-pointers
- [ ] reverse-linked-list
- [ ] linked-list-techniques

### 7. Stack & Queue
- [ ] stack
- [ ] queue
- [ ] circular-queue
- [ ] deque
- [ ] monotonic-stack

### 8. Backtracking
- [ ] backtracking-basics
- [ ] permutations-combinations
- [ ] constraint-backtracking

### 9. Trees
- [ ] binary-tree-basics
- [ ] tree-traversals
- [ ] level-order
- [ ] tree-recursion
- [ ] bst
- [ ] lca

### 10. Heap / Priority Queue
- [ ] heap-basics
- [ ] priority-queue
- [ ] top-k
- [ ] two-heaps

### 11. Graphs
- [ ] graph-basics
- [ ] bfs
- [ ] dfs
- [ ] topological-sort
- [ ] dijkstra
- [ ] union-find

### 12. Greedy
- [ ] greedy-basics
- [ ] intervals
- [ ] greedy-classics

### 13. Dynamic Programming
- [ ] dp-intro
- [ ] dp-1d
- [ ] dp-grid
- [ ] knapsack-01
- [ ] unbounded-knapsack
- [ ] dp-strings
- [ ] lis

### 14. Trie & Bits
- [ ] trie
- [ ] bit-basics
- [ ] bit-tricks

## Step 4 — Polish
- [ ] Search (build-time index + Ctrl+K dialog)
- [ ] Patterns page (auto from `when.signals`)
- [ ] Cheatsheets page
- [ ] Glossary page
- [ ] "Aaj revise karo" on home (1/3/7-day reminders)
- [ ] Dark mode + mobile pass on every page
- [ ] Accessibility pass (keyboard, aria-live, reduced motion, contrast)
- [ ] Lighthouse check (mobile)
- [ ] Bundle trim: topic page first-load JS is 210 KB gzip (React/Next ~165, motion ~37). Lazy-load VizPlayer (+ motion) via `next/dynamic` so motion loads only when a player is near
- [ ] Shiki highlighting for fenced code blocks inside markdown (now plain monospace)
- [ ] Deploy config + Vercel deploy
