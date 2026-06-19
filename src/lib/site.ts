// Central site configuration. Edit this to update identity + navigation.
export const SITE = {
  name: 'Anant Sudarshan',
  title: 'Anant Sudarshan',
  role: '',
  affiliation: 'University of Warwick · Energy Policy Institute, University of Chicago',
  description:
    'I am an environmental and energy economist. My research focuses on topics such as air pollution, environmental regulation, climate change, ecosystems, energy efficiency, electricity and renewable energy — much of it field-based in India. I am a Professor at the Department of Economics at the University of Warwick.',
  email: 'anant.sudarshan AT warwick.ac.uk',
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
