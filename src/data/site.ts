/**
 * Every string on the page lives here.
 *
 * Change the copy, the colours or the pricing without touching a component.
 */

export interface NavLink {
  label: string
  href: string
}

export interface Feature {
  title: string
  body: string
  icon: 'palette' | 'contrast' | 'code' | 'figma' | 'alias' | 'moon'
}

export interface Plan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
}

export interface FaqEntry {
  question: string
  answer: string
}

export const site = {
  brand: 'Vellum',
  tagline: 'Design tokens and colour contrast for product teams',
  email: 'hello@example.com',
  handle: 'your-handle',
  year: 2026,
} as const

export const nav: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Playground', href: '#playground' },
  { label: 'Code', href: '#code' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export const hero = {
  badge: 'Vellum 2.0 — now with Figma variable sync',
  title: 'One colour in. A tested design system out.',
  lead: 'Vellum turns a single brand colour into a full tonal palette, checks every foreground and background pair against WCAG 2.2, and hands you CSS custom properties you can ship today.',
  primaryCta: { label: 'Try the playground', href: '#playground' },
  secondaryCta: { label: 'See how it works', href: '#code' },
  note: 'Free for small teams · No credit card · Nothing leaves your browser',
} as const

export const logos = ['Northwind', 'Lumen', 'Kettle', 'Arcadia', 'Fieldnote', 'Perihelion'] as const

export const valueProps = [
  {
    title: 'One source of truth',
    body: 'Tokens live in a single library that every platform reads from — CSS, Figma, iOS, Android. Change a value once and it lands everywhere.',
    icon: 'layers' as const,
  },
  {
    title: 'Contrast checked for you',
    body: 'Every pair that ships is measured against WCAG 2.2 AA and AAA before it reaches a screen reader. Failures are flagged at the source, not in an audit.',
    icon: 'shield' as const,
  },
  {
    title: 'Exports that just work',
    body: 'CSS custom properties, JSON, Swift and Kotlin. Nothing to configure, nothing to hand-maintain, no plugin to keep up to date.',
    icon: 'download' as const,
  },
]

export const features: Feature[] = [
  {
    title: 'Tonal palettes',
    body: 'Ten steps per colour, generated from a single brand hex and tuned so every tint and shade still reads as the same colour.',
    icon: 'palette',
  },
  {
    title: 'Contrast auditing',
    body: 'Every foreground and background pair is measured against WCAG 2.2 AA and AAA, with the failing pairs pointed at before they ship.',
    icon: 'contrast',
  },
  {
    title: 'CSS custom properties',
    body: 'Export a token file that drops straight into your stylesheet. Light and dark themes, semantic aliases, no build step required.',
    icon: 'code',
  },
  {
    title: 'Figma variables',
    body: 'Push a palette into Figma as variables, with modes for light and dark. Your designers and your engineers stay on the same numbers.',
    icon: 'figma',
  },
  {
    title: 'Semantic aliases',
    body: 'Map raw colour steps to roles — surface, border, text, accent — so a theme can change without touching a single component.',
    icon: 'alias',
  },
  {
    title: 'Dark mode, solved',
    body: 'Vellum derives a dark theme from the same source colour, re-checking contrast for both modes instead of assuming one is fine.',
    icon: 'moon',
  },
]

export const playground = {
  eyebrow: 'Playground',
  title: 'Try it with your own colour',
  lead: 'Pick a base colour and watch Vellum build the scale, check the contrast and write the CSS. Everything below runs in your browser — no colour is uploaded, nothing is stored.',
  defaultColour: '#7c5cff',
  tokenName: 'vellum',
  surfaces: [
    { id: 'light', label: 'Light surface', hex: '#ffffff' },
    { id: 'dark', label: 'Dark surface', hex: '#0e0f18' },
  ],
} as const

export const code = {
  eyebrow: 'How it works',
  title: 'The same idea, in plain HTML and CSS — or in React',
  lead: 'Vellum is built with the same stack you already use. The token output is plain CSS, so it works with whatever you build in.',
  tabs: [
    {
      id: 'html',
      label: 'HTML & CSS',
      filename: 'tokens.css',
      code: `:root {
  --vellum-50:  #f4f1ff;
  --vellum-500: #7c5cff;
  --vellum-900: #2b1a5e;

  --surface: var(--vellum-50);
  --accent:  var(--vellum-500);
  --text:    var(--vellum-900);
}

.button {
  background: var(--accent);
  color: #ffffff;
  border-radius: 10px;
}`,
    },
    {
      id: 'react',
      label: 'React',
      filename: 'Button.tsx',
      code: `export function Button({ children, ...props }) {
  return (
    <button
      className="button"
      style={{
        background: 'var(--accent)',
        color: 'var(--accent-contrast)',
      }}
      {...props}
    >
      {children}
    </button>
  )
}`,
    },
    {
      id: 'js',
      label: 'JavaScript',
      filename: 'tokens.js',
      code: `export const tokens = {
  vellum: {
    50: '#f4f1ff',
    500: '#7c5cff',
    900: '#2b1a5e',
  },
}

document.documentElement.style
  .setProperty('--accent', tokens.vellum[500])`,
    },
  ],
} as const

export const stats = [
  { value: 2400, decimals: 0, suffix: '+', label: 'Teams shipping with Vellum' },
  { value: 1400000, decimals: 0, suffix: '', label: 'Contrast checks a month' },
  { value: 99.9, decimals: 1, suffix: '%', label: 'Uptime over the last 12 months' },
  { value: 42, decimals: 0, suffix: '', label: 'Tokens generated per palette' },
] as const

export const pricing = {
  eyebrow: 'Pricing',
  title: 'Priced per project, not per seat',
  lead: 'Start free. Pay when a palette goes into production. Every plan includes the contrast checker — it is the point of the product.',
  plans: [
    {
      name: 'Hobby',
      price: 'Free',
      period: 'forever',
      description: 'For side projects and the first version of a product.',
      features: ['1 project', '3 palettes', 'Full contrast checker', 'CSS and JSON export'],
      cta: 'Start free',
    },
    {
      name: 'Studio',
      price: '$12',
      period: 'per month',
      description: 'For teams shipping a real product.',
      features: [
        'Unlimited projects and palettes',
        'Semantic aliases and themes',
        'Figma variable sync',
        'Contrast reports in CI',
        'Swift and Kotlin exports',
      ],
      cta: 'Start a trial',
      featured: true,
    },
    {
      name: 'Company',
      price: '$39',
      period: 'per seat / month',
      description: 'For organisations with a shared brand.',
      features: [
        'Everything in Studio',
        'Shared libraries and permissions',
        'SSO and audit logs',
        'Custom token formats',
        'Priority support',
      ],
      cta: 'Talk to us',
    },
  ] satisfies Plan[],
} as const

export const testimonial = {
  quote:
    'We replaced three spreadsheets and a Figma library that nobody trusted. Vellum is now the only place a colour is allowed to enter production.',
  name: 'Priya Raghunathan',
  role: 'Design Systems Lead, Northwind',
  initials: 'PR',
} as const

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions people actually ask',
  lead: 'Including the one about whether this replaces your design system. It does not.',
  items: [
    {
      question: 'Does Vellum replace our design system?',
      answer:
        'No — it is the source your design system is generated from. You keep your components, your naming and your documentation. Vellum makes sure the colours underneath them are consistent and that every pair meets the contrast level you claim it does.',
    },
    {
      question: 'How does the contrast checking work?',
      answer:
        'Every foreground and background pair is measured using the WCAG 2.2 relative-luminance formula, then graded against the AA and AAA thresholds for both normal and large text. The maths runs in the browser, so a palette never has to leave your machine to be checked.',
    },
    {
      question: 'Can I use Vellum without Figma?',
      answer:
        'Yes. Figma sync is optional. The core of the product is generating palettes and checking contrast, and the output is plain CSS custom properties, JSON, Swift or Kotlin. If your designers are not in Figma, nothing else changes.',
    },
    {
      question: 'What happens to our data?',
      answer:
        'Nothing is uploaded. Palettes are generated and checked entirely in the browser, and the library only ever leaves when you export it. On the hosted version the account data is encrypted at rest and we have never sold or shared it.',
    },
    {
      question: 'Can I self-host it?',
      answer:
        'Yes. The token compiler and the contrast checker are published as a package with no runtime dependencies, so you can run them inside your own build and your own CI. The Company plan includes the self-hosting guide and the admin tooling.',
    },
    {
      question: 'What if our brand colour does not pass contrast?',
      answer:
        'Plenty of brand colours do not — roughly one in three fails AA against white. Vellum keeps your colour exactly as it is and derives the working steps around it, so you never have to change the brand to make the interface accessible.',
    },
  ] satisfies FaqEntry[],
} as const

export const cta = {
  title: 'Ship a colour system that holds up',
  lead: 'Start with one brand colour. Leave with a palette, a contrast report and the CSS to ship.',
  primary: { label: 'Start for free', href: '#playground' },
  secondary: { label: 'Talk to us', href: `mailto:${site.email}` },
} as const

export const footer = {
  blurb:
    'Design tokens and colour contrast for product teams. Built by a small team that got tired of arguing about hex values.',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Playground', href: '#playground' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Changelog', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'WCAG 2.2 guide', href: '#' },
        { label: 'Token format', href: '#' },
        { label: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: `mailto:${site.email}` },
      ],
    },
  ],
  legal:
    'Vellum is a fictional product built as a front-end portfolio piece. Every colour, number and quote on this page is illustrative.',
} as const
