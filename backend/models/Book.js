const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Buchtitel ist erforderlich'],
      trim: true,
      maxlength: [200, 'Titel darf maximal 200 Zeichen haben']
    },

    author: {
      type: [String], // Array für mehrere Autoren
      required: [true, 'Mindestens ein Autor ist erforderlich'],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'Mindestens ein Autor muss angegeben werden'
      }
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Beschreibung darf maximal 1000 Zeichen haben']
    },

    publisher: {
      type: String,
      trim: true,
      maxlength: [100, 'Verlag darf maximal 100 Zeichen haben']
    },

    // BOOKS API INTEGRATION
    
    bookId: {
      type: String, 
      unique: true,
      sparse: true 
    },

    imageUrl: {
      type: String,
      trim: true,
      default: ''  
    },

    link: {
      type: String, 
      trim: true
    },

  
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buch muss einem Besitzer zugeordnet sein']
    },

    status: {
      type: String,
      enum: {
        values: ['available', 'pending', 'traded'],
        message: 'Status muss available, pending oder traded sein'
      },
      default: 'available'
    },

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

bookSchema.index({ owner: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ title: 'text', author: 'text' }); 

// Autoren als String 
bookSchema.virtual('authorString').get(function () {
  return this.author ? this.author.join(', ') : 'Unbekannt';
});

// Ist das Buch verfügbar?
bookSchema.virtual('isAvailable').get(function () {
  return this.status === 'available';
});

// Status ändern
bookSchema.methods.setStatus = function (newStatus) {
  const validStatuses = ['available', 'pending', 'traded'];
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Ungültiger Status');
  }
  this.status = newStatus;
  return this.save();
};

// Buch zu "pending" setzen (wenn Trade-Request erstellt wird)
bookSchema.methods.markAsPending = function () {
  return this.setStatus('pending');
};

// Buch zu "available" setzen (wenn Trade abgelehnt wird)
bookSchema.methods.markAsAvailable = function () {
  return this.setStatus('available');
};

// Buch zu "traded" setzen (wenn Trade akzeptiert wird)
bookSchema.methods.markAsTraded = function () {
  return this.setStatus('traded');
};

// Vor dem Löschen: Entferne Buch aus User's addedBooks Array
bookSchema.pre('remove', async function (next) {
  try {
    await mongoose.model('User').updateOne(
      { _id: this.owner },
      { $pull: { addedBooks: this._id } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Book', bookSchema);