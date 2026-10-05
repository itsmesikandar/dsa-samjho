# PROGRESS

Source of truth. Update after every topic.
Status: `[ ]` todo · `[~]` in progress · `[x]` done (validate + check:code passed).

## Current
- Step: 2 (Engine) done — waiting for user review of Array topic + playground
- Next action: after review → Step 3, chapter 0 (Foundations), topic `memory-basics`
- Last session note (2026-10-05): engine + 13 panel types + Array topic built. Verified at 390px/desktop,
  light/dark via headless Chrome (CDP). Validate fuzzes every tracer (25 random inputs). Kotlin 2.4.20 in
  `tools/kotlinc`, JDK 21 at `~/.jdks/jbr-21.0.11` (check:code auto-detects).

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
- [ ] memory-basics
- [ ] big-o-time
- [ ] space-complexity
- [ ] analyze-code
- [ ] problem-solving
- [ ] kotlin-java-toolkit

### 1. Arrays & Strings
- [x] array (built in Step 2)
- [ ] dynamic-array
- [ ] strings
- [ ] matrix
- [ ] prefix-sum
- [ ] kadane

### 2. Hashing
- [ ] hashing-internals
- [ ] hashmap
- [ ] hashset
- [ ] frequency-count

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
