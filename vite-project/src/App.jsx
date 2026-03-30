import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ProductPicker from './pages/ProductPicker';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';

function App() {
  return (
    <Router>
      <div className="app-root">
        <Routes>
          <Route path="/"            element={<Landing />} />
          <Route path="/pick"        element={<ProductPicker />} />
          <Route path="/game"        element={<Game />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
