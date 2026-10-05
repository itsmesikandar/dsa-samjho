export type Lang = 'kotlin' | 'java';
export const LANGS: Lang[] = ['kotlin', 'java'];
export const LANG_EXT: Record<Lang, string> = { kotlin: 'kt', java: 'java' };
export const LANG_LABEL: Record<Lang, string> = { kotlin: 'Kotlin', java: 'Java' };

export interface ParsedCode {
  code: string;
  markers: Record<string, number>;
  output: string[];
  errors: string[];
}

/** Code shown in the UI: highlighted HTML per line + marker → line index + expected output. */
export interface CodeView {
  lines: string[];
  markers: Record<string, number>;
  output: string[];
}
export type CodeViews = Record<Lang, CodeView>;

const MARKER = /\s*\/\/@([A-Za-z][\w-]*)\s*$/;

export function parseCode(src: string): ParsedCode {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const errors: string[] = [];
  const outIdx = lines.findIndex((l) => /^\/\/\s*Output:\s*$/.test(l.trim()));

  const output: string[] = [];
  if (outIdx === -1) {
    errors.push('"// Output:" block missing (file ke end mein exact output likho)');
  } else {
    for (const l of lines.slice(outIdx + 1)) {
      if (l.trim() === '') continue;
      if (!l.startsWith('//')) {
        errors.push(`"// Output:" ke baad sirf "//" wali lines aani chahiye: "${l}"`);
        continue;
      }
      output.push(l.slice(2).replace(/^ /, '').trimEnd());
    }
    while (output.length && output[output.length - 1] === '') output.pop();
  }

  const body = (outIdx === -1 ? lines : lines.slice(0, outIdx)).map((l) => l.replace(/\t/g, '    '));
  while (body.length && body[body.length - 1].trim() === '') body.pop();

  const markers: Record<string, number> = {};
  body.forEach((raw, i) => {
    let l = raw;
    let m: RegExpExecArray | null;
    while ((m = MARKER.exec(l))) {
      if (m[1] in markers) errors.push(`marker "//@${m[1]}" do baar use hua`);
      markers[m[1]] = i;
      l = l.slice(0, m.index);
    }
    body[i] = l.trimEnd();
  });

  return { code: body.join('\n'), markers, output, errors };
}
