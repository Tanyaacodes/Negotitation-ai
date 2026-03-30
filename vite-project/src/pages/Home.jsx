import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Zap, Shield, TrendingDown, ArrowRight, LogOut, Star } from 'lucide-react';

const PRODUCTS = [
  {
    id: 'smartphone',
    name: 'Electric Scooter',
    desc: '32km range, foldable, 250W motor',
    msrp: 22000,
    targetPrice: 16500,
    complexity: 'MEDIUM',
    color: '#a78bfa',
    glow: 'rgba(167,139,250,0.4)',
    icon: '🛴',
    category: 'Mobility'
  },
  {
    id: 'leather-jacket',
    name: 'Smartwatch',
    desc: 'Heart-rate + fitness tracker',
    msrp: 7000,
    targetPrice: 5250,
    complexity: 'EASY',
    color: '#fb923c',
    glow: 'rgba(251,146,60,0.4)',
    icon: '⌚',
    category: 'Wearables'
  },
  {
    id: 'vegetables',
    name: 'Gaming Headset',
    desc: 'RGB, noise-cancel mic, surround sound',
    msrp: 2500,
    targetPrice: 1850,
    complexity: 'EASY',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.4)',
    icon: '🎧',
    category: 'Gaming'
  },
  {
    id: 'sofa',
    name: 'Ergonomic Office Desk',
    desc: 'Adjustable height + cable management',
    msrp: 18000,
    targetPrice: 13500,
    complexity: 'HARD',
    color: '#38bdf8',
    glow: 'rgba(56,189,248,0.4)',
    icon: '🧑‍💻',
    category: 'Workspace'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (e) { /* empty */ }
    }
  }, []);

  const handleSelectProduct = (productId) => {
    localStorage.setItem('selectedProduct', productId);
    if (user) {
      navigate('/game');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('selectedProduct');
    navigate('/auth');
  };

  return (
    <div className="home-root">
      {/* Ambient background orbs */}
      <div className="ambient-orb orb-1" />
      <div className="ambient-orb orb-2" />
      <div className="ambient-orb orb-3" />

      {/* Navbar */}
      <nav className="home-nav">
        <div className="home-nav-left">
          <div className="nav-logo">🛒</div>
          <span className="nav-brand">Negotiation Arena</span>
        </div>
        <div className="home-nav-right">
          {user ? (
            <div className="nav-user-pill">
              <span className="nav-user-avatar">👤</span>
              <span>{user.name}</span>
              <button onClick={handleLogout} title="Logout" className="nav-logout-btn">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="nav-login-btn" onClick={() => navigate('/auth')}>Login / Register</button>
          )}
          <button className="nav-leaderboard-btn" onClick={() => navigate('/leaderboard')}>
            <Trophy size={16} /> Hall of Fame
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="hero-badge"
        >
          <span className="hero-badge-dot" /> AI-POWERED NEGOTIATION GAME
        </motion.div>
        <h1 className="hero-headline">
          Negotiation<br />
          <span className="hero-headline-color">Arena</span>
        </h1>
        <p className="hero-sub">
          Bargain with an AI shopkeeper. Pick a product,<br />
          make your offer, and outsmart the AI.
        </p>
        <div className="hero-cta-row">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="hero-start-btn"
            onClick={() => handleSelectProduct('smartphone')}
          >
            <Play size={18} fill="currentColor" /> Start Game
            <span className="hero-start-badge">vs AI</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, x: 4 }}
            className="hero-lb-btn"
            onClick={() => navigate('/leaderboard')}
          >
            <Trophy size={18} /> Leaderboard <ArrowRight size={16} />
          </motion.button>
        </div>
      </motion.section>

      {/* Feature Pills */}
      <section className="features-pills-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="features-pills-row"
        >
          {[
            { icon: '🤖', label: 'AI Shopkeeper', desc: 'Powered by Groq LLaMA' },
            { icon: '🛒', label: '4 Products', desc: 'Phone, Clothes, Veggies, Furniture' },
            { icon: '🏆', label: 'Leaderboard', desc: 'Compete globally' }
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="feature-pill glass-morphism"
            >
              <span style={{ fontSize: '2rem' }}>{f.icon}</span>
              <div>
                <div className="feature-pill-label">{f.label}</div>
                <div className="feature-pill-desc">{f.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="home-divider" />

      {/* Products Grid */}
      <section className="products-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="section-header"
        >
          <div className="section-icon">🛒</div>
          <div>
            <h2 className="section-h2">Pick a Product</h2>
            <p className="section-p">Kya kharidna hai aaj?</p>
          </div>
          {user && (
            <div className="section-user-pill">
              <span>👤</span> {user.name}
            </div>
          )}
        </motion.div>

        <div className="products-grid">
          {PRODUCTS.map((prod, i) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -6 }}
              className="product-tile glass-morphism"
              style={{ '--prod-color': prod.color, '--prod-glow': prod.glow }}
              onMouseEnter={() => setHoveredProduct(prod.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <div className="product-tile-glow" />
              <div className="product-tile-icon">{prod.icon}</div>
              <div className="product-tile-body">
                <h3 className="product-tile-name">{prod.name}</h3>
                <p className="product-tile-desc">{prod.desc}</p>
                <div className="product-tile-prices">
                  <div className="price-row">
                    <span className="price-label">Shopkeeper asks</span>
                    <span className="price-value">₹{prod.msrp.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="price-row">
                    <span className="price-label">Your target</span>
                    <span className="price-target">≤ ₹{prod.targetPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="product-tile-btn"
                onClick={() => handleSelectProduct(prod.id)}
              >
                Bargain Now →
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      <p className="home-footer-hint">Offer below minimum price and the deal is off. You've been warned. 😤</p>
    </div>
  );
};

export default Home;
