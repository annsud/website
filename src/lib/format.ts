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
