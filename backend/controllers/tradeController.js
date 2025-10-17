const Trade = require('../models/Trade');
const Book = require('../models/Book');
const User = require('../models/User');

const createTradeRequest = async (req, res) => {
  try {
    const { bookId, message } = req.body;

    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: 'Book ID ist erforderlich'
      });
    }

    const book = await Book.findById(bookId).populate('owner', 'username email');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Buch nicht gefunden'
      });
    }

    // Kann nicht eigenes Buch anfragen
    if (book.owner._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Du kannst dein eigenes Buch nicht anfragen'
      });
    }

    // Buch muss verfügbar sein
    if (book.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Dieses Buch ist nicht verfügbar'
      });
    }

    // Prüfen ob bereits ein pending Request existiert
    const existingRequest = await Trade.findOne({
      from: req.user._id,
      book: bookId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Du hast bereits eine offene Anfrage für dieses Buch'
      });
    }

    const trade = await Trade.create({
      from: req.user._id,
      to: book.owner._id,
      book: bookId,
      status: 'pending',
      message
    });

    book.status = 'pending';
    await book.save();

    // Populated trade zurückgeben
    const populatedTrade = await Trade.findById(trade._id)
      .populate('from', 'username fullName city state')
      .populate('to', 'username fullName city state')
      .populate('book', 'title author imageUrl');

    res.status(201).json({
      success: true,
      message: 'Trade-Anfrage erfolgreich erstellt',
      trade: populatedTrade
    });
  } catch (error) {
    console.error('CreateTradeRequest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Erstellen der Trade-Anfrage',
      error: error.message
    });
  }
};

const getAllTrades = async (req, res) => {
  try {
    const trades = await Trade.find()
      .populate('from', 'username fullName city state')
      .populate('to', 'username fullName city state')
      .populate('book', 'title author imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      trades
    });
  } catch (error) {
    console.error('GetAllTrades error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const trades = await Trade.find({ to: req.user._id })
      .populate('from', 'username fullName city state')
      .populate('book', 'title author imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      trades
    });
  } catch (error) {
    console.error('GetIncomingRequests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const getOutgoingRequests = async (req, res) => {
  try {
    const trades = await Trade.find({ from: req.user._id })
      .populate('to', 'username fullName city state')
      .populate('book', 'title author imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      trades
    });
  } catch (error) {
    console.error('GetOutgoingRequests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

const approveTradeRequest = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('book')
      .populate('from', 'username')
      .populate('to', 'username');

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade nicht gefunden'
      });
    }

    // Nur der Buch-Owner (to) kann akzeptieren
    if (trade.to._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert - Du bist nicht der Besitzer des Buches'
      });
    }

    // Trade muss pending sein
    if (trade.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Dieser Trade kann nicht mehr akzeptiert werden'
      });
    }

    await trade.approve();

    // Populated trade zurückgeben
    const updatedTrade = await Trade.findById(trade._id)
      .populate('from', 'username fullName city state')
      .populate('to', 'username fullName city state')
      .populate('book', 'title author imageUrl owner');

    res.status(200).json({
      success: true,
      message: 'Trade erfolgreich akzeptiert - Buch wurde übertragen',
      trade: updatedTrade
    });
  } catch (error) {
    console.error('ApproveTradeRequest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Akzeptieren des Trades',
      error: error.message
    });
  }
};

const rejectTradeRequest = async (req, res) => {
  try {
    
    const trade = await Trade.findById(req.params.id)
      .populate('book')
      .populate('from', 'username')
      .populate('to', 'username');

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade nicht gefunden'
      });
    }

    // Nur der Buch-Owner (to) kann ablehnen
    if (trade.to._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert - Du bist nicht der Besitzer des Buches'
      });
    }

    // Trade muss pending sein
    if (trade.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Dieser Trade kann nicht mehr abgelehnt werden'
      });
    }

    await trade.reject();

    // Populated trade zurückgeben
    const updatedTrade = await Trade.findById(trade._id)
      .populate('from', 'username fullName city state')
      .populate('to', 'username fullName city state')
      .populate('book', 'title author imageUrl');

    res.status(200).json({
      success: true,
      message: 'Trade abgelehnt - Buch ist wieder verfügbar',
      trade: updatedTrade
    });
  } catch (error) {
    console.error('RejectTradeRequest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler beim Ablehnen des Trades',
      error: error.message
    });
  }
};

const cancelTradeRequest = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id).populate('book');

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade nicht gefunden'
      });
    }

    // Nur der Requester (from) kann canceln
    if (trade.from.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Nicht autorisiert - Du hast diese Anfrage nicht erstellt'
      });
    }

    // Nur pending Trades können gecancelt werden
    if (trade.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Nur offene Anfragen können gecancelt werden'
      });
    }

    // Buch wieder auf available setzen
    if (trade.book) {
      await Book.findByIdAndUpdate(trade.book._id, { status: 'available' });
    }

    // Trade löschen
    await trade.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Trade-Anfrage erfolgreich gecancelt',
      data: {}
    });
  } catch (error) {
    console.error('CancelTradeRequest error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Fehler',
      error: error.message
    });
  }
};

module.exports = {
  createTradeRequest,
  getAllTrades,
  getIncomingRequests,
  getOutgoingRequests,
  approveTradeRequest,
  rejectTradeRequest,
  cancelTradeRequest
};