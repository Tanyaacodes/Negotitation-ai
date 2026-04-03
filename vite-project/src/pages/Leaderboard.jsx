import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowLeft, Crown, Star } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/game';

const MEDAL = ['🥇', '🥈', '🥉'];
const MEDAL_COLORS = [
  { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.4)', text: '#facc15', glow: '0 0 20px rgba(250,204,21,0.25)' },
  { bg: 'rgba(148,163,184,0.10)', border: 'rgba(148,163,184,0.35)', text: '#94a3b8', glow: '0 0 14px rgba(148,163,184,0.18)' },
  { bg: 'rgba(180,120,60,0.10)', border: 'rgba(180,120,60,0.35)', text: '#cd7f32', glow: '0 0 14px rgba(180,120,60,0.18)' },
];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leaderboard`);
        setLeaderboard(res.data.data || []);
      } catch (err) {
        console.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const getInitial = (name) => (name ? name[0].toUpperCase() : '?');

  return (
    <div className="lb-page-root">
      {/* Ambient orbs */}
      <div className="landing-bg-orb orb-a" />
      <div className="landing-bg-orb orb-b" />

      <div className="lb-page-inner">
        {/* Back button */}
        <button className="lb-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Home
        </button>

        {/* Header */}
        <motion.div
          className="lb-page-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="lb-trophy-wrap">
            <Trophy size={40} className="lb-trophy-icon" />
          </div>
          <div>
            <div className="lb-page-title">Hall of Fame</div>
            <div className="lb-page-subtitle">Lowest negotiated price wins the crown 👑</div>
          </div>
        </motion.div>

        {/* Column headers */}
        <div className="lb-table-header">
          <span className="lb-th-rank">Rank</span>
          <span className="lb-th-player">Player</span>
          <span className="lb-th-price">Final Price</span>
        </div>

        {/* List */}
        <motion.div
          className="lb-table-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="lb-row-skeleton" />
            ))
          ) : leaderboard.length === 0 ? (
            <div className="lb-empty-state glass-morphism">
              <div className="lb-empty-icon">🏆</div>
              <div className="lb-empty-title">Be the first legend</div>
              <div className="lb-empty-sub">Hall of Fame abhi empty hai. Go negotiate and crush that minimum price.</div>
              <button className="lb-empty-cta" onClick={() => navigate('/pick')}>Start Playing →</button>
            </div>
          ) : (
            leaderboard.slice(0, 10).map((item, idx) => {
              const isTop3 = idx < 3;
              const medal = MEDAL_COLORS[idx] || null;
              return (
                <motion.div
                  key={`${item.name}-${idx}`}
                  className={`lb-row ${isTop3 ? 'lb-row-medal' : ''}`}
                  style={isTop3 ? {
                    background: medal.bg,
                    borderColor: medal.border,
                    boxShadow: medal.glow,
                  } : {}}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx, duration: 0.3 }}
                  whileHover={{ x: 4, transition: { duration: 0.15 } }}
                >
                  {/* Rank */}
                  <div className="lb-row-rank">
                    {isTop3 ? (
                      <span className="lb-row-medal-emoji">{MEDAL[idx]}</span>
                    ) : (
                      <span className="lb-row-rank-num" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Player */}
                  <div className="lb-row-player">
                    <div
                      className="lb-row-avatar"
                      style={isTop3 ? { background: medal.bg, border: `1.5px solid ${medal.border}`, color: medal.text } : {}}
                    >
                      {getInitial(item.name)}
                    </div>
                    <div className="lb-row-player-info">
                      <div className="lb-row-name">{item.name}</div>
                      <div className="lb-row-tag">
                        {idx === 0 ? '👑 Champion' : idx < 3 ? '⭐ Top Negotiator' : '🎯 Deal Maker'}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div
                    className="lb-row-price"
                    style={isTop3 ? { color: medal.text } : {}}
                  >
                    {formatPrice(item.price)}
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Footer hint */}
        {!loading && leaderboard.length > 0 && (
          <motion.div
            className="lb-page-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button className="lb-footer-play-btn" onClick={() => navigate('/pick')}>
              Challenge the AI →
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
