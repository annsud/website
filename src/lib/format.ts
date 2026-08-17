// Split an author list into parts, flagging the site owner so the card can
// bold their name. Adjust `me` if your name renders differently in citations.
export function authorParts(authors: string[], me = 'Sudarshan') {
  return authors.map((name) => ({ name, me: name.includes(me) }));
}

// Peel a leading "R&R" / "revise & resubmit" / "revise and resubmit" status
// off a venue segment so the journal name can be highlighted on its own.
const REVISE_RESUBMIT = /^(r&r|revise\s*(?:&|and)\s*resubmit)\b[,\s]*/i;
const STATUS_ONLY = /^(working paper|in preparation|nber working paper)$/i;
const NOT_JOURNAL = /\b(award|prize|finalist|lead article)\b|^\(?forthcoming\)?$/i;
// Volume, issue, or page-range that follows the journal name.
const AFTER_JOURNAL = /,\s*(?=\d|[IVXLC]+\(|pp\.)/;

export type VenuePart = {
  text: string;
  journal: boolean;
  /** Separator to render before this part (empty for the first). */
  before: string;
};

// Split a venue into highlightable journal names vs. status, volume, and
// awards. "Revise & resubmit, Journal of Political Economy" yields a muted
// status and an accented journal; "American Economic Review, 116(3), …"
// yields the journal name only as the accented part.
export function venueParts(venue: string): VenuePart[] {
  const parts: VenuePart[] = [];
  const push = (text: string, journal: boolean, before: string) => {
    if (text) parts.push({ text, journal, before });
  };

  let foundJournal = false;
  venue
    .split('·')
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((seg, i) => {
      const segBefore = i === 0 ? '' : ' · ';
      const rr = seg.match(REVISE_RESUBMIT);
      let rest = seg;
      let restBefore = segBefore;
      if (rr) {
        push(rr[1], false, segBefore);
        rest = seg.slice(rr[0].length).trim();
        restBefore = ', ';
      }
      if (!rest) return;

      if (STATUS_ONLY.test(rest) || NOT_JOURNAL.test(rest) || foundJournal) {
        push(rest, false, restBefore);
        return;
      }

      const cut = rest.search(AFTER_JOURNAL);
      if (cut !== -1) {
        push(rest.slice(0, cut), true, restBefore);
        push(rest.slice(cut).replace(/^,\s*/, ''), false, ', ');
      } else {
        push(rest, true, restBefore);
      }
      foundJournal = true;
    });

  return parts;
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
