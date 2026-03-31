import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Trophy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/game';

const PRODUCT_META = {
  'mannat':        { name: "Shahrukh Khan's Mannat", icon: '🕌', category: 'Savage',    color: '#a78bfa', glow: 'rgba(167,139,250,0.5)' },
  'bandana':       { name: "Harsh bhaiya's Bandana", icon: '🧢', category: 'Bakchodi Mode on',     color: '#fb923c', glow: 'rgba(251,146,60,0.5)'  },
  'specs':         { name: "Ankur BHaiya's Specs", icon: '👓', category: 'Guide Mode on',       color: '#4ade80', glow: 'rgba(74,222,128,0.5)'  },
  'meloni':        { name: 'Modi ji ki Meloni', icon: '🍉', category: 'Love is in the air',     color: '#38bdf8', glow: 'rgba(56,189,248,0.5)'  },
  'kursi':         { name: "Chacha's Kursi", icon: '🪑', category: 'Aura+++',        color: '#f472b6', glow: 'rgba(244,114,182,0.45)' },
  'lpg-gf':        { name: '10 LPG gases with gf', icon: '🔥', category: 'Roast Mode on', color: '#facc15', glow: 'rgba(250,204,21,0.35)' },
  'brain-for-u':   { name: 'A brain for u', icon: '🧠', category: 'Friendly',      color: '#22c55e', glow: 'rgba(34,197,94,0.35)' },
};

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

