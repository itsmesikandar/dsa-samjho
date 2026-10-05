import { createHighlighter, type Highlighter } from 'shiki';
import { LANGS, type CodeViews, type Lang } from './codefile';
import { readCodeFile } from './content';

let highlighter: Promise<Highlighter> | null = null;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({ themes: ['github-light', 'github-dark'], langs: ['kotlin', 'java'] }));

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export async function highlightLines(code: string, lang: Lang): Promise<string[]> {
  const h = await getHighlighter();
  const { tokens } = h.codeToTokens(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  });
  return tokens.map((line) =>
    line
      .map((t) => {
        const style = Object.entries(t.htmlStyle ?? {})
          .map(([k, v]) => `${k}:${v}`)
          .join(';');
        return `<span style="${style}">${esc(t.content)}</span>`;
      })
      .join(''),
  );
}

export async function getCodeViews(chapter: string, topic: string, ref: string): Promise<CodeViews> {
  const entries = await Promise.all(
    LANGS.map(async (lang) => {
      const parsed = readCodeFile(chapter, topic, ref, lang);
      if (!parsed) throw new Error(`content/${chapter}/${topic}/code/${ref} ka ${lang} file missing`);
      return [lang, { lines: await highlightLines(parsed.code, lang), markers: parsed.markers, output: parsed.output }] as const;
    }),
  );
  return Object.fromEntries(entries) as CodeViews;
}
