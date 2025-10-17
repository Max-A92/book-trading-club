const Book = require('../models/Book');
const User = require('../models/User');

const getAllBooks = async (req, res) => {
  try {
    // Pagination Parameter aus Query String
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Filter-Parameter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Gesamt-Anzahl der Bücher (für Pagination-Info)
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    // Bücher mit Pagination abrufen
    const books = await Book.find(filter)
      .populate('owner', 'username fullName city state')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: books.length,
      totalBooks,
      totalPages,
      currentPage: page,
      books
    });
  } catch (error) {
    console.error('GetAllBooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Abrufen der Bücher',
      error: error.message
    });
  }
};

const getMyBooks = async (req, res) => {
  try {
    // Pagination Parameter
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Gesamt-Anzahl meiner Bücher
    const totalBooks = await Book.countDocuments({ owner: req.user._id });
    const totalPages = Math.ceil(totalBooks / limit);

    // Bücher mit Pagination abrufen
    const books = await Book.find({ owner: req.user._id })
      .populate('owner', 'username fullName city state')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: books.length,
      totalBooks,
      totalPages,
      currentPage: page,
      books
    });
  } catch (error) {
    console.error('GetMyBooks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'username fullName city state');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buch nicht gefunden'
      });
    }

    res.status(200).json({
      success: true,
      book
    });
  } catch (error) {
    console.error('GetBookById error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const addBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      publisher,
      imageUrl,
      bookId,
      link
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Titel und Autor sind Pflichtfelder'
      });
    }

    const authorArray = Array.isArray(author) ? author : [author];

    const book = await Book.create({
      title,
      author: authorArray,
      description,
      publisher,
      imageUrl,
      bookId,
      link,
      owner: req.user._id,
      status: 'available'
    });

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addedBooks: book._id } }
    );

    const populatedBook = await Book.findById(book._id)
      .populate('owner', 'username fullName city state');

    res.status(201).json({
      success: true,
      message: 'Buch erfolgreich hinzugefügt',
      book: populatedBook
    });
  } catch (error) {
    console.error('AddBook error:', error);

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
      message: 'Server Fehler beim Hinzufügen des Buches',
      error: error.message
    });
  }
};

const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buch nicht gefunden'
      });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert - Du bist nicht der Besitzer dieses Buches'
      });
    }

    book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('owner', 'username fullName city state');

    res.status(200).json({
      success: true,
      message: 'Buch erfolgreich aktualisiert',
      book
    });
  } catch (error) {
    console.error('UpdateBook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buch nicht gefunden'
      });
    }

    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert - Du bist nicht der Besitzer dieses Buches'
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addedBooks: book._id } }
    );

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Buch erfolgreich gelöscht',
      data: {}
    });
  } catch (error) {
    console.error('DeleteBook error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  getMyBooks,
  addBook,
  updateBook,
  deleteBook
};