function Game() {
  const navigate   = useNavigate();
  const playerName = localStorage.getItem('playerName') || 'Guest';
  const productId  = localStorage.getItem('selectedProduct') || 'mannat';
  const meta       = PRODUCT_META[productId] || PRODUCT_META['mannat'];

  const [sessionId, setSessionId]   = useState(null);
  const [loading, setLoading]       = useState(true);
  const [gameState, setGameState]   = useState({ msrp: 0, currentOffer: 0, patience: 100, rounds: 0, isDealDone: false, isWalkedAway: false, mood: 'Professional', productId });
  const [messages, setMessages]     = useState([]);
  const [offer, setOffer]           = useState('');
  const [reason, setReason]         = useState('');
  const [isTyping, setIsTyping]     = useState(false);
  const [score, setScore]           = useState(0);

  const chatRef = useRef(null);
  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, isTyping]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.post(`${API_BASE}/start`, { productId });
        setSessionId(res.data.sessionId);
        const st = res.data.initialState;
        setGameState(st);
        const productDisplay = meta?.name || (st.productId || productId).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        setMessages([{ who: 'ai', text: `Namaste! Aaj main aapko yeh ${productDisplay} sirf ${fmt(st.currentOffer)} mein de sakta hoon. Kya offer karenge?` }]);
      } catch {
        setMessages([{ who: 'ai', text: '❌ Server se connect nahi ho paya. Make sure backend is running on port 5000.' }]);
      } finally { setLoading(false); }
    })();
  }, []);

  const TACTICS = [
    { label: 'Student / Broke', reason: `Main student/broke hu bhai. ${meta?.name || ''} ke liye thoda discount de do. Thoda insaaf karo.` },
    { label: 'Market Logic', reason: `Market me sasta hai. ${meta?.name || ''} ke competitor/reviews ke hisaab se price justify karo.` },
    { label: 'Cash Now', reason: `Cash abhi de dunga. ${meta?.name || ''} ka deal done karein? Please yaar, now.` },
    { label: 'Urgency', reason: `Aaj hi finalize karna hai. ${meta?.name || ''} ke best price abhi cash pay, de do.` },
  ];

  const sendOffer = async () => {
    if (!offer.trim() || !sessionId || gameState.isDealDone || gameState.isWalkedAway) return;
    const offerVal  = offer;
    const reasonVal = reason;
    setMessages(prev => [...prev, { who: 'user', text: `${fmt(offerVal)} mein doge? ${reasonVal}` }]);
    setIsTyping(true);
    setOffer('');
    setReason('');
    try {
      const res = await axios.post(`${API_BASE}/turn`, { sessionId, offer: parseFloat(offerVal), reason: reasonVal, message: reasonVal });
      const { sellerResponse, newState } = res.data;
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { who: 'ai', text: sellerResponse }]);
        setGameState(newState);
        if (newState.isDealDone) {
          const sc = Math.round(((newState.msrp - newState.currentOffer) / 100) * Math.max(1, 20 - newState.rounds));
          setScore(sc);
          axios.post(`${API_BASE}/leaderboard`, { sessionId, playerName }).catch(() => {});
        }
      }, 800 + Math.random() * 600);
    } catch {
      setIsTyping(false);
      setMessages(prev => [...prev, { who: 'ai', text: 'Kuch gadbad ho gaya... Dobara try karo.' }]);
    }
  };

  const walkAway = async () => {
    if (!sessionId || gameState.isDealDone || gameState.isWalkedAway) return;
    setIsTyping(true);
    try {
      const res = await axios.post(`${API_BASE}/walkaway`, { sessionId });
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { who: 'ai', text: res.data.message }]);
        setGameState(res.data.newState);
      }, 700);
    } catch { setIsTyping(false); }
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendOffer(); } };

  const patiencePct  = Math.max(0, gameState.patience);
  const patienceClr  = patiencePct > 60 ? '#4ade80' : patiencePct > 30 ? '#facc15' : '#f87171';
  const isOver       = gameState.isDealDone || gameState.isWalkedAway;
  const productLabel = meta?.name || (gameState.productId || productId).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const savedAmt = Math.max(0, (gameState.msrp || 0) - (gameState.currentOffer || 0));

  if (loading) return (
    <div className="fg-loading">
      <div style={{ fontSize: '4rem', animation: 'float 2s ease-in-out infinite' }}>{meta.icon}</div>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 16 }}>Shopkeeper se connect ho rahe hain...</p>
      <div className="loading-dots" style={{ marginTop: 12 }}><span /><span /><span /></div>
    </div>
  );

  return (
    <div className="fg-root" style={{ '--pc': meta.color, '--pg': meta.glow }}>
      {/* ambient glow */}
      <div className="fg-ambient" />

      {/* ── TOP BAR ─────────────────────── */}
      <header className="fg-topbar">
        <button className="fg-topbar-btn" onClick={() => navigate('/pick')}>
          <ArrowLeft size={16} /> Back
        </button>

        <div className="fg-topbar-center">
          <span className="fg-prod-icon" style={{ filter: `drop-shadow(0 0 8px ${meta.color})` }}>{meta.icon}</span>
          <div>
            <div className="fg-prod-name">{productLabel}</div>
            <div className="fg-prod-cat">{meta.category}</div>
          </div>
        </div>

        <div className="fg-topbar-right">
          <button className="fg-topbar-btn" onClick={() => navigate('/leaderboard')}>
            <Trophy size={15} /> Scores
          </button>
          <button className="fg-topbar-btn" onClick={() => window.location.reload()}>
            <RefreshCw size={15} /> New
          </button>
        </div>
      </header>

      {/* ── STATS BAR ───────────────────── */}
      <div className="fg-statsbar">
        <div className="fg-stat">
          <div className="fg-stat-label">Asks</div>
          <div className="fg-stat-val">{fmt(gameState.msrp)}</div>
        </div>
        <div className="fg-stat-sep" />
        <div className="fg-stat">
          <div className="fg-stat-label">Saved</div>
          <div className="fg-stat-val fg-stat-green">{fmt(savedAmt)}</div>
        </div>
        <div className="fg-stat-sep" />
        <div className="fg-stat">
          <div className="fg-stat-label">Current</div>
          <div className="fg-stat-val">{fmt(gameState.currentOffer)}</div>
        </div>
        <div className="fg-stat-sep" />
        <div className="fg-stat">
          <div className="fg-stat-label">Rounds</div>
          <div className="fg-stat-val">{gameState.rounds}</div>
        </div>
        <div className="fg-stat-sep" />
        <div className="fg-stat fg-stat-score">
          <Trophy size={14} style={{ color: '#facc15' }} />
          <div className="fg-stat-val" style={{ color: '#facc15' }}>{score}</div>
        </div>

        {/* patience bar */}
        <div className="fg-patience-wrap">
          <span className="fg-patience-label">Patience</span>
          <div className="fg-patience-track">
            <motion.div
              className="fg-patience-fill"
              animate={{ width: `${patiencePct}%`, backgroundColor: patienceClr }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span className="fg-patience-pct">{patiencePct}%</span>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────── */}
      <div className="fg-body">
        {/* LEFT: product info panel */}
        <aside className="fg-sidebar glass-morphism">
          <div className="fg-sb-icon">{meta.icon}</div>
          <h2 className={`fg-sb-name ${productId === 'leather-jacket' ? 'glitch' : ''}`}>{productLabel}</h2>
          <p className="fg-sb-cat">{meta.category}</p>

          <div className="fg-sb-divider" />

          <div className="fg-sb-row"><span>Asking</span><strong>{fmt(gameState.msrp)}</strong></div>
          <div className="fg-sb-row"><span>Current offer</span><strong style={{ color: meta.color }}>{fmt(gameState.currentOffer)}</strong></div>

          <div className="fg-sb-divider" />

          <div className="fg-sb-mood-label">Seller Mood</div>
          <div className="fg-sb-mood" style={{ color: meta.color }}>
            {gameState.mood === 'Annoyed'    && '😤 Annoyed'}
            {gameState.mood === 'Generous'   && '😊 Generous'}
            {gameState.mood === 'Desperate'  && '😰 Desperate'}
            {gameState.mood === 'Firm'       && '😐 Firm'}
            {gameState.mood === 'Professional' && '🧑‍💼 Professional'}
            {!gameState.mood && '🧑‍💼 Professional'}
          </div>

          <div className="fg-sb-divider" />

          <div className="fg-sb-tip">
            <strong>💡 Tips:</strong>
            <ul>
              <li>"Main student hu" — empathy triggers</li>
              <li>"Market me sasta hai" — logic works</li>
              <li>"Cash de dunga abhi" — urgency seals it</li>
            </ul>
          </div>
        </aside>

        {/* RIGHT: chat */}
        <section className="fg-chat-section">
          <div className="fg-chat" ref={chatRef}>
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  className={`fg-msg fg-msg-${m.who}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {m.who === 'ai' && (
                    <div className="fg-ai-avatar" style={{ background: meta.color }}>🧑‍💼</div>
                  )}
                  <div className={`fg-bubble fg-bubble-${m.who}`}>{m.text}</div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div key="typing" className="fg-msg fg-msg-ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="fg-ai-avatar" style={{ background: meta.color }}>🧑‍💼</div>
                  <div className="fg-bubble fg-bubble-ai">
                    <div className="fg-typing-dots"><span /><span /><span /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input */}
          {!isOver && (
            <div className="fg-input-area">
              <div className="fg-input-row">
                <div className="fg-offer-box">
                  <span className="fg-rupee" style={{ color: meta.color }}>₹</span>
                  <input
                    className="fg-offer-input"
                    type="number"
                    placeholder="Apna offer daalo..."
                    value={offer}
                    onChange={e => setOffer(e.target.value)}
                    onKeyDown={onKey}
                    min={0}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="fg-send-btn"
                  style={{ background: `linear-gradient(135deg, ${meta.color}, #818cf8)`, boxShadow: `0 6px 20px ${meta.glow}` }}
                  onClick={sendOffer}
                  disabled={!offer || isTyping}
                >
                  Send 🚀
                </motion.button>
              </div>
              <div className="fg-input-row2">
                <input
                  className="fg-reason-input"
                  placeholder='Reason? e.g. "main student hu", "market me sasta hai"…'
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  onKeyDown={onKey}
                />
                <button className="fg-walk-btn" onClick={walkAway} disabled={isTyping}>
                  🚶 Walk Away
                </button>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                {TACTICS.map(t => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => setReason(t.reason)}
                    className="fg-tactic-chip"
                    style={{ borderColor: meta.color, color: 'rgba(255,255,255,0.9)' }}
                    disabled={isTyping}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="fg-hint">
                Playing as 👤 <strong>{playerName}</strong> · Deal price wins (lower = higher rank)
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ── DEAL OVERLAY ─────────────────── */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            className="fg-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="fg-deal-card glass-morphism"
              initial={{ scale: 0.8, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="fg-deal-emoji">{gameState.isDealDone ? '🎉' : '😢'}</div>
              <h2 className="fg-deal-title" style={{ color: gameState.isDealDone ? '#4ade80' : '#f87171' }}>
                {gameState.isDealDone ? 'Deal Ho Gayi!' : 'Deal Nahi Bani!'}
              </h2>
              <p className="fg-deal-sub">
                {gameState.isDealDone
                  ? `${meta.icon} ${productLabel} — ${fmt(gameState.currentOffer)} mein liya!`
                  : gameState.isWalkedAway
                    ? 'Shopkeeper ne walk away kar diya. Seller ka floor hidden tha—next round me reasoning + urgency combo try karo.'
                    : 'Offer convince nahi hua. Next round me strategy match karke (empathy/logic/cash-now) offer do.'
                }
              </p>

              {gameState.isDealDone && (
                <div className="fg-deal-stats">
                  {[
                    ['Player',         <span style={{ color: meta.color }}>👤 {playerName}</span>],
                    ['Starting price', fmt(gameState.msrp)],
                    ['Your deal',      <span style={{ color: '#4ade80', fontWeight: 800 }}>{fmt(gameState.currentOffer)}</span>],
                    ['You saved',      <span style={{ color: '#facc15', fontWeight: 800 }}>{fmt(gameState.msrp - gameState.currentOffer)}</span>],
                    ['Rounds taken',   gameState.rounds],
                  ].map(([k, v]) => (
                    <div key={k} className="fg-deal-row">
                      <span>{k}</span><span>{v}</span>
                    </div>
                  ))}
                  <div className="fg-deal-row fg-deal-score-row">
                    <span className="fg-deal-score-label">Final Score</span>
                    <span className="fg-deal-score-val"><Trophy size={18} /> {score}</span>
                  </div>
                  <div className="fg-deal-saved-badge">
                    <CheckCircle size={14} /> Score leaderboard pe save ho gaya!
                  </div>
                </div>
              )}

              <div className="fg-deal-actions">
                <motion.button whileHover={{ scale: 1.04 }} className="fg-deal-btn fg-deal-primary" onClick={() => window.location.reload()}>
                  <RefreshCw size={16} /> Play Again
                </motion.button>
                <motion.button whileHover={{ scale: 1.04 }} className="fg-deal-btn fg-deal-secondary" onClick={() => navigate('/leaderboard')}>
                  <Trophy size={16} /> Scores
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Game;
