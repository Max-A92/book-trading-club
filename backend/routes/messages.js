const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// Alle Routes sind geschützt
router.use(protect);

// Nachricht senden
router.post('/', sendMessage);

// Alle Konversationen (Übersicht)
router.get('/conversations', getConversations);

// Ungelesene Nachrichten zählen
router.get('/unread-count', getUnreadCount);

// Konversation mit bestimmtem User
router.get('/conversation/:userId', getConversation);

// Nachricht als gelesen markieren
router.put('/:messageId/read', markAsRead);

module.exports = router;