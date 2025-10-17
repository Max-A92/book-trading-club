const Message = require('../models/Message');
const User = require('../models/User');

const sendMessage = async (req, res) => {
  try {
    const { receiver, text, relatedBook } = req.body;

    // Validierung
    if (!receiver || !text) {
      return res.status(400).json({
        success: false,
        message: 'Empfänger und Nachricht sind erforderlich'
      });
    }

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nachricht darf nicht leer sein'
      });
    }

    // Prüfe ob Empfänger existiert
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        message: 'Empfänger nicht gefunden'
      });
    }

    // Prüfe User kann sich nicht selbst schreiben
    if (receiver === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Du kannst dir nicht selbst schreiben'
      });
    }

    // Nachricht erstellen
    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text: text.trim(),
      relatedBook: relatedBook || null
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username fullName')
      .populate('receiver', 'username fullName')
      .populate('relatedBook', 'title author imageUrl');

    const io = req.app.get('io');
    if (io) {
      io.emit('send_message', {
        receiverId: receiver,
        message: populatedMessage
      });
    }

    res.status(201).json({
      success: true,
      message: 'Nachricht gesendet',
      data: populatedMessage
    });
  } catch (error) {
    console.error('SendMessage error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Senden der Nachricht',
      error: error.message
    });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prüfe ob User existiert
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User nicht gefunden'
      });
    }

    // Hole Konversation
    const messages = await Message.getConversation(req.user._id, userId);

    // Markiere empfangene Nachrichten als gelesen
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('GetConversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const getConversations = async (req, res) => {
  try {
    // Hole alle Nachrichten wo User involviert ist
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
      .populate('sender', 'username fullName')
      .populate('receiver', 'username fullName')
      .sort({ createdAt: -1 });

    // Gruppiere nach Chat-Partner
    const conversationsMap = new Map();

    messages.forEach(msg => {
      // Bestimme Chat-Partner
      const partnerId = msg.sender._id.toString() === req.user._id.toString()
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();

      // Wenn noch nicht vorhanden, füge hinzu
      if (!conversationsMap.has(partnerId)) {
        const partner = msg.sender._id.toString() === req.user._id.toString()
          ? msg.receiver
          : msg.sender;

        conversationsMap.set(partnerId, {
          partner: {
            _id: partner._id,
            username: partner.username,
            fullName: partner.fullName
          },
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    // Zähle ungelesene Nachrichten pro Partner
    for (let [partnerId, conversation] of conversationsMap) {
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        receiver: req.user._id,
        isRead: false
      });
      conversation.unreadCount = unreadCount;
    }

    // Konvertiere Map zu Array
    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('GetConversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countUnreadMessages(req.user._id);

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('GetUnreadCount error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Nachricht nicht gefunden'
      });
    }

    // Nur Empfänger kann als gelesen markieren
    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert'
      });
    }

    await message.markAsRead();

    res.status(200).json({
      success: true,
      message: 'Als gelesen markiert'
    });
  } catch (error) {
    console.error('MarkAsRead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead
};