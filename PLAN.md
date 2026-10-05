# DSA Hinglish — PLAN

> Status: Step 1 (plan) done. Waiting for "go".
> Read only the section you need. Day-to-day status lives in PROGRESS.md.

## 1. Goal

A static website that teaches DSA in simple Hinglish, with step-by-step animations.
Learner: Kotlin/Flutter developer, no web background, weak in English.
End goal: understand each concept deeply by seeing it move, then crack interviews.

## 2. Key decisions (and why)

| # | Decision | Why |
|---|---|---|
| D1 | Next.js App Router + TypeScript + Tailwind v4, `output: 'export'` | Pure static HTML on Vercel. No server cost. Fast on phone. |
| D2 | One topic = one folder: `topic.yaml` + `viz.ts` + `code/` (`.kt` and `.java` files) | See D3, D4, D5. |
| D3 | Text and structured data in **YAML**, not MDX or JSON | Markdown inside YAML block scalars needs no escaping (backticks, quotes). JSON needs `\n` and escaping everywhere. MDX is hard to validate section by section. YAML becomes a plain object, so zod can check the exact schema. |
| D4 | Animation = **frames (pure data)**, made by a tiny **tracer** function per example | The renderer is generic and never changes per topic. The tracer runs the algorithm on an input and records frames. This is the only way "Apna input try karo" can work: fixed frames cannot change when the input changes. |
| D5 | Code lives in real `.kt` / `.java` files | We can compile and run them, and check the printed output. The site shows the same files. |
| D6 | Markdown (`marked`) and syntax highlight (`shiki`) run at **build time** | Text and code ship as plain HTML. Zero JavaScript for them. Small bundle. |
| D7 | Only interactive parts are client components | Player, toggles, quiz, progress, search. Everything else is static HTML. |
| D8 | `motion` (Framer Motion) with `LazyMotion` + plain SVG | Smooth swap / push / pop / shift animations for about 15 KB. |
| D9 | No UI kit, no icon library, no state library | Inline SVG icons. React context + `useSyncExternalStore` + localStorage. |
| D10 | Chapter and topic order in one file: `content/chapters.yaml` | Reorder without renaming folders. Topics not written yet show "Jaldi aa raha hai". |

Planned dependencies (nothing else without asking):
- Runtime: `next`, `react`, `react-dom`, `motion`.
- Build/dev only: `typescript`, `tailwindcss` + `@tailwindcss/postcss`, `zod`, `yaml`, `marked`, `shiki`, `tsx`.

## 3. Architecture

```
content/ (topic.yaml + viz.ts + code/*.kt, *.java)
   │
   ├─ scripts/validate-content.ts  → fails the build on any missing section or bad data
   ├─ scripts/check-code.ts        → kotlinc + javac: compile, run, compare output (local only)
   ├─ scripts/gen.ts               → tracer registry + search index
   ▼
next build (static export)
   ├─ Server components (build time): yaml → zod → markdown → HTML; shiki → highlighted code lines
   └─ Client islands: VizPlayer (lazy-loads that topic's viz.ts), Lang/Theme toggles, Quiz, Progress, Search
   ▼
out/ → Vercel static hosting
```

One animation, end to end:
`input (default or user's)` → `tracer.run()` → `Frame[]` → `VizPlayer` draws `frame.panels` with generic viz components, highlights `frame.line` in the code, shows `frame.caption`.

## 4. Folder structure

