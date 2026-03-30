import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Name Modal ────────────────────────────────── */
const NameModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [err, setErr]   = useState('');

  const submit = () => {
    if (!name.trim()) { setErr('Naam toh bata do yaar'); return; }
    localStorage.setItem('playerName', name.trim());
    onSubmit(name.trim());
  };

  return (
    <motion.div
      className="nm-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="nm-card glass-morphism"
        initial={{ scale: 0.85, y: 40 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 40 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        <h2 className="nm-title">Your Name</h2>
        <p className="nm-sub">This is how you'll appear on the leaderboard</p>
        <input
          className="nm-input"
          placeholder="Your Hinglish name here"
          value={name}
          onChange={e => { setName(e.target.value); setErr(''); }}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoFocus
        />
        {err && <p className="nm-err">{err}</p>}
        <div className="nm-actions">
          <button className="nm-btn nm-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="nm-btn nm-btn-primary" onClick={submit}>
            Start Playing
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── How-to steps ─────────────────────────────── */
const steps = [
  { n: '01', icon: '🛒', title: 'Pick a Product', desc: 'Choose from scooter, smartwatch, headset, or desk. Each has unique pricing challenges.' },
  { n: '02', icon: '💬', title: 'Start Negotiating', desc: 'AI shopkeeper quotes first. You counter-offer. Arguments must be convincing.' },
  { n: '03', icon: '🧠', title: 'Master Your Tactics', desc: 'Empathy, logic, or urgency—pick the right strategy for each seller.' },
  { n: '04', icon: '🏆', title: 'Win the Deal', desc: 'Hit your target price. Fewer rounds = higher score.' },
];

/* ── Why useful cards ─────────────────────────── */
const reasons = [
  { icon: '💼', title: 'Real-World Skill', desc: 'Negotiation is one of the most valuable life skills. Practice without risk.' },
  { icon: '🤖', title: 'Adaptive AI Opponent', desc: 'The AI learns from your tactics—emotional, logical, or aggressive approaches all work differently.' },
  { icon: '🎯', title: 'Track Your Progress', desc: 'Watch yourself improve with detailed stats on rounds, savings, and rank.' },
  { icon: '⚡', title: 'Instant Gratification', desc: 'No sign-ups, no nonsense. Jump in and start winning deals in seconds.' },
];
/* ── Landing Page ─────────────────────────────── */
export default function Landing() {
  const navigate   = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleStartGame = () => {
    const existing = localStorage.getItem('playerName');
    if (existing) { navigate('/pick'); }
    else          { setShowModal(true); }
  };

  const handleNameSubmit = () => { setShowModal(false); navigate('/pick'); };

  return (
    <div className="landing-root">
      {/* ── Animated BG ────── */}
      <div className="landing-bg-orb orb-a" />
      <div className="landing-bg-orb orb-b" />
      <div className="landing-bg-orb orb-c" />
      <div className="landing-scanlines" />

      {/* ── Navbar ─────────── */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <span className="landing-nav-brand">BargainAI</span>
        </div>
        <div className="landing-nav-links">
          <a href="#how-it-works" className="landing-nav-link">How It Works</a>
          <button className="landing-nav-link" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
          <motion.button
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="landing-nav-cta"
            onClick={handleStartGame}
          >
            Start Game →
          </motion.button>
        </div>
      </nav>

      {/* ── Hero ───────────── */}
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="landing-hero-content"
        >
          <div className="landing-hero-badge">
            <span className="lhb-dot" /> LIVE · AI-POWERED NEGOTIATION GAME
          </div>

          <h1 className="landing-hero-h1">
            Can You Beat<br />
            <span className="landing-hero-gradient">the AI Haggler?</span>
          </h1>

          <p className="landing-hero-p">
            Real-time negotiation battles with an AI shopkeeper that haggles back in Hinglish. Master the art of the deal.
          </p>

          <div className="landing-hero-btns">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="landing-hero-play"
              onClick={handleStartGame}
            >
              Play Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="landing-hero-ghost"
              onClick={() => navigate('/leaderboard')}
            >
              View Leaderboard
            </motion.button>
          </div>

          <div className="landing-hero-stats">
            {[['4', 'Products'], ['Real-time', 'Haggling'], ['Hinglish', 'AI'], ['Instant', 'Play']].map(([val, label]) => (
              <div key={label} className="lhs-item">
                <span className="lhs-val">{val}</span>
                <span className="lhs-label">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Floating product preview */}
        <motion.div
          className="landing-hero-visual"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-chat-preview glass-morphism">
            <div className="hcp-header">
              <span>Leather Jacket</span>
              <span className="hcp-tag">LIVE</span>
            </div>
            {[
              { who: 'ai',   text: 'Namaste! ₹3,000 mein de dunga' },
              { who: 'user', text: '₹1,500? Main student hu' },
              { who: 'ai',   text: 'Arre, itne mein toh iska zipper bhi nahi aayega' },
              { who: 'user', text: '₹2,200 cash pe?' },
              { who: 'ai',   text: 'Chalo, ₹2,300 kar lo. Deal?' },
            ].map((m, i) => (
              <motion.div
                key={i}
                className={`hcp-msg hcp-msg-${m.who}`}
                initial={{ opacity: 0, x: m.who === 'ai' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.25 }}
              >
                {m.text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ──── */}
      <section className="landing-section" id="how-it-works">
        <motion.div
          className="landing-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="landing-section-tag">GAMEPLAY</span>
          <h2 className="landing-section-h2">How It Works</h2>
          <p className="landing-section-p">Learn the negotiation game in one minute</p>
        </motion.div>

        <div className="landing-steps-grid">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              className="landing-step-card glass-morphism"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="lsc-num">{s.n}</div>
              <div className="lsc-icon">{s.icon}</div>
              <h3 className="lsc-title">{s.title}</h3>
              <p className="lsc-desc">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Negotiation Practices (Redesigned Text-Only) ──────── */}
      <section className="landing-section negotiation-section-new" id="negotiation">
        <motion.div
          className="landing-section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="landing-section-tag">NEGOTIATION LAB</span>
          <h2 className="landing-section-h2">Available Topics for Bargains</h2>
          <p className="landing-section-p">Pick a scenario to start the AI challenge and learn the best approaches.</p>
        </motion.div>

        <div className="negotiation-text-grid">
          {[
            {
              heading: 'Premium Headphones',
              subline: 'Audio Mastery',
              points: ['High-value negotiation', 'Use emotion + urgency tactics', 'Challenge: Avoid emotional discounting'],
              difficulty: 'Medium'
            },
            {
              heading: 'Smartwatch Pro',
              subline: 'Tech Strategy',
              points: ['Data-driven pricing battles', 'Justify with solid facts', 'Challenge: Convert logic to deals'],
              difficulty: 'Hard'
            },
            {
              heading: 'Sneaker Special',
              subline: 'Quick Wins',
              points: ['Impulse buy scenarios', 'Strike fast agreements', 'Challenge: Confidence over time'],
              difficulty: 'Easy'
            },
          ].map((item, i) => (
            <motion.div
              key={item.heading}
              className="negotiation-text-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
            >
              <h3 className="negotiation-heading">{item.heading}</h3>
              <p className="negotiation-subline">{item.subline}</p>
              <ul className="negotiation-points">
                {item.points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <div className="negotiation-footer">
                <span className={`difficulty-badge ${item.difficulty.toLowerCase()}`}>{item.difficulty}</span>
                <button
                  className="start-btn"
                  onClick={() => {
                    localStorage.setItem('selectedDifficulty', item.difficulty.toLowerCase());
                    handleStartGame();
                  }}
                >
                  Begin →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ──────── (removed) */}

      {/* ── Footer ─────────── */}
      <footer className="landing-footer">
        <span>BargainAI</span>
        <span>·</span>
        <span>Negotiation Evolved</span>
        <span>·</span>
        <button onClick={() => navigate('/leaderboard')} className="landing-footer-link">Leaderboard</button>
      </footer>

      {/* ── Name Modal ──────── */}
      <AnimatePresence>
        {showModal && (
          <NameModal onClose={() => setShowModal(false)} onSubmit={handleNameSubmit} />
        )}
      </AnimatePresence>
    </div>
  );
}
