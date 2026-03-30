import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/auth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const res = await axios.post(`${API_BASE}${endpoint}`, payload);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/game');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container app-container">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="auth-card glass-morphism"
      >
        <div className="auth-header">
          <h2>BRICK_NEGOTIATE</h2>
          <p>{isLogin ? 'WELCOME BACK, BUILDER' : 'INITIALIZE CONSTRUCTOR PROFILE'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="input-group"
              >
                <label>CALLSIGN</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input type="text" name="name" placeholder="master_builder" required={!isLogin} value={formData.name} onChange={handleChange} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <label>EMAIL ADDRESS</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input type="email" name="email" placeholder="master_builder@bricks.io" required value={formData.email} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>SECURITY KEY</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input type="password" name="password" placeholder="••••••••" required value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn glow-btn">
            {loading ? 'PROCESSING...' : (isLogin ? <><LogIn size={18} /> ASSEMBLE PROFILE</> : <><UserPlus size={18} /> CREATE ACCOUNT</>)}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button className="auth-switch-btn" onClick={() => setIsLogin(!isLogin)} type="button">
          {isLogin ? 'NEW CONSTRUCTOR ACCOUNT' : 'ALREADY HAVE A PROFILE?'}
        </button>
      </motion.div>
    </div>
  );
};

export default Auth;
