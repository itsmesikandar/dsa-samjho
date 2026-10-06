// Fails (exit 1) if any topic is missing a section, has bad data, broken code refs, or broken animations.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONTENT_DIR, getChapters, getCheatsheets, getGlossary, getTopic, hasTopic, readCodeFile, termSlug } from '../src/lib/content';
import { LANGS, type ParsedCode } from '../src/lib/codefile';
import type { Topic } from '../src/lib/schema';
import {
  defaultInputs,
  formatInput,
  isTracer,
  MAX_FRAMES,
  mulberry32,
  parseInputs,
  randomInputs,
  runTracer,
  type Tracer,
} from '../src/components/viz/engine/tracer';

const errors: string[] = [];
const warnings: string[] = [];
const err = (where: string, msg: string) => errors.push(`✗ ${where}: ${msg}`);
const warn = (where: string, msg: string) => warnings.push(`! ${where}: ${msg}`);

const FUZZ_RUNS = 25;
const seedOf = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);

interface Use {
  tracer: string;
  where: string;
  minFrames: number;
  code?: Record<string, ParsedCode>;
}

function checkTracer(def: Tracer, use: Use) {
  const { where } = use;
  // default input must be valid per its own spec
  const raw = Object.fromEntries(def.inputs.map((s) => [s.name, formatInput(s, s.default)]));
  const parsed = parseInputs(def.inputs, raw);
  if (!parsed.ok) return err(where, `default input invalid: ${JSON.stringify(parsed.errors)}`);
  const checkMsg = def.check?.(parsed.value);
  if (checkMsg) return err(where, `default input check() fail: ${checkMsg}`);

  let res;
  try {
    res = runTracer(def, defaultInputs(def.inputs));
  } catch (e) {
    return err(where, `default input pe crash: ${(e as Error).stack ?? e}`);
  }
  if (res.error) return err(where, res.error);
  const n = res.frames.length;
  if (n < use.minFrames || n > MAX_FRAMES) err(where, `${n} frames (chahiye ${use.minFrames}–${MAX_FRAMES})`);
  res.frames.forEach((f, i) => {
    if (!f.caption || f.caption.trim().length < 8) err(where, `frame ${i + 1}: caption khaali/bahut chhota`);
    if (!Array.isArray(f.panels) || f.panels.length === 0) err(where, `frame ${i + 1}: koi panel nahi`);
    if (f.line && use.code) {
      for (const [lang, pc] of Object.entries(use.code)) {
        if (!(f.line in pc.markers)) err(where, `frame ${i + 1}: line marker "//@${f.line}" ${lang} code mein nahi hai`);
      }
    }
  });
  if (use.code) {
    for (const [lang, pc] of Object.entries(use.code)) {
      if (pc.output[0] !== res.result) {
        err(where, `tracer result "${res.result}" != ${lang} output ki pehli line "${pc.output[0] ?? ''}"`);
      }
    }
    if (!res.frames.some((f) => f.line)) warn(where, 'kisi frame mein `line` nahi — code-sync nahi hoga');
  }

  // fuzz with random valid inputs
  const rnd = mulberry32(seedOf(where));
  let ran = 0;
  for (let attempt = 0; attempt < 400 && ran < FUZZ_RUNS && def.inputs.length > 0; attempt++) {
    const input = randomInputs(def.inputs, rnd);
    if (def.check?.(input)) continue;
    ran++;
    try {
      const r = runTracer(def, input);
      if (r.error) {
        err(where, `fuzz input ${JSON.stringify(input)}: ${r.error} (input limits chhoti karo)`);
        break;
      }
    } catch (e) {
      err(where, `fuzz input ${JSON.stringify(input)} pe crash: ${(e as Error).message}`);
      break;
    }
  }
  if (def.inputs.length > 0 && ran < FUZZ_RUNS) warn(where, `sirf ${ran} valid random inputs mile (check() bahut strict?)`);
}

async function loadViz(file: string, where: string): Promise<Record<string, unknown> | null> {
  if (!fs.existsSync(file)) {
    err(where, 'viz.ts missing');
    return null;
  }
  try {
    return (await import(pathToFileURL(file).href)) as Record<string, unknown>;
  } catch (e) {
    err(where, `viz.ts import fail: ${(e as Error).message}`);
    return null;
  }
}