```
dsa/
├─ CLAUDE.md  PLAN.md  PROGRESS.md
├─ package.json  next.config.ts  tsconfig.json  postcss.config.mjs
├─ content/
│  ├─ chapters.yaml               # chapter + topic order and titles
│  ├─ glossary.yaml               # English term → simple Hinglish meaning
│  └─ arrays-strings/
│     └─ array/
│        ├─ topic.yaml            # all 14 sections
│        ├─ viz.ts                # tracers (input → frames)
│        └─ code/
│           ├─ how.kt              how.java
│           ├─ ex1-find-max.kt     ex1-find-max.java
│           └─ ...
├─ scripts/
│  ├─ validate-content.ts
│  ├─ check-code.ts
│  └─ gen.ts
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx  page.tsx  globals.css
│  │  ├─ learn/[chapter]/page.tsx
│  │  ├─ learn/[chapter]/[topic]/page.tsx
│  │  └─ patterns/  cheatsheets/  glossary/  bookmarks/  playground/
│  ├─ components/
│  │  ├─ layout/  TopBar, Sidebar, MobileDrawer, Toc, ThemeToggle, LangToggle, ProgressBar, SearchDialog
│  │  ├─ topic/   Section, Markdown, OpsTable, CodeTabs, ExampleCard, WhenToUse, RealWorld,
│  │  │           Mistakes, Interview, Practice, Revision, Quiz, Connections, CompleteButton, BookmarkButton
│  │  └─ viz/
│  │     ├─ engine/  VizPlayer, Controls, CodePane, CaptionBox, VarsPanel, InputForm,
│  │     │           usePlayer, tracer.ts, types.ts, tones.ts
│  │     └─ panels/  ArrayViz, MemoryViz, GridViz, BarsViz, LinkedListViz, StackQueueViz,
│  │                 HashTableViz, MapViz, TreeViz, GraphViz, RecursionTreeViz, ChartViz
│  ├─ lib/        schema.ts (zod), content.ts (load), markdown.ts, highlight.ts, storage.ts, search.ts
│  └─ generated/  tracers.ts, search-index.json   (auto-generated, gitignored)
└─ tools/kotlinc/  (local Kotlin compiler, gitignored)
```

## 5. Content schema

Types come from zod (`z.infer`). Sketch:

```ts
const md = z.string().min(30);                    // a markdown block
const VizRef = z.object({ tracer: z.string() });  // export name in viz.ts
const CodeRef = z.string();                       // "ex1-find-max" → code/ex1-find-max.kt + .java

Topic = {
  meta:        { id, chapter, title, subtitle, level: 'beginner'|'intermediate'|'advanced',
                 minutes, prereqs: TopicId[], tags: string[] },
  what:        { body: md, analogy: md },                        // 1  Ye kya hai?
  why:         { body: md },                                     // 2  Kyun chahiye?
  visual:      { body: md, viz: VizRef },                        // 3  Visual intro (structure / memory)
  how:         { body: md, viz: VizRef, code: CodeRef },         // 4  Kaise kaam karta hai (animated + code-sync)
  operations:  [{ op, time, space, why }]            // ≥3       // 5  Operations table
  code:        [{ title, file: CodeRef, note?: md }] // ≥1       // 6  Code (Kotlin + Java tabs)
  examples:    Example[]  // ≥3, ordered easy → medium → tricky  // 7  Examples
  when:        { use: string[], avoid: string[],     // ≥2 each  // 8  Kab use karein / kab NAHI
                 signals: [{ keyword, think }] },    // ≥3
  realWorld:   [{ where, how }]                      // ≥3       // 9  Real-world use
  mistakes:    [{ title, wrong?: md, right: md,      // ≥4       // 10 Mistakes & edge cases
                  type: 'off-by-one'|'null'|'empty'|'overflow'|'logic'|'other' }],
  interview:   { questions: [{ q, a: md, followUp?: boolean }],  // 8–12   // 11 Interview corner
                 mayAsk: string[] },                 // ≥3
  practice:    [{ name, platform: 'LeetCode'|'GFG'|'Custom', num?, url?,         // 12 Practice
                  level: 'easy'|'medium'|'hard', pattern, hint }],  // exactly 3 easy + 3 medium + 2 hard
  revision:    { summary: string[5], cheatsheet: md,                              // 13 Quick revision
                 quiz: [{ q, options: string[2..4], answer: number, explain }] }, // exactly 5
  connections: { related: [{ id, why }], usedLater: [{ id, how }] },  // ≥1 each  // 14 Connections
}                                                    // prev/next come from chapters.yaml

Example = {
  id, level: 'easy'|'medium'|'tricky', title,
  problem: md,                         // paraphrased, never copied
  source?: { name, platform, url },
  intuition: md,                       // "pehle dimaag mein kya aana chahiye"
  dryRun: md,                          // table
  viz: VizRef, code: CodeRef,
  complexity: { time, space, why },
}
```

