// Split an author list into parts, flagging the site owner so the card can
// bold their name. Adjust `me` if your name renders differently in citations.
export function authorParts(authors: string[], me = 'Sudarshan') {
  return authors.map((name) => ({ name, me: name.includes(me) }));
}

// A paper that is "revise & resubmit" at a journal is near-accepted, so its
// status + journal deserve the same accent treatment as a published venue —
// not the muted styling of an ordinary working paper. Matches "R&R" and the
// spelled-out "revise & resubmit" / "revise and resubmit" forms.
const REVISE_RESUBMIT = /r&r|revise\s*(?:&|and)\s*resubmit/i;

// Split a venue string on the "·" separator and flag each segment as an R&R
// status. Lets a card show e.g. "Working paper" muted but "R&R, Journal of
// Political Economy" in accent. Non-R&R venues yield a single muted segment.
export function venueParts(venue: string): { text: string; rr: boolean }[] {
  return venue
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text, rr: REVISE_RESUBMIT.test(text) }));
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
