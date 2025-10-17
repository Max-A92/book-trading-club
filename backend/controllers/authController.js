const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, // Secret Key
    { expiresIn: '30d' } // Token gültig für 30 Tage
  );
};

const register = async (req, res) => {
  try {
    const { username, email, password, fullName, city, state } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Bitte alle Pflichtfelder ausfüllen (username, email, password)'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email
          ? 'Email bereits registriert'
          : 'Username bereits vergeben'
      });
    }

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      fullName,
      city,
      state
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registrierung erfolgreich',
      user: user.toAuthJSON(),
      token
    });
  } catch (error) {
    console.error('Register error:', error);

    // Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validierungsfehler',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Fehler bei der Registrierung',
      error: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Bitte Username und Passwort eingeben'
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase()
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Ungültige Anmeldedaten'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login erfolgreich',
      user: user.toAuthJSON(),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Login',
      error: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    // req.user kommt von protect Middleware
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('addedBooks', 'title author imageUrl status');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, city, state } = req.body;

    // User finden und updaten
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User nicht gefunden'
      });
    }

    // Felder updaten 
    if (fullName !== undefined) user.fullName = fullName;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profil erfolgreich aktualisiert',
      user: user.toAuthJSON()
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Update',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile
};