Example `topic.yaml` shape:

```yaml
meta:
  id: array
  chapter: arrays-strings
  title: Array
  subtitle: Ek line mein rakhe dabbe — index se seedha access
  level: beginner
  minutes: 25
  prereqs: [memory-basics, big-o-time]
  tags: [array, index, contiguous]
what:
  body: |
    Array ek **fixed size** container hai. Saare items memory mein `ek ke baad ek` baithte hain.
  analogy: |
    Railway coach ki numbered seats socho...
examples:
  - id: find-max
    level: easy
    title: Sabse bada number dhoondo
    viz: { tracer: findMax }
    code: ex1-find-max
    complexity: { time: O(n), space: O(1), why: "Har element sirf ek baar dekha." }
```

Markdown callouts (rendered as coloured boxes):
`> [!yaad]` Yaad rakhna · `> [!galti]` Galti mat karna · `> [!tip]` Interview tip · `> [!socho]` Socho (pause-and-think question, answer hidden behind a tap).

Validation — `npm run validate`, runs automatically before every build, build fails on any error:
- Every section present and non-empty. ≥3 examples ordered easy → medium → tricky. Practice exactly 3/3/2. 8–12 interview questions. 5 summary lines. 5 quiz items with a valid `answer` index.
- Every CodeRef has both `.kt` and `.java`. Every code file ends with a `// Output:` block.
- Every VizRef exists in `viz.ts`. Each tracer run with default input gives 2–400 frames, every caption non-empty, every `frame.line` marker present in both `.kt` and `.java`.
- Tracer's returned result == first line of the code's `// Output:` block. So the TS animation and the Kotlin/Java code must agree.
- Fuzz: each tracer runs 25 random valid inputs without crashing.
- Every topic id used in prereqs/connections exists in `chapters.yaml`.
- YAML errors are reported with file + line number.

## 6. Visualizer engine

**Frame (pure data):**
```ts
type Frame = {
  caption: string;     // Hinglish: WHY this step happens, not only what
  line?: string;       // code-sync marker, e.g. 'swap'
  vars?: Record<string, string | number | boolean | null>;   // watch panel: i=2, sum=7
  panels: Panel[];     // one or more visuals shown together (e.g. graph + queue + visited array)
};
```

**Panel kinds** (one generic component each):

| kind | Component | Used for |
|---|---|---|
| `array` | ArrayViz | arrays, strings, pointers (i, j, l, r), window ranges, index row, optional address row |
| `memory` | MemoryViz | RAM strip with addresses: contiguous (array) vs scattered (linked list) with arrows |
| `grid` | GridViz | 2D arrays, DP tables, BFS on grid, N-Queens |
| `bars` | BarsViz | sorting (bar height = value) |
| `list` | LinkedListViz | singly / doubly / circular, named pointers (head, prev, curr, slow, fast) |
| `stack`, `queue`, `deque`, `ring` | StackQueueViz | stack, queue, deque, circular queue with front/rear |
| `hash` | HashTableViz | buckets, hash calculation, chaining, probing, rehash |
| `map` | MapViz | simple key → value table (frequency count, memo table) |
| `tree` | TreeViz | binary tree, BST, heap (auto layout) |
| `graph` | GraphViz | nodes/edges, directed, weights, visited/distance badges |
| `recursion` | RecursionTreeViz | call tree + call stack side by side, return values flowing up |
| `chart` | ChartViz | Big-O growth curves |

Shared rules: every item can have a tone — `active | compare | swap | done | found | muted | error | new`. Each tone has colour + a small label/pattern, so colour-blind users can follow. Items carry stable ids so Motion animates real movement (swap, shift, push, pop).

