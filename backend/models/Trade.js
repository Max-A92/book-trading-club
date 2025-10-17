const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trade muss von einem User erstellt werden'],
      index: true
    },

    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trade muss an einen User gerichtet sein'],
      index: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Trade muss ein Buch beinhalten'],
      index: true
    },

    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status muss pending, approved oder rejected sein'
      },
      default: 'pending',
      index: true
    },

    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Nachricht darf maximal 500 Zeichen haben']
    },

    createdAt: {
      type: Date,
      default: Date.now
    },

    updatedAt: {
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

// Verhindert mehrfache Trade-Requests für dasselbe Buch vom selben User
tradeSchema.index({ from: 1, book: 1, status: 1 });

// Schnelle Abfragen für einen User's eingehende/ausgehende Requests
tradeSchema.index({ to: 1, status: 1 });
tradeSchema.index({ from: 1, status: 1 });

// Ist der Trade noch pending?
tradeSchema.virtual('isPending').get(function () {
  return this.status === 'pending';
});

// Wurde der Trade akzeptiert?
tradeSchema.virtual('isApproved').get(function () {
  return this.status === 'approved';
});

// Wurde der Trade abgelehnt?
tradeSchema.virtual('isRejected').get(function () {
  return this.status === 'rejected';
});

// Trade akzeptieren
tradeSchema.methods.approve = async function () {
  if (this.status !== 'pending') {
    throw new Error('Nur pending Trades können akzeptiert werden');
  }

  const Book = mongoose.model('Book');
  const User = mongoose.model('User');

  try {
    // 1. Trade Status auf "approved" setzen
    this.status = 'approved';
    this.updatedAt = Date.now();

    // 2. Buch-Owner ändern (von "to" zu "from")
    const book = await Book.findById(this.book);
    if (!book) {
      throw new Error('Buch nicht gefunden');
    }

    const oldOwner = book.owner;
    const newOwner = this.from;

    // 3. Buch zum neuen Owner verschieben
    book.owner = newOwner;
    book.status = 'available'; // Wieder verfügbar für neuen Owner

    // 4. User's addedBooks Arrays aktualisieren
    await User.findByIdAndUpdate(oldOwner, {
      $pull: { addedBooks: book._id }
    });

    await User.findByIdAndUpdate(newOwner, {
      $addToSet: { addedBooks: book._id }
    });

    // 5. Speichern
    await book.save();
    await this.save();

    return this;
  } catch (error) {
    throw new Error(`Fehler beim Trade-Akzeptieren: ${error.message}`);
  }
};

// Trade ablehnen
tradeSchema.methods.reject = async function () {
  if (this.status !== 'pending') {
    throw new Error('Nur pending Trades können abgelehnt werden');
  }

  const Book = mongoose.model('Book');

  try {
    // 1. Trade Status auf "rejected" setzen
    this.status = 'rejected';
    this.updatedAt = Date.now();

    // 2. Buch wieder auf "available" setzen
    await Book.findByIdAndUpdate(this.book, {
      status: 'available'
    });

    // 3. Speichern
    await this.save();

    return this;
  } catch (error) {
    throw new Error(`Fehler beim Trade-Ablehnen: ${error.message}`);
  }
};

// Alle pending Trades für einen User finden
tradeSchema.statics.findPendingForUser = function (userId) {
  return this.find({ to: userId, status: 'pending' })
    .populate('from', 'username fullName city state')
    .populate('book', 'title author imageUrl')
    .sort({ createdAt: -1 });
};

// Alle ausgehenden Trades eines Users
tradeSchema.statics.findOutgoingForUser = function (userId) {
  return this.find({ from: userId })
    .populate('to', 'username fullName city state')
    .populate('book', 'title author imageUrl')
    .sort({ createdAt: -1 });
};

// Vor dem Speichern: Validierung
tradeSchema.pre('save', function (next) {
  // User kann nicht mit sich selbst traden
  if (this.from.toString() === this.to.toString()) {
    return next(new Error('Du kannst nicht mit dir selbst traden'));
  }
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);