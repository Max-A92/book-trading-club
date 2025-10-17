const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  getUserByUsername
} = require('../controllers/userController');

router.get('/', getAllUsers);

router.get('/username/:username', getUserByUsername);

router.get('/:id', getUserById);

module.exports = router;