import mongoose from 'mongoose';
import { createInitialState } from '../logic/engine.js';

const defaultState = createInitialState('smartphone');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  state: {
    productId: { type: String, default: defaultState.productId },
    msrp: { type: Number, default: defaultState.msrp },
    minPrice: { type: Number, default: defaultState.minPrice },
    currentOffer: { type: Number, default: defaultState.currentOffer },
    patience: { type: Number, default: defaultState.patience },
    mood: { type: String, default: defaultState.mood },
    rounds: { type: Number, default: defaultState.rounds },
    isDealDone: { type: Boolean, default: defaultState.isDealDone },
    isWalkedAway: { type: Boolean, default: defaultState.isWalkedAway },
    profitMargin: { type: Number, default: defaultState.profitMargin },
    // Hidden seller constraints (used only by the negotiation engine)
    targetProfitMargin: { type: Number, default: defaultState.targetProfitMargin },
    strategy: { type: String, default: defaultState.strategy },
    history: { type: Array, default: defaultState.history }
  },
  createdAt: { type: Date, expires: '24h', default: Date.now } // Auto-delete sessions after 24 hours
});

export default mongoose.model('Session', sessionSchema);
