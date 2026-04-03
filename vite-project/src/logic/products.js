export const PRODUCTS = [
  {
    id: 'mannat',
    name: "Shahrukh khan's Mannat",
    desc: 'Aapka request… aur seller ki patience.',
    tagline: 'Mannat-mode: aaj discount pakka!',
    msrp: 60000,
    target: 42000,
    icon: '🕌',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.4)',
    diff: 'MEDIUM',
    mood: 'Savage'
  },
  {
    id: 'bandana',
    name: "Harsh bhaiya's Bandana",
    desc: 'Bandana ka price fixed nahi… negotiation se fix hota hai.',
    tagline: 'First reason, then deal!',
    msrp: 12000,
    target: 7800,
    icon: '🧢',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.4)',
    diff: 'EASY',
    mood: 'Bakchodi Mode on'
  },
  {
    id: 'specs',
    name: "Ankur Bhaiya's Specs",
    desc: 'Specs ke liye logic chahiye… warna seller nahi jhunega.',
    tagline: 'Data do, price lo.',
    msrp: 25000,
    target: 16500,
    icon: '👓',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.4)',
    diff: 'MEDIUM',
    mood: 'Guide Mode on'
  },
  {
    id: 'meloni',
    name: 'Modi ji ki Meloni',
    desc: 'Urgency strong rakho… seller "yes" bol dega.',
    tagline: 'Respect + rush = surprise cut!',
    msrp: 18000,
    target: 12000,
    icon: '🍉',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.4)',
    diff: 'EASY',
    mood: 'Love is in the air'
  },
  {
    id: 'kursi',
    name: "Chacha's Kursi",
    desc: 'Kursi ka floor soft nahi… offer smart banao.',
    tagline: 'Chacha-style roast se deals!',
    msrp: 45000,
    target: 32000,
    icon: '🪑',
    color: '#f472b6',
    glow: 'rgba(244,114,182,0.35)',
    diff: 'HARD',
    mood: 'Aura+++'
  },
  {
    id: 'lpg-gf',
    name: '10 LPG gases with gf',
    desc: 'Combo deal: negotiation + safety vibes.',
    tagline: 'Cash vibes zyada chalti hai.',
    msrp: 50000,
    target: 36000,
    icon: '🔥',
    color: '#facc15',
    glow: 'rgba(250,204,21,0.35)',
    diff: 'MEDIUM',
    mood: 'Roast Mode on'
  },
  {
    id: 'brain-for-u',
    name: 'A brain for u',
    desc: 'Seller ko logic do… deal automatically ho jayegi.',
    tagline: 'Smart offer = quick close.',
    msrp: 9000,
    target: 5200,
    icon: '🧠',
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.35)',
    diff: 'EASY',
    mood: 'Friendly Mode on'
  },
];

export const RANDOM_PRODUCT = {
  id: 'random',
  name: 'Surprise Me!',
  desc: 'Let fate decide your challenge',
  tagline: 'Dare to try your luck?',
  msrp: '???',
  target: '???',
  icon: '🎲',
  color: '#f472b6',
  glow: 'rgba(244,114,182,0.3)',
  diff: '???',
  mood: 'Mystery '
};

export const diffColor = { EASY: '#4ade80', MEDIUM: '#facc15', HARD: '#f87171' };

export const PRODUCT_MAP = PRODUCTS.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});

export const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