**Tracer (small TS per example):**
```ts
export const reverse = tracer({
  inputs: [{ name: 'arr', type: 'intArray', label: 'Array', default: [1, 2, 3, 4, 5],
             minLen: 1, maxLen: 10, min: -99, max: 99 }],
  run({ arr }, t) {
    const a = [...arr]; let l = 0, r = a.length - 1;
    t.frame({ line: 'init', vars: { l, r },
      caption: 'l ko start pe, r ko end pe rakha — dono taraf se swap karte hue beech tak aayenge.',
      panels: [t.array(a, { pointers: { l, r } })] });
    // ... more frames ...
    return a.join(' ');   // must equal first line of the program's output
  },
});
```
Input types: `int`, `intArray`, `string`, `intGrid`, `charGrid`, `edges`. Limits are enforced (size, value range, max 400 frames), so user input can never hang the phone.

**Player controls:** restart, previous, play/pause, next, speed (0.5×–3×), step counter "Step 4 / 17", scrubber. Keyboard: ← → Space. Swipe on mobile. Caption is `aria-live`. Respects `prefers-reduced-motion`.

**Code-sync:** a code line is marked with a trailing comment `//@name`. Markers are removed before display. The player highlights the line for `frame.line` in the selected language (Kotlin/Java) and scrolls it into view inside the code box.

**Apna input try karo:** form built automatically from `inputs`. Validate → re-run tracer → go to step 1. Friendly Hinglish errors ("Max 10 numbers daalo").

**Performance:** each topic's `viz.ts` is its own lazy chunk (via generated registry). A player mounts only when it scrolls near the screen.

## 7. Pages and layout

| Route | Content |
|---|---|
| `/` | Intro, how to use the site, chapter roadmap with progress, "Continue karo", "Aaj revise karo" |
| `/learn/[chapter]` | Chapter overview, topic list, chapter progress |
| `/learn/[chapter]/[topic]` | The 14 sections |
| `/patterns` | "Question mein ye keyword dikhe → ye pattern socho" — built automatically from every topic's `when.signals` |
| `/cheatsheets` | Big-O table, Kotlin/Java collections table, every topic's cheat-sheet box in one place |
| `/glossary` | English term → simple Hinglish meaning |
| `/bookmarks` | Saved topics |
| `/playground` | Every viz panel with demo frames (to review the engine) |

Layout: top bar (logo, search, Kotlin/Java toggle, theme toggle) · left sidebar (chapters collapsible, done ticks, progress bar) · right "Is page par" outline.
Mobile: sidebar → drawer, outline → sticky "Section jump" dropdown, viz full width, code below viz, 44px touch targets.
Saved in localStorage (always inside try/catch): language, theme, done topics (with date), bookmarks, quiz scores.
Dark mode: `data-theme` on `<html>`, set by a tiny inline script before paint (no flash).

## 8. Chapters and topics (71 topics)

Changes to your order, and why:
1. **Recursion moved to chapter 4** (before Sorting and Linked List). Merge sort, quick sort, recursive reverse and all of Trees need recursion first.
2. **Backtracking split out as chapter 8** (after Stack & Queue, before Trees). It is much harder than basic recursion; the learner needs call-stack comfort first. Backtracking = DFS on a decision tree, so it also warms up for Trees.
3. **Added patterns that interviews ask a lot:** Kadane (arrays), Binary search on answer, Dummy-node technique, Monotonic deque, Two heaps, Intervals (greedy).
4. Trie & Bits stay last (bonus).

Each row lists the 3 planned examples (easy / medium / tricky). Problem names are references only; statements will be paraphrased. Foundations topics may use `Custom` practice exercises where no real problem fits.

