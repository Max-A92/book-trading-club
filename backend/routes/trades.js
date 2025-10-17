const express = require('express');
const router = express.Router();
const {
  createTradeRequest,
  getAllTrades,
  getIncomingRequests,
  getOutgoingRequests,
  approveTradeRequest,
  rejectTradeRequest,
  cancelTradeRequest
} = require('../controllers/tradeController');
const { protect } = require('../middleware/auth');

router.get('/', getAllTrades);

router.post('/', protect, createTradeRequest);

router.get('/incoming', protect, getIncomingRequests);

router.get('/outgoing', protect, getOutgoingRequests);

router.put('/:id/approve', protect, approveTradeRequest);

router.put('/:id/reject', protect, rejectTradeRequest);

router.delete('/:id', protect, cancelTradeRequest);

module.exports = router;