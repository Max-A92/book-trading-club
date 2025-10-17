const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    // Absender der Nachricht
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Absender ist erforderlich']
    },

    // Empfänger der Nachricht
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Empfänger ist erforderlich']
    },

    // Nachrichteninhalt
    text: {
      type: String,
      required: [true, 'Nachricht darf nicht leer sein'],
      trim: true,
      maxlength: [1000, 'Nachricht darf maximal 1000 Zeichen haben']
    },

    // Gelesen Status
    isRead: {
      type: Boolean,
      default: false
    },

    // Gelesen am
    readAt: {
      type: Date,
      default: null
    },

    // Verknüpfung zu einem Buch (wenn Chat über Buch entsteht)
    relatedBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null
    },

    // Erstellt am
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index für schnelle Abfrage von Konversationen
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, sender: 1, createdAt: -1 });

// Index für ungelesene Nachrichten
messageSchema.index({ receiver: 1, isRead: 1 });

// Nachricht als gelesen markieren
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Hole alle Nachrichten zwischen zwei Usern
messageSchema.statics.getConversation = async function(userId1, userId2) {
  return this.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 }
    ]
  })
    .populate('sender', 'username fullName')
    .populate('receiver', 'username fullName')
    .populate('relatedBook', 'title author imageUrl')
    .sort({ createdAt: 1 }); // Älteste zuerst
};

// Hole letzte Nachricht zwischen zwei Usern
messageSchema.statics.getLastMessage = async function(userId1, userId2) {
  return this.findOne({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 }
    ]
  })
    .populate('sender', 'username fullName')
    .populate('receiver', 'username fullName')
    .sort({ createdAt: -1 }); // Neueste zuerst
};

// Zähle ungelesene Nachrichten für einen User
messageSchema.statics.countUnreadMessages = async function(userId) {
  return this.countDocuments({
    receiver: userId,
    isRead: false
  });
};

module.exports = mongoose.model('Message', messageSchema);