### 0. Foundations — `foundations`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 0.1 | memory-basics | Memory kaise kaam karti hai — RAM, bytes, address, stack vs heap, value vs reference | Int ka size & address / `val b = a` reference trap / function calls ke stack frames |
| 0.2 | big-o-time | Time complexity & Big-O — steps count, growth, drop constants, common classes | Array sum O(n) / nested pair loop O(n²) / halving loop O(log n) |
| 0.3 | space-complexity | Space complexity — input vs extra space, recursion stack | In-place reverse O(1) vs copy O(n) / prefix array O(n) / recursive sum O(n) stack |
| 0.4 | analyze-code | Code analyze karna — add/multiply rules, log loops, recursion tree, amortized | Two separate loops O(n+m) / doubling inner loop O(n log n) / fib recursion O(2ⁿ) |
| 0.5 | problem-solving | Problem kaise approach karein — samjho, examples, constraints → complexity, brute → optimize, dry run, interview mein bolna | Duplicate exists? (n² → sort → set) / pair with given sum / max sum of k-window (brute → window) |
| 0.6 | kotlin-java-toolkit | DSA ke liye Kotlin & Java toolkit — IntArray vs List, collections, StringBuilder, Int/Long overflow | Even numbers count / words group by first letter (HashMap) / sum overflow bug → Long |

### 1. Arrays & Strings — `arrays-strings`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 1.1 | array ★ | Array — contiguous memory, index formula, fixed size, shifting | Find max / reverse in place / rotate right by k (reversal trick) |
| 1.2 | dynamic-array | Dynamic array (ArrayList / MutableList) — size vs capacity, doubling, amortized O(1) | add/remove + capacity trace / apna MyArrayList banao / remove-while-iterating trap |
| 1.3 | strings | Strings — char array, immutability, StringBuilder, char math | Count vowels / Valid Palindrome (LC 125) / String Compression (LC 443) |
| 1.4 | matrix | 2D array / Matrix — row-major memory, (r,c) → index, traversal orders | Transpose / Rotate Image (LC 48) / Spiral Matrix (LC 54) |
| 1.5 | prefix-sum | Prefix sum — range sum in O(1), 2D idea | Range Sum Query (LC 303) / Find Pivot Index (LC 724) / Product of Array Except Self (LC 238) |
| 1.6 | kadane | Kadane's algorithm — maximum subarray | Maximum Subarray (LC 53) / also return start–end indices / Maximum Circular Subarray (LC 918) |

★ = Step 2 reference topic.

### 2. Hashing — `hashing`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 2.1 | hashing-internals | Hashing andar se — hash function, buckets, collisions (chaining, linear probing), load factor, rehash, hashCode/equals | keys → buckets / collision with chaining / rehash at load factor 0.75 |
| 2.2 | hashmap | HashMap — key → value, getOrDefault, iteration | Two Sum (LC 1) / Isomorphic Strings (LC 205) / Subarray Sum Equals K (LC 560, prefix + map) |
| 2.3 | hashset | HashSet — unique items, O(1) average lookup | Contains Duplicate (LC 217) / Intersection of Two Arrays (LC 349) / Longest Consecutive Sequence (LC 128) |
| 2.4 | frequency-count | Frequency count — map vs IntArray(26) | Valid Anagram (LC 242) / Group Anagrams (LC 49) / Top K Frequent (LC 347, bucket sort) |

### 3. Two Pointers & Sliding Window — `two-pointers-window`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 3.1 | two-pointers-opposite | Two pointers — dono kinaron se | Two Sum II (LC 167) / Container With Most Water (LC 11) / 3Sum (LC 15) |
| 3.2 | two-pointers-same | Two pointers — same direction (read/write) | Move Zeroes (LC 283) / Merge Sorted Array (LC 88) / Remove Duplicates II (LC 80) |
| 3.3 | sliding-window-fixed | Sliding window — fixed size k | Max sum of k-window / Max Vowels in k-window (LC 1456) / Find All Anagrams (LC 438) |
| 3.4 | sliding-window-variable | Sliding window — variable size (expand / shrink) | Min Size Subarray Sum (LC 209) / Longest Substring Without Repeating (LC 3) / Minimum Window Substring (LC 76) |

