import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowLeft } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/game';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${API_BASE}/leaderboard`);
        setLeaderboard(res.data);
      } catch (err) {
        console.error("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 820, padding: 40 }}>
          <div className="lb-hero-skeleton">
            <div className="lb-hero-skeleton-icon" />
            <div className="lb-hero-skeleton-lines">
              <div className="lb-skeleton-line" style={{ width: '70%' }} />
              <div className="lb-skeleton-line" style={{ width: '45%' }} />
            </div>
          </div>
          <div className="lb-grid">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="lb-card-skeleton" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-page-container">
      <button className="back-btn glass-morphism" onClick={() => navigate('/')}>
        <ArrowLeft size={20} /> Back to Hub
      </button>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="lb-hero"
      >
        <Trophy size={54} color="gold" className="lb-hero-icon" />
        <div className="lb-hero-text">
          <div className="lb-hero-title">HALL OF FAME</div>
          <div className="lb-hero-sub">Lowest negotiated price gets crowned.</div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="lb-grid"
      >
        {leaderboard.length === 0 ? (
          <div className="lb-empty glass-morphism">
            <div className="lb-empty-top">Be the first legend</div>
            <div className="lb-empty-sub">Hall of Fame abhi empty hai. Go negotiate and crush that minimum price.</div>
          </div>
        ) : (
          leaderboard.slice(0, 10).map((item, idx) => (
            <motion.div
              key={`${item.name}-${idx}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className={`lb-card ${idx === 0 ? 'lb-card-top' : ''}`}
              whileHover={{ y: -6 }}
            >
              <div className="lb-card-toprow">
                <div className="lb-rank-badge">
                  {idx === 0 ? '🥇' : `#${idx + 1}`}
                </div>
                <div className="lb-status-badge">LEGEND</div>
              </div>
              <div className="lb-name">{item.name}</div>
              <div className="lb-price">{formatPrice(item.price)}</div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
