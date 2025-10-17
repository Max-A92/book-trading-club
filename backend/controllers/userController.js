const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('addedBooks', 'title author imageUrl status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('GetAllUsers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Abrufen der User',
      error: error.message
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('addedBooks', 'title author imageUrl status');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('GetUserById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ 
      username: req.params.username.toLowerCase() 
    })
      .select('-password')
      .populate('addedBooks', 'title author imageUrl status');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('GetUserByUsername error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername
};