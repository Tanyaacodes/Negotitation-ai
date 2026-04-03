import { v4 as uuidv4 } from 'uuid';
import Session from '../models/Session.js';
import Leaderboard from '../models/Leaderboard.js';
import { createInitialState, calculateSellerResponse, handleWalkAway } from '../logic/engine.js';

export const startSession = async (req, res) => {
  try {
    const { productId } = req.body;
    const sessionId = uuidv4();
    
    // Create initial state for the specific product
    const baseState = createInitialState(productId);
    
    // Add random drift to minPrice
    const randomizedMinPrice = Math.floor(baseState.minPrice + (Math.random() * (baseState.minPrice * 0.05) - (baseState.minPrice * 0.02)));
    
    const newSession = new Session({
      sessionId,
      state: {
          ...baseState,
          minPrice: randomizedMinPrice
      }
    });
    
    await newSession.save();
    
    res.status(201).json({ 
        sessionId,
        initialState: {
           currentOffer: newSession.state.currentOffer,
           patience: newSession.state.patience,
           mood: newSession.state.mood,
           rounds: newSession.state.rounds,
           msrp: newSession.state.msrp,
           isDealDone: newSession.state.isDealDone,
           isWalkedAway: newSession.state.isWalkedAway,
           productId: newSession.state.productId,
        } 
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to start game session" });
  }
};

export const processTurn = async (req, res) => {
  const { sessionId, offer, reason, message, mode } = req.body;
  const userMsg = message || reason || '';
  
  if (!sessionId || !offer) {
      return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const session = await Session.findOne({ sessionId });
    
    if (!session) {
        return res.status(404).json({ message: "Session expired or not found. Please refresh." });
    }
    
    if (session.state.isDealDone || session.state.isWalkedAway) {
        return res.status(400).json({ message: "This negotiation has already concluded." });
    }

    // Update mode in state if provided
    if (mode) session.state.mode = mode;

    // Combine offer and message for the engine's processing
    const fullMessage = `${offer} ${userMsg}`;
    const response = await calculateSellerResponse(fullMessage, session.state);
    
    // Update DB
    session.state = response.newState;
    await session.save();
    
    const sanitizedState = {
      currentOffer: session.state.currentOffer,
      patience: session.state.patience,
      mood: session.state.mood,
      rounds: session.state.rounds,
      msrp: session.state.msrp,
      productId: session.state.productId,
      isDealDone: session.state.isDealDone,
      isWalkedAway: session.state.isWalkedAway
    };

    res.status(200).json({
        sellerResponse: response.message,
        message: response.message,
        isDeal: response.isDeal,
        isWalkAway: response.isWalkAway,
        newState: sanitizedState
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during negotiation" });
  }
};

export const processWalkAway = async (req, res) => {
  const { sessionId } = req.body;
  
  try {
      const session = await Session.findOne({ sessionId });
      if (!session) return res.status(404).json({ message: "Session not found" });
      if (session.state.isDealDone || session.state.isWalkedAway) return res.status(400).json({ message: "Negotiation concluded" });

      const outcome = await handleWalkAway(session.state);
      session.state = outcome.newState;
      await session.save();

      const sanitizedState = {
        currentOffer: session.state.currentOffer,
        patience: session.state.patience,
        mood: session.state.mood,
        rounds: session.state.rounds,
        msrp: session.state.msrp,
        productId: session.state.productId,
        isDealDone: session.state.isDealDone,
        isWalkedAway: session.state.isWalkedAway
      };

      res.status(200).json({
          success: outcome.success,
          message: outcome.message,
          newState: sanitizedState
      });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};

export const submitLeaderboardScore = async (req, res) => {
    const { sessionId, playerName } = req.body;
    
    try {
        const session = await Session.findOne({ sessionId });
        
        if (!session) return res.status(404).json({ message: "Session not found" });
        if (!session.state.isDealDone) return res.status(403).json({ message: "Cheating detected: No deal was finalized." });
        
        const finalPrice = session.state.currentOffer;
        
        const newEntry = new Leaderboard({ name: playerName || "Anonymous", price: finalPrice });
        await newEntry.save();
        
        // Invalidate session so they can't submit multiple times
        await Session.deleteOne({ sessionId });
        
        res.status(201).json({ message: "Score submitted!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit score" });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        // Find top 10 lowest prices
        const records = await Leaderboard.find().sort({ price: 1 }).limit(10);
        res.status(200).json({ success: true, data: records });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
};
