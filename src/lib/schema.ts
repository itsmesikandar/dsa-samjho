import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case id chahiye (jaise "two-sum")');
const md = z.string().trim().min(20, 'bahut chhota hai — kam se kam 20 characters likho');
const line = z.string().trim().min(2, 'khaali nahi ho sakta');
const bigO = z.string().trim().min(3);
const vizRef = z.strictObject({ tracer: z.string().regex(/^[A-Za-z_]\w*$/, 'tracer = viz.ts ka export name') });
const codeRef = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'code ref = code/ folder ki file ka naam (bina extension)');
const platform = z.enum(['LeetCode', 'GFG', 'Custom']);

export const ChaptersSchema = z
  .array(
    z.strictObject({
      id,
      title: line,
      subtitle: line,
      topics: z.array(z.strictObject({ id, title: line })).min(1),
    }),
  )
  .min(1);

const ExampleSchema = z.strictObject({
  id,
  level: z.enum(['easy', 'medium', 'tricky']),
  title: line,
  source: z
    .strictObject({ name: line, platform, url: z.url().optional() })
    .optional(),
  problem: md,
  intuition: md,
  dryRun: md,
  viz: vizRef,
  code: codeRef,
  complexity: z.strictObject({ time: bigO, space: bigO, why: line }),
});

const LEVEL_RANK = { easy: 0, medium: 1, tricky: 2 } as const;

export const TopicSchema = z
  .strictObject({
    meta: z.strictObject({
      id,
      chapter: id,
      title: line,
      subtitle: line,
      level: z.enum(['beginner', 'intermediate', 'advanced']),
      minutes: z.number().int().min(5).max(120),
      prereqs: z.array(id),
      tags: z.array(line).min(1),
    }),
    what: z.strictObject({ body: md, analogy: md }),
    why: z.strictObject({ body: md }),
    visual: z.strictObject({ body: md, viz: vizRef }),
    how: z.strictObject({ body: md, viz: vizRef, code: codeRef }),
    operations: z
      .array(z.strictObject({ op: line, time: bigO, space: bigO, why: line }))
      .min(3),
    code: z.array(z.strictObject({ title: line, file: codeRef, note: md.optional() })).min(1),
    examples: z.array(ExampleSchema).min(3, 'kam se kam 3 examples chahiye'),
    when: z.strictObject({
      use: z.array(line).min(2),
      avoid: z.array(line).min(2),
      signals: z.array(z.strictObject({ keyword: line, think: line })).min(3),
    }),
    realWorld: z.array(z.strictObject({ where: line, how: line })).min(3),
    mistakes: z
      .array(
        z.strictObject({
          title: line,
          type: z.enum(['off-by-one', 'null', 'empty', 'overflow', 'logic', 'other']),
          wrong: md.optional(),
          right: md,
        }),
      )
      .min(4),
    interview: z.strictObject({
      questions: z
        .array(z.strictObject({ q: line, a: md, followUp: z.boolean().optional() }))
        .min(8)
        .max(12),
      mayAsk: z.array(line).min(3),
    }),
    practice: z.array(
      z.strictObject({
        name: line,
        platform,
        num: z.number().int().positive().optional(),
        url: z.url().optional(),
        level: z.enum(['easy', 'medium', 'hard']),
        pattern: line,
        hint: line,
      }),
    ),
    revision: z.strictObject({
      summary: z.array(line).length(5, 'summary mein exactly 5 lines'),
      cheatsheet: md,
      quiz: z
        .array(
          z.strictObject({
            q: line,
            options: z.array(z.string().trim().min(1)).min(2).max(4),
            answer: z.number().int().min(0),
            explain: line,
          }),
        )
        .length(5, 'exactly 5 quiz questions'),
    }),
    connections: z.strictObject({
      related: z.array(z.strictObject({ id, why: line })).min(1),
      usedLater: z.array(z.strictObject({ id, how: line })).min(1),
    }),
  })
  .superRefine((t, ctx) => {
    const levels = t.examples.map((e) => e.level);
    for (const need of ['easy', 'medium', 'tricky'] as const) {
      if (!levels.includes(need)) ctx.addIssue({ code: 'custom', path: ['examples'], message: `"${need}" level ka example missing` });
    }
    for (let i = 1; i < levels.length; i++) {
      if (LEVEL_RANK[levels[i]] < LEVEL_RANK[levels[i - 1]]) {
        ctx.addIssue({ code: 'custom', path: ['examples', i, 'level'], message: 'examples easy → medium → tricky order mein rakho' });
      }
    }
    const ids = new Set<string>();
    t.examples.forEach((e, i) => {
      if (ids.has(e.id)) ctx.addIssue({ code: 'custom', path: ['examples', i, 'id'], message: `duplicate example id "${e.id}"` });
      ids.add(e.id);
    });
    const count = (lvl: string) => t.practice.filter((p) => p.level === lvl).length;
    const want = { easy: 3, medium: 3, hard: 2 } as const;
    for (const [lvl, n] of Object.entries(want)) {
      if (count(lvl) !== n) ctx.addIssue({ code: 'custom', path: ['practice'], message: `practice: ${n} ${lvl} chahiye, mile ${count(lvl)}` });
    }
    t.revision.quiz.forEach((q, i) => {
      if (q.answer >= q.options.length) {
        ctx.addIssue({ code: 'custom', path: ['revision', 'quiz', i, 'answer'], message: 'answer index options ke bahar hai' });
      }
    });
  });

export type Chapter = z.infer<typeof ChaptersSchema>[number];
export type Topic = z.infer<typeof TopicSchema>;
export type Example = Topic['examples'][number];

// content/glossary.yaml — English term → simple Hinglish meaning
export const GlossarySchema = z
  .array(
    z.strictObject({
      term: line,
      /** doosre naam / short form (search mein bhi milte hain) */
      aka: z.array(line).optional(),
      meaning: z.string().trim().min(10, 'meaning thoda aur likho'),
      example: line.optional(),
      /** is word ko samajhne ke liye best topic */
      topic: id.optional(),
    }),
  )
  .min(20);

// content/cheatsheets.yaml — /cheatsheets page ke upar wale tables
export const CheatsheetsSchema = z
  .array(z.strictObject({ id, title: line, intro: line.optional(), body: md }))
  .min(1);

export type GlossaryEntry = z.infer<typeof GlossarySchema>[number];
export type Cheatsheet = z.infer<typeof CheatsheetsSchema>[number];
