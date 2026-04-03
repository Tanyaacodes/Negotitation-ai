export const PRODUCTS = [
  {
    id: 'mannat',
    name: "Shahrukh khan's Mannat",
    msrp: 60000,
    target: 42000,
    icon: '🕌',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.4)'
  },
  {
    id: 'bandana',
    name: "Harsh bhaiya's Bandana",
    msrp: 12000,
    target: 7800,
    icon: '🧢',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.4)'
  },
  {
    id: 'specs',
    name: "Ankur Bhaiya's Specs",
    msrp: 25000,
    target: 16500,
    icon: '👓',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.4)'
  },
  {
    id: 'meloni',
    name: 'Modi ji ki Meloni',
    msrp: 18000,
    target: 12000,
    icon: '🍉',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.4)'
  },
  {
    id: 'kursi',
    name: "Chacha's Kursi",
    msrp: 45000,
    target: 32000,
    icon: '🪑',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.35)'
  },
  {
    id: 'lpg-gf',
    name: '10 LPG gases with gf',
    msrp: 50000,
    target: 36000,
    icon: '🔥',
    color: '#facc15',
    glow: 'rgba(250,204,21,0.35)'
  },
  {
    id: 'brain-for-u',
    name: 'A brain for u',
    msrp: 9000,
    target: 5200,
    icon: '🧠',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.35)'
  },
  {
    id: 'Chicken leg piece',
    name: 'Chicken leg piece',
    msrp: 50000,
    target: 36000,
    icon: '🍗',
    color: '#ff0000',
    glow: 'rgba(255,0,0,0.35)'
  },
];

export const RANDOM_PRODUCT = {
  id: 'random',
  name: 'Surprise Me!',
  msrp: '???',
  target: '???',
  icon: '🎲',
  color: '#f472b6',
  glow: 'rgba(244,114,182,0.3)'
};

export const PRODUCT_MAP = PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

export const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
