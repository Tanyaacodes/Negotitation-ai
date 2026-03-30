import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trophy, ArrowLeft, Loader2, Award } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/game';

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
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  };

  if (loading) {
    return (
      <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="glow-btn" size={48} color="var(--accent-cyan)" style={{ animation: 'spin 2s linear infinite' }} />
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
        className="leaderboard-header text-center"
      >
        <Trophy size={48} color="gold" className="mx-auto" style={{ marginBottom: 16 }} />
        <h1>HALL OF FAME</h1>
        <p>Global Elite Architects closing the best deals.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="leaderboard-table-wrapper glass-morphism"
      >
        <table className="full-leaderboard">
          <thead>
            <tr>
              <th>RANK</th>
              <th>BUILDER NAME</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>FINAL NEGOTIATED PRICE</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No deals constructed yet. The vault is waiting.</td>
              </tr>
            ) : (
              leaderboard.map((item, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className={idx === 0 ? 'top-rank' : ''}
                >
                  <td>
                    {idx === 0 ? <Award color="gold" size={24}/> : <span className="rank-num">0{idx + 1}</span>}
                  </td>
                  <td className="player-name">{item.name}</td>
                  <td><span className="status-badge">LEGEND</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: 'var(--success-green)' }}>
                    {formatPrice(item.price)}
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
