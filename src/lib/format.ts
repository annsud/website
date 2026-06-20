// Split an author list into parts, flagging the site owner so the card can
// bold their name. Adjust `me` if your name renders differently in citations.
export function authorParts(authors: string[], me = 'Sudarshan') {
  return authors.map((name) => ({ name, me: name.includes(me) }));
}

export function statusLabel(status: string): string {
  return (
    { published: 'Published', working: 'Working paper', progress: 'In progress' }[
      status
    ] ?? status
  );
}

// Build a BibTeX entry from a paper's frontmatter, so any paper can be cited
// even without a hand-written `bibtex` block.
export function buildBibtex(data: {
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  status?: string;
  bibtex?: string;
}): string {
  if (data.bibtex) return data.bibtex.trim();
  const lastName = (data.authors[0] ?? 'anon').trim().split(/\s+/).pop() ?? 'anon';
  const firstWord = (data.title.match(/[A-Za-z]+/)?.[0] ?? 'paper').toLowerCase();
  const key = `${lastName.toLowerCase()}${data.year}${firstWord}`;
  const author = data.authors.join(' and ');
  const published = data.status === 'published';
  const lines = [
    `@${published ? 'article' : 'unpublished'}{${key},`,
    `  title   = {${data.title}},`,
    `  author  = {${author}},`,
  ];
  if (data.venue) {
    lines.push(
      published ? `  journal = {${data.venue}},` : `  note    = {${data.venue}},`
    );
  }
  lines.push(`  year    = {${data.year}}`);
  lines.push('}');
  return lines.join('\n');
}

// Author byline that always leads with Anant, then "(with …)". Author lists are
// alphabetical, so listing them verbatim can wrongly imply he is the last author.
export function byline(authors: string[], me = 'Sudarshan') {
  const self = authors.find((a) => a.includes(me)) ?? authors[0] ?? '';
  const others = authors.filter((a) => !a.includes(me));
  return { self, others };
}