### 4. Recursion — `recursion`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 4.1 | recursion-basics | Recursion — base case, call stack, stack overflow | Factorial / reverse a string recursively / fast power x^n (LC 50) |
| 4.2 | recursion-patterns | Recursion patterns — multiple calls, index-based, pick / not-pick | Array sum recursively / all subsequences of a string / Tower of Hanoi |

### 5. Sorting & Searching — `sorting-searching`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 5.1 | simple-sorts | Bubble, Selection, Insertion sort | Bubble (early stop) / Selection (min swaps) / Insertion on nearly-sorted data |
| 5.2 | merge-sort | Merge sort — divide & conquer | Merge two sorted arrays / full merge sort / Count Inversions |
| 5.3 | quick-sort | Quick sort — partition | Lomuto partition / full quick sort / Kth Largest via Quickselect (LC 215) |
| 5.4 | sorting-in-practice | Sorting in practice — Comparator, stability, counting sort | multi-key comparator / Sort Colors via counting (LC 75) / Largest Number (LC 179) |
| 5.5 | binary-search | Binary search | Binary Search (LC 704) / Search Insert Position (LC 35) / Search a 2D Matrix (LC 74) |
| 5.6 | binary-search-variations | Binary search variations — first/last, rotated, peak | First & Last Position (LC 34) / Search in Rotated Array (LC 33) / Find Peak Element (LC 162) |
| 5.7 | binary-search-on-answer | Binary search on answer | Sqrt(x) (LC 69) / Koko Eating Bananas (LC 875) / Ship Packages in D Days (LC 1011) |

### 6. Linked List — `linked-list`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 6.1 | singly-linked-list | Singly linked list — nodes scattered in memory | traverse + length / insert at position & delete by value / Delete Node given only that node (LC 237) |
| 6.2 | doubly-linked-list | Doubly (+ circular) linked list | insert at head/tail / delete a given node / Design Browser History (LC 1472) |
| 6.3 | fast-slow-pointers | Fast & slow pointers (Floyd) | Middle of List (LC 876) / Linked List Cycle (LC 141) / Cycle start (LC 142) |
| 6.4 | reverse-linked-list | Reverse linked list | Reverse List (LC 206) / Reverse List II (LC 92) / Palindrome Linked List (LC 234) |
| 6.5 | linked-list-techniques | Dummy node, gap pointers, merge | Merge Two Sorted Lists (LC 21) / Remove Nth From End (LC 19) / Intersection of Two Lists (LC 160) |

### 7. Stack & Queue — `stack-queue`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 7.1 | stack | Stack — LIFO | Valid Parentheses (LC 20) / Min Stack (LC 155) / Decode String (LC 394) |
| 7.2 | queue | Queue — FIFO | Time Needed to Buy Tickets (LC 2073) / Queue using Two Stacks (LC 232) / binary numbers 1..n via queue (GFG) |
| 7.3 | circular-queue | Circular queue (ring buffer) | wrap-around trace / Design Circular Queue (LC 622) / Find the Winner of the Circular Game (LC 1823) |
| 7.4 | deque | Deque (ArrayDeque) + monotonic deque | palindrome check / first negative in every k-window (GFG) / Sliding Window Maximum (LC 239) |
| 7.5 | monotonic-stack | Monotonic stack | Next Greater Element (LC 496) / Daily Temperatures (LC 739) / Largest Rectangle in Histogram (LC 84) |

### 8. Backtracking — `backtracking`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 8.1 | backtracking-basics | Backtracking — choose, explore, un-choose | Subsets (LC 78) / Letter Combinations of a Phone Number (LC 17) / Subsets II (LC 90) |
| 8.2 | permutations-combinations | Permutations & combinations | Permutations (LC 46) / Combination Sum (LC 39) / Generate Parentheses (LC 22) |
| 8.3 | constraint-backtracking | Grid & constraint backtracking | Rat in a Maze (GFG) / Word Search (LC 79) / N-Queens (LC 51) |

