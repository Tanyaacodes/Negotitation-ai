import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, User, Lightbulb, X, Home } from 'lucide-react';
import { diffColor, fmt } from '../logic/products';

// ✅ FIX: PRODUCTS array properly wrap kiya
const PRODUCTS = [
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
    name: "Ankur BHaiya's Specs",
    desc: 'Specs ke liye logic chahiye… warna seller nahi jhukega.',
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
    desc: 'Urgency strong rakho… seller “yes” bol dega.',
    tagline: 'Respect + rush = surprise cut!',
    msrp: 18000,
    target: 12000,
    icon: '🍉',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.4)',
    diff: 'EASY',
    mood: 'Love in the air'
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
    mood: 'Playful'
  },
];

const RANDOM_PRODUCT = {
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
  mood: 'Mystery'
};

// ✅ ONLY ONE export
export default function ProductPicker() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'Guest';
  const [showTips, setShowTips] = useState(false);

  const pick = (id) => {
    localStorage.setItem('selectedProduct', id);
    navigate('/game');
  };

  const tips = [
    '💡 "Main student hu" — empathy triggers seller generosity!',
    '🎯 "Market me sasta hai" — logic arguments work wonders!',
    '⚡ "Cash de dunga abhi" — urgency seals the deal!',
    '⚠️ Lowball offers make shopkeeper angry!',
    '🃏 Bluff once per game for surprise results!',
    '😊 Each product has unique shopkeeper personality!',
    '📈 Start with 40% below MSRP for best results',
    '🔄 Mix tactics: empathy + logic + urgency',
    '🎪 Patience drops 8% per round, be quick!',
    '🏆 Lower final price = higher leaderboard rank'
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="picker-root">
      {/* Navbar */}
      <nav className="picker-navbar glass-morphism">
        <div className="navbar-left">
          <button className="navbar-btn" onClick={() => navigate('/')}>
            <Home size={18} />
            <span>Home</span>
          </button>
          <button className="navbar-btn" onClick={() => navigate('/leaderboard')}>
            <Trophy size={18} />
            <span>Leaderboard</span>
          </button>
        </div>
        
        <div className="navbar-center">
          <h1 className="navbar-title">Choose Your Battle</h1>
        </div>
        
        <div className="navbar-right">
          <div className="player-info">
            <User size={16} />
            <span>{playerName}</span>
          </div>
          <button className="navbar-btn tips-btn" onClick={() => setShowTips(true)}>
            <Lightbulb size={18} />
            <span>Tips</span>
          </button>
        </div>
      </nav>

      {/* Random Tip Bar */}
      <div className="tip-bar glass-morphism">
        <Lightbulb size={16} className="tip-icon" />
        <span className="tip-text">{randomTip}</span>
      </div>

      <div className="picker-grid-wrap">
        <div className="picker-products-grid">
          {[...PRODUCTS, RANDOM_PRODUCT].map((p) => (
            <motion.div
              key={p.id}
              className="product-tile"
              style={{
                '--prod-color': p.color,
                '--prod-glow': p.glow
              }}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className="product-tile-glow" />
              <div className="product-tile-icon">{p.icon}</div>
              <h3 className="product-tile-name">{p.name}</h3>
              <p className="product-tile-desc">{p.desc}</p>
              <div className="product-tile-prices">
                <div className="price-row">
                  <span className="price-label">MSRP:</span>
                  <span className="price-value" style={{ color: p.color }}>
                    ₹{typeof p.msrp === 'number' ? p.msrp.toLocaleString() : p.msrp}
                  </span>
                </div>
                <div className="price-row">
                  <span className="price-label">Target:</span>
                  <span className="price-target">
                    ₹{typeof p.target === 'number' ? p.target.toLocaleString() : p.target}
                  </span>
                </div>
              </div>
              <button
                className="product-tile-btn"
                onClick={() => pick(p.id)}
                style={{ backgroundColor: p.color }}
              >
                {p.id === 'random' ? 'Surprise Me!' : 'Bargain Now →'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tips Modal */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            className="tips-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTips(false)}
          >
            <motion.div
              className="tips-modal glass-morphism"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="tips-modal-header">
                <h2>🎯 Pro Negotiation Tips</h2>
                <button className="tips-close-btn" onClick={() => setShowTips(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="tips-modal-content">
                {tips.map((tip, index) => (
                  <div key={index} className="tip-item">
                    <span className="tip-number">{index + 1}.</span>
                    <span className="tip-content">{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}