async function main() {
  let chapters;
  try {
    chapters = getChapters();
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }

  const allIds = new Map<string, string>();
  for (const c of chapters) {
    for (const t of c.topics) {
      if (allIds.has(t.id)) err('chapters.yaml', `topic id "${t.id}" do baar hai`);
      allIds.set(t.id, c.id);
    }
  }

  // folders that are not in chapters.yaml
  for (const ch of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!ch.isDirectory()) continue;
    for (const tp of fs.readdirSync(path.join(CONTENT_DIR, ch.name), { withFileTypes: true })) {
      if (tp.isDirectory() && allIds.get(tp.name) !== ch.name) err(`content/${ch.name}/${tp.name}`, 'folder chapters.yaml mein listed nahi hai');
    }
  }

  let checked = 0;
  for (const c of chapters) {
    for (const ref of c.topics) {
      if (!hasTopic(c.id, ref.id)) continue;
      const key = `${c.id}/${ref.id}`;
      let t: Topic;
      try {
        t = getTopic(c.id, ref.id);
      } catch (e) {
        err(key, (e as Error).message);
        continue;
      }
      checked++;

      const codeCache = new Map<string, Record<string, ParsedCode> | undefined>();
      const code = (r: string) => {
        if (!codeCache.has(r)) {
          const out: Record<string, ParsedCode> = {};
          let ok = true;
          for (const lang of LANGS) {
            const pc = readCodeFile(c.id, ref.id, r, lang);
            if (!pc) {
              err(key, `code/${r}.${lang === 'kotlin' ? 'kt' : 'java'} missing`);
              ok = false;
              continue;
            }
            pc.errors.forEach((m) => err(`${key}/code/${r} (${lang})`, m));
            if (pc.output.length === 0) err(`${key}/code/${r} (${lang})`, '"// Output:" khaali hai');
            out[lang] = pc;
          }
          codeCache.set(r, ok ? out : undefined);
        }
        return codeCache.get(r);
      };

      t.code.forEach((cb) => code(cb.file));
      const uses: Use[] = [
        { tracer: t.visual.viz.tracer, where: `${key} visual`, minFrames: 1 },
        { tracer: t.how.viz.tracer, where: `${key} how`, minFrames: 2, code: code(t.how.code) },
        ...t.examples.map((e) => ({ tracer: e.viz.tracer, where: `${key} example "${e.id}"`, minFrames: 2, code: code(e.code) })),
      ];

      const mod = await loadViz(path.join(CONTENT_DIR, c.id, ref.id, 'viz.ts'), key);
      if (mod) {
        for (const u of uses) {
          const def = mod[u.tracer];
          if (!isTracer(def)) err(u.where, `tracer "${u.tracer}" viz.ts mein nahi mila`);
          else checkTracer(def, u);
        }
        const used = new Set(uses.map((u) => u.tracer));
        for (const name of Object.keys(mod)) if (isTracer(mod[name]) && !used.has(name)) warn(key, `tracer "${name}" kahin use nahi hua`);
      }

      const ids = [...t.meta.prereqs, ...t.connections.related.map((r) => r.id), ...t.connections.usedLater.map((r) => r.id)];
      for (const id of ids) if (!allIds.has(id)) err(key, `topic id "${id}" chapters.yaml mein nahi hai`);
    }
  }

  // glossary + cheatsheets (pages /glossary, /cheatsheets)
  try {
    const slugs = new Set<string>();
    for (const g of getGlossary()) {
      const slug = termSlug(g.term);
      if (slugs.has(slug)) err('glossary.yaml', `"${g.term}" do baar hai`);
      slugs.add(slug);
      const ch = g.topic && allIds.get(g.topic);
      if (g.topic && !ch) err('glossary.yaml', `"${g.term}": topic "${g.topic}" chapters.yaml mein nahi hai`);
      else if (g.topic && ch && !hasTopic(ch, g.topic)) err('glossary.yaml', `"${g.term}": topic "${g.topic}" abhi likha nahi gaya`);
    }
  } catch (e) {
    err('glossary.yaml', (e as Error).message);
  }
  try {
    const ids = getCheatsheets().map((c) => c.id);
    if (new Set(ids).size !== ids.length) err('cheatsheets.yaml', 'id do baar hai');
  } catch (e) {
    err('cheatsheets.yaml', (e as Error).message);
  }

  const demo = await loadViz(path.join(process.cwd(), 'src/components/viz/demo.ts'), 'playground');
  if (demo) for (const [name, def] of Object.entries(demo)) if (isTracer(def)) checkTracer(def, { tracer: name, where: `playground ${name}`, minFrames: 1 });

  warnings.forEach((w) => console.warn(w));
  if (errors.length) {
    errors.forEach((e) => console.error(e));
    console.error(`\nvalidate: ${errors.length} error(s) in ${checked} topic(s).`);
    process.exit(1);
  }
  console.log(`validate: ${checked} topic(s) OK${warnings.length ? `, ${warnings.length} warning(s)` : ''}.`);
}

main();