### 9. Trees — `trees`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 9.1 | binary-tree-basics | Binary tree — terms, types, node in memory | count nodes / Same Tree (LC 100) / Symmetric Tree (LC 101) |
| 9.2 | tree-traversals | DFS traversals — pre / in / post | Preorder (LC 144) / Inorder iterative with stack (LC 94) / Build Tree from Preorder + Inorder (LC 105) |
| 9.3 | level-order | Level order (BFS) | Level Order (LC 102) / Right Side View (LC 199) / Zigzag Level Order (LC 103) |
| 9.4 | tree-recursion | Height, balance, diameter — return-value recursion | Max Depth (LC 104) / Balanced Binary Tree (LC 110) / Diameter (LC 543) |
| 9.5 | bst | Binary Search Tree | Search & Insert (LC 700/701) / Validate BST (LC 98) / Delete Node in BST (LC 450) |
| 9.6 | lca | Lowest Common Ancestor | LCA in BST (LC 235) / LCA in Binary Tree (LC 236) / distance between two nodes (GFG) |

### 10. Heap / Priority Queue — `heap`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 10.1 | heap-basics | Heap — complete tree stored in an array, sift up / down | insert into min-heap / extract min / build heap in O(n) |
| 10.2 | priority-queue | PriorityQueue in Kotlin/Java, heap sort | Last Stone Weight (LC 1046) / Heap Sort / Minimum Cost of Ropes (GFG) |
| 10.3 | top-k | Top-K & K-way merge | Kth Largest (LC 215) / K Closest Points (LC 973) / Merge k Sorted Lists (LC 23) |
| 10.4 | two-heaps | Two heaps | running median trace / Find Median from Data Stream (LC 295) / IPO (LC 502) |

### 11. Graphs — `graphs`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 11.1 | graph-basics | Graph — directed/undirected, weighted, adjacency list vs matrix | build adjacency list / Find Center of Star Graph (LC 1791) / Find the Town Judge (LC 997) |
| 11.2 | bfs | BFS | BFS order / shortest path in unweighted graph / Rotting Oranges (LC 994, multi-source) |
| 11.3 | dfs | DFS (+ cycle in undirected graph) | DFS order / Number of Islands (LC 200) / cycle detection in undirected graph |
| 11.4 | topological-sort | Topological sort (+ cycle in directed graph) | Kahn's algorithm / Course Schedule II (LC 210) / directed cycle with 3 colours |
| 11.5 | dijkstra | Dijkstra shortest path | small weighted graph / Network Delay Time (LC 743) / Path With Minimum Effort (LC 1631) |
| 11.6 | union-find | Union-Find (DSU) + Kruskal MST | union/find trace with path compression / Number of Provinces (LC 547) / Min Cost to Connect All Points (LC 1584) |

### 12. Greedy — `greedy`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 12.1 | greedy-basics | Greedy — local best choice, and when it fails | Assign Cookies (LC 455) / Lemonade Change (LC 860) / Jump Game (LC 55) |
| 12.2 | intervals | Intervals — sort + sweep | Merge Intervals (LC 56) / Non-overlapping Intervals (LC 435) / Minimum Railway Platforms (GFG) |
| 12.3 | greedy-classics | Greedy classics | Best Time to Buy & Sell Stock II (LC 122) / Gas Station (LC 134) / Partition Labels (LC 763) |

### 13. Dynamic Programming — `dp`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 13.1 | dp-intro | DP intro — recursion → memo → tabulation → space optimise | Fibonacci 4 ways / Climbing Stairs (LC 70) / Min Cost Climbing Stairs (LC 746) |
| 13.2 | dp-1d | 1D DP | House Robber (LC 198) / Decode Ways (LC 91) / House Robber II (LC 213) |
| 13.3 | dp-grid | Grid DP | Unique Paths (LC 62) / Minimum Path Sum (LC 64) / Maximal Square (LC 221) |
| 13.4 | knapsack-01 | 0/1 knapsack | 0/1 Knapsack / Partition Equal Subset Sum (LC 416) / Target Sum (LC 494) |
| 13.5 | unbounded-knapsack | Unbounded knapsack | Rod Cutting (GFG) / Coin Change (LC 322) / Coin Change II (LC 518 — loop-order trap) |
| 13.6 | dp-strings | DP on strings | LCS (LC 1143) / Longest Palindromic Subsequence (LC 516) / Edit Distance (LC 72) |
| 13.7 | lis | Longest Increasing Subsequence | LIS O(n²) (LC 300) / LIS O(n log n) / Russian Doll Envelopes (LC 354) |

