// Central site configuration. Edit this to update identity + navigation.
export const SITE = {
  name: 'Anant Sudarshan',
  title: 'Anant Sudarshan',
  role: 'Environmental & Energy Economist',
  affiliation: 'University of Warwick · EPIC, University of Chicago',
  description:
    'Anant Sudarshan is an environmental and energy economist. His research spans air pollution, environmental regulation, climate change, energy efficiency, electricity and renewable energy — much of it field-based in India.',
  email: 'anant.sudarshan@gmail.com',
  // Social / profile links shown in the footer & contact.
  links: {
    scholar: 'https://scholar.google.com/citations?user=YFUzDgYAAAAJ',
    cv: '/cv',
  },
} as const;

// Base-path-aware URL helper. With a GitHub Pages project site the app is
// served under /<repo>/, so every internal link must carry that prefix.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export function url(path = '/'): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}` || '/';
}

// Primary navigation.
export const NAV: { label: string; href: string }[] = [
  { label: 'Research', href: '/papers' },
  { label: 'About', href: '/about' },
  { label: 'CV', href: '/cv' },
];
