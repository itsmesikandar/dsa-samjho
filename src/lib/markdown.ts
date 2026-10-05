import { Marked, type Tokens } from 'marked';

const CALLOUT_TITLES: Record<string, string> = {
  yaad: 'Yaad rakhna',
  galti: 'Galti mat karna',
  tip: 'Interview tip',
  socho: 'Socho',
};

const marked = new Marked({ gfm: true });

marked.use({
  renderer: {
    blockquote(this: { parser: { parse(t: Tokens.Generic[]): string } }, token: Tokens.Blockquote) {
      const body = this.parser.parse(token.tokens);
      const m = /^<p>\[!(yaad|galti|tip|socho)\][ \t]*\n?/.exec(body);
      if (!m) return `<blockquote>${body}</blockquote>\n`;
      const kind = m[1];
      const rest = `<p>${body.slice(m[0].length)}`.replace(/^<p><\/p>\s*/, '');
      const title = `<div class="callout-title">${CALLOUT_TITLES[kind]}</div>`;
      if (kind === 'socho') {
        const cut = rest.indexOf('</p>') + 4;
        const question = rest.slice(0, cut);
        const answer = rest.slice(cut).trim();
        const reveal = answer ? `<details><summary>Jawab dekho</summary>${answer}</details>` : '';
        return `<div class="callout callout-socho">${title}${question}${reveal}</div>\n`;
      }
      return `<div class="callout callout-${kind}">${title}${rest}</div>\n`;
    },
    link(this: { parser: { parseInline(t: Tokens.Generic[]): string } }, token: Tokens.Link) {
      const text = this.parser.parseInline(token.tokens);
      const external = /^https?:\/\//.test(token.href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${token.href}"${attrs}>${text}</a>`;
    },
  },
});

/** Content is our own repo files (trusted), so raw HTML is allowed. */
export function renderMarkdown(src: string): string {
  const html = marked.parse(src, { async: false });
  return html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<\/table>/g, '</table></div>');
}

export function renderInline(src: string): string {
  return marked.parseInline(src, { async: false });
}
