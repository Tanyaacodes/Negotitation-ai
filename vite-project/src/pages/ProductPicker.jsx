import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PRODUCTS = [
  {
    id: 'smartphone',
    name: 'Electric Scooter',
    desc: '32km range, foldable, 250W motor',
    tagline: 'City commute ka naya style!',
    msrp: 22000,
    target: 16500,
    icon: '🛴',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.4)',
    diff: 'MEDIUM',
    mood: '😎 Chill'
  },
  {
    id: 'leather-jacket',
    name: 'Smartwatch',
    desc: 'Heart-rate + fitness tracker',
    tagline: 'Compact tech, smart life!',
    msrp: 7000,
    target: 5250,
    icon: '⌚',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.4)',
    diff: 'EASY',
    mood: '🤑 Greedy'
  },
  {
    id: 'vegetables',
    name: 'Gaming Headset',
    desc: 'RGB, noise-cancel mic, surround sound',
    tagline: 'Gaming room banega pro!',
    msrp: 2500,
    target: 1850,
    icon: '🎧',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.4)',
    diff: 'EASY',
    mood: '😇 Generous'
  },
  {
    id: 'sofa',
    name: 'Ergonomic Office Desk',
    desc: 'Adjustable height + cable management',
    tagline: 'Work from home, comfort on point',
    msrp: 18000,
    target: 13500,
    icon: '🧑‍💻',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.4)',
    diff: 'HARD',
    mood: '😤 Strict'
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
  mood: '🤔 Mystery'
};

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const diffColor = { EASY: '#4ade80', MEDIUM: '#facc15', HARD: '#f87171' };

export default function ProductPicker() {
  const navigate = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'Guest';

  const pick = (id) => {
    localStorage.setItem('selectedProduct', id);
    navigate('/game');
  };

  // Fun facts/tips
  const tips = [
    'Tip: "Main student hu" — empathy triggers! 😇',
    'Try: "Market me sasta hai" — logic works! 🧠',
    'Urgency: "Cash de dunga abhi" — seals the deal! 💸',
    'Lowball? Shopkeeper gussa ho jayega! 😤',
    'Bluff once per game for a surprise! 🎭',
    'Mood preview: Each product has a unique shopkeeper personality!'
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  // Carousel scroll
  return (
    <div className="picker-root">
      <div className="picker-bg-orb orb-a" />
      <div className="picker-bg-orb orb-b" />

      {/* Nav */}
      <nav className="picker-nav">
        <button className="picker-back" onClick={() => navigate('/')}>← Home</button>
        <div className="picker-nav-center">
          <span className="picker-nav-icon">🛒</span>
          <div>
            <div className="picker-nav-title">Pick a Product</div>
            <div className="picker-nav-sub">Kya kharidna hai aaj?</div>
          </div>
        </div>
        <div className="picker-user-pill">👤 {playerName}</div>
      </nav>

      {/* Fun Fact / Tip */}
      <div className="picker-tip-bar">
        <span role="img" aria-label="bulb">💡</span> {tip}
      </div>

      {/* Main area: left product choices + right spinner/wallet */}
      <div className="picker-main-grid">
        <div className="picker-left-panel">
          <div className="quick-buttons">
            {PRODUCTS.slice(0,3).map((p) => (
              <button key={p.id} className="quick-btn" onClick={() => pick(p.id)}>{p.name}</button>
            ))}
          </div>

          <div className="picker-carousel-wrap">
            <div className="picker-carousel">
              {[...PRODUCTS, RANDOM_PRODUCT].map((p, i) => (
                <motion.div
                  key={p.id}
                  className="picker-card glass-morphism"
                  style={{ '--pc': p.color, '--pg': p.glow, minWidth: 260, marginRight: 24 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8, scale: 1.04, borderColor: p.color }}
                >
                  <div className="picker-card-glow" />
                  <span className="picker-diff" style={{ color: diffColor[p.diff] }}>{p.diff}</span>
                  <h3 className="picker-card-name">{p.name}</h3>
                  <p className="picker-card-desc">{p.desc}</p>
                  <div className="picker-card-tagline">{p.tagline}</div>
                  <div className="picker-mood-preview">
                    <span className="picker-mood-emoji">{p.mood}</span>
                    <span className="picker-mood-label">Shopkeeper Mood</span>
                  </div>
                  <div className="picker-prices">
                    <div className="picker-price-row">
                      <span>Shopkeeper asks</span>
                      <strong>{p.msrp === '???' ? '???' : fmt(p.msrp)}</strong>
                    </div>
                    <div className="picker-price-row">
                      <span>Your target</span>
                      <strong style={{ color: '#4ade80' }}>{p.target === '???' ? '???' : `≤ ${fmt(p.target)}`}</strong>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className="picker-btn"
                    style={{ background: p.color, boxShadow: `0 6px 24px ${p.glow}` }}
                    onClick={() => pick(p.id === 'random' ? PRODUCTS[Math.floor(Math.random()*PRODUCTS.length)].id : p.id)}
                  >
                    {p.id === 'random' ? 'Surprise Me!' : 'Bargain Now →'}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
