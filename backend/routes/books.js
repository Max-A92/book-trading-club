const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  getMyBooks,
  addBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

router.get('/', getAllBooks);
router.get('/:id', getBookById);

router.get('/user/my-books', protect, getMyBooks);

router.post('/', protect, addBook);

router.put('/:id', protect, updateBook);

router.delete('/:id', protect, deleteBook);

module.exports = router;