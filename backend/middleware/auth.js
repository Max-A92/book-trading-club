const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Token extrahieren: "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Benutzer nicht gefunden'
        });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error.message);

      // Token ungültig oder abgelaufen
      return res.status(401).json({
        success: false,
        message: 'Token ungültig oder abgelaufen',
        error: error.message
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Nicht autorisiert - Kein Token vorhanden'
    });
  }
};

const protectWithCookie = async (req, res, next) => {
  let token;

  // Token aus Cookie oder Header
  token = req.cookies.token || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Nicht autorisiert - Kein Token vorhanden'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Benutzer nicht gefunden'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token ungültig oder abgelaufen'
    });
  }
};

module.exports = { protect, protectWithCookie };