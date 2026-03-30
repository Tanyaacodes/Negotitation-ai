import express from 'express';
import { 
    startSession, 
    processTurn, 
    processWalkAway, 
    submitLeaderboardScore, 
    getLeaderboard 
} from '../controllers/game.controller.js';

const router = express.Router();

router.post('/start', startSession);
router.post('/turn', processTurn);
router.post('/walkaway', processWalkAway);
router.post('/leaderboard', submitLeaderboardScore);
router.get('/leaderboard', getLeaderboard);

export default router;
