import mongoose from 'mongoose';

const leaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 20 },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Leaderboard', leaderboardSchema);
