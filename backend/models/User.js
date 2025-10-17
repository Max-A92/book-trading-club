const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username ist erforderlich'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username muss mindestens 3 Zeichen haben'],
      maxlength: [20, 'Username darf maximal 20 Zeichen haben'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username darf nur Buchstaben, Zahlen, _ und - enthalten'
      ]
    },

    email: {
      type: String,
      required: [true, 'Email ist erforderlich'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Bitte gib eine gültige Email-Adresse ein'
      ]
    },

    password: {
      type: String,
      required: [true, 'Passwort ist erforderlich'],
      minlength: [6, 'Passwort muss mindestens 6 Zeichen haben'],
      select: false // Passwort wird standardmäßig nicht zurückgegeben
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: [50, 'Name darf maximal 50 Zeichen haben']
    },

    city: {
      type: String,
      trim: true,
      maxlength: [50, 'Stadt darf maximal 50 Zeichen haben']
    },

    state: {
      type: String,
      trim: true,
      maxlength: [50, 'Bundesland/Staat darf maximal 50 Zeichen haben']
    },

    addedBooks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
      }
    ],

    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true, // Erstellt automatisch createdAt und updatedAt
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
  }
);

userSchema.pre('save', async function (next) {
  // Nur hashen wenn Passwort geändert wurde
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generiere Salt und hashe Passwort
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Passwort vergleichen (Login)
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Fehler beim Passwort-Vergleich');
  }
};

// User-Objekt ohne sensible Daten zurückgeben
userSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    fullName: this.fullName,
    city: this.city,
    state: this.state,
    addedBooks: this.addedBooks,
    createdAt: this.createdAt
  };
};

// Location String (Stadt + Bundesland kombiniert)
userSchema.virtual('location').get(function () {
  if (this.city && this.state) {
    return `${this.city}, ${this.state}`;
  }
  if (this.city) return this.city;
  if (this.state) return this.state;
  return 'Nicht angegeben';
});

// Anzahl der hinzugefügten Bücher
userSchema.virtual('bookCount').get(function () {
  return this.addedBooks ? this.addedBooks.length : 0;
});

module.exports = mongoose.model('User', userSchema);