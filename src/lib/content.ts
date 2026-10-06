import fs from 'node:fs';
import path from 'node:path';
import { parseDocument } from 'yaml';
import { z } from 'zod';
import { ChaptersSchema, CheatsheetsSchema, GlossarySchema, TopicSchema, type Chapter, type Cheatsheet, type GlossaryEntry, type Topic } from './schema';
import { parseCode, LANG_EXT, type Lang, type ParsedCode } from './codefile';

export const CONTENT_DIR = path.join(process.cwd(), 'content');
// cache only in production builds; in dev every request re-reads content so new topics and edits show up
const CACHE = process.env.NODE_ENV === 'production';

export function readYaml(file: string): unknown {
  const src = fs.readFileSync(file, 'utf8');
  const doc = parseDocument(src, { prettyErrors: true });
  if (doc.errors.length) {
    throw new Error(`${path.relative(process.cwd(), file)}:\n${doc.errors.map((e) => e.message).join('\n')}`);
  }
  return doc.toJS();
}

let chaptersCache: Chapter[] | null = null;
export function getChapters(): Chapter[] {
  if (!chaptersCache || !CACHE) {
    const r = ChaptersSchema.safeParse(readYaml(path.join(CONTENT_DIR, 'chapters.yaml')));
    if (!r.success) throw new Error(`content/chapters.yaml galat hai:\n${z.prettifyError(r.error)}`);
    chaptersCache = r.data;
  }
  return chaptersCache;
}

export const topicDir = (chapter: string, topic: string) => path.join(CONTENT_DIR, chapter, topic);
export const hasTopic = (chapter: string, topic: string) =>
  fs.existsSync(path.join(topicDir(chapter, topic), 'topic.yaml'));

const topicCache = new Map<string, Topic>();
export function getTopic(chapter: string, topic: string): Topic {
  const key = `${chapter}/${topic}`;
  const cached = CACHE ? topicCache.get(key) : undefined;
  if (cached) return cached;
  const r = TopicSchema.safeParse(readYaml(path.join(topicDir(chapter, topic), 'topic.yaml')));
  if (!r.success) throw new Error(`content/${key}/topic.yaml galat hai:\n${z.prettifyError(r.error)}`);
  if (r.data.meta.id !== topic || r.data.meta.chapter !== chapter) {
    throw new Error(`content/${key}: meta.id / meta.chapter folder ke naam se match nahi karte`);
  }
  topicCache.set(key, r.data);
  return r.data;
}

export function readCodeFile(chapter: string, topic: string, ref: string, lang: Lang): ParsedCode | null {
  const file = path.join(topicDir(chapter, topic), 'code', `${ref}.${LANG_EXT[lang]}`);
  if (!fs.existsSync(file)) return null;
  return parseCode(fs.readFileSync(file, 'utf8'));
}

export interface NavTopic {
  id: string;
  title: string;
  chapter: string;
  available: boolean;
  href: string;
}
export interface NavChapter {
  id: string;
  title: string;
  subtitle: string;
  index: number;
  href: string;
  topics: NavTopic[];
}

let navCache: NavChapter[] | null = null;
export function getNav(): NavChapter[] {
  if (!navCache || !CACHE) {
    navCache = getChapters().map((c, index) => ({
      id: c.id,
      title: c.title,
      subtitle: c.subtitle,
      index,
      href: `/learn/${c.id}/`,
      topics: c.topics.map((t) => ({
        id: t.id,
        title: t.title,
        chapter: c.id,
        available: hasTopic(c.id, t.id),
        href: `/learn/${c.id}/${t.id}/`,
      })),
    }));
  }
  return navCache;
}

export const allTopics = (): NavTopic[] => getNav().flatMap((c) => c.topics);
export const findTopic = (id: string) => allTopics().find((t) => t.id === id);

export function neighbours(topicId: string): { prev?: NavTopic; next?: NavTopic } {
  const list = allTopics();
  const i = list.findIndex((t) => t.id === topicId);
  return { prev: list[i - 1], next: list[i + 1] };
}

function loadList<T>(file: string, schema: z.ZodType<T>): T {
  const r = schema.safeParse(readYaml(path.join(CONTENT_DIR, file)));
  if (!r.success) throw new Error(`content/${file} galat hai:\n${z.prettifyError(r.error)}`);
  return r.data;
}
export const getGlossary = (): GlossaryEntry[] => loadList('glossary.yaml', GlossarySchema);
export const getCheatsheets = (): Cheatsheet[] => loadList('cheatsheets.yaml', CheatsheetsSchema);

/** glossary anchor: "Big-O" → "g-big-o" */
export const termSlug = (term: string) => 'g-' + term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