### 14. Trie & Bits (bonus) — `trie-bits`
| # | id | Topic | Examples: easy / medium / tricky |
|---|---|---|---|
| 14.1 | trie | Trie (prefix tree) | Implement Trie (LC 208) / Search Suggestions System (LC 1268) / Replace Words (LC 648) |
| 14.2 | bit-basics | Bits — binary, two's complement, AND / OR / XOR / NOT / shifts | odd/even + check i-th bit / Number of 1 Bits (LC 191) / Power of Two (LC 231) |
| 14.3 | bit-tricks | XOR tricks & bitmasks | Single Number (LC 136) / Missing Number (LC 268) / Subsets via bitmask (LC 78) |

## 9. Added for a beginner (not in the brief)

- **Kotlin & Java toolkit topic** (0.6): IntArray vs List, HashMap, ArrayDeque, PriorityQueue, StringBuilder, Int overflow → Long. The Java tab needs this, and interviews expect fluent collections.
- **Constraints → complexity table** inside 0.5 (e.g. n ≤ 10⁵ → need O(n log n) or better). Biggest interview shortcut.
- **Glossary page** for English words like "amortized", "contiguous", "traverse" — simple Hinglish meaning for each.
- **Patterns page**, built automatically from every topic's keyword signals.
- **"Aaj revise karo"** on home: topics finished 1, 3 and 7 days ago (spaced repetition, uses saved dates).
- **"Socho" callout**: a pause-and-think question; the answer opens on tap (active learning).
- **Variables panel** in every animation (i, j, sum…) — like the Android Studio debugger watch window.
- **Playground page** showing every viz panel, to review the engine.

## 10. Quality gates

| Command | When | What it does |
|---|---|---|
| `npm run validate` | after every topic; runs automatically before build | all schema rules in §5 |
| `npm run check:code` | before marking a topic done | kotlinc/javac compile + run + output match (cached by file hash) |
| `npm run build` | after every chapter | typecheck + validate + static export |

Code rules: Kotlin = top-level functions + `fun main()`. Java = one non-public `class Main` with static methods + `main`. Comments in Hinglish. File ends with a `// Output:` block.

Environment (checked 2026-10-05): Node 24 ✓, git ✓, JDK 25 (Android Studio JBR, has `javac`) ✓, **kotlinc missing**.
→ Step 2 downloads the Kotlin compiler zip into `tools/kotlinc/` (gitignored). `check:code` runs locally only (Vercel has no JDK). `validate` runs on Vercel too.
→ Folder is not a git repo yet; Step 2 runs `git init`.

## 11. Workflow

- **Step 2 — Engine:** scaffold, all components and viz panels, playground, and the Array topic fully done → stop for review.
- **Step 3 — Content:** chapter by chapter. Per topic: yaml + viz + code → `validate` → `check:code` → tick in PROGRESS.md. Per chapter: `build` → commit.
- **Step 4 — Polish:** search, patterns page, cheatsheets, glossary, revision reminders, accessibility + mobile pass, Lighthouse check, deploy config.

## 12. Risks

- Size: 71 topics × 14 sections is big. Expect many sessions. PROGRESS.md "Current" block makes resume cheap.
- Tracer (TS) and Kotlin/Java code could disagree → result-vs-output check (§5).
- YAML indentation mistakes → `validate` reports file + line.
- Graph layouts with user input can look messy → authored positions for default input, circle layout fallback for custom input.
