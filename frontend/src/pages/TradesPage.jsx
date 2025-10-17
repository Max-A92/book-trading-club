import { useState, useEffect } from 'react';
import tradeService from '../services/tradeService';
import './TradesPage.css';

const TradesPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tradeService.getAllTrades();
      // Nur approved Trades anzeigen
      const approvedTrades = (response.trades || []).filter(
        (trade) => trade.status === 'approved'
      );
      setTrades(approvedTrades);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError('Fehler beim Laden der Trades');
    } finally {
      setLoading(false);
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`status-badge status-badge--${status}`}>
      {status === 'approved' ? '✓ Abgeschlossen' : status}
    </span>
  );

  const TradeCard = ({ trade }) => (
    <div className="trade-card">
      <div className="trade-card__header">
        <div className="trade-card__participants">
          <span>👤 {trade.requester?.username}</span>
          <span className="trade-card__arrow">⇄</span>
          <span>👤 {trade.owner?.username}</span>
        </div>
        <StatusBadge status={trade.status} />
      </div>

      <div className="trade-card__content">
        <div className="trade-card__book">
          <strong>Getauschtes Buch:</strong>
          <p>{trade.book?.title}</p>
          <small>von {trade.book?.author}</small>
        </div>

        <div className="trade-card__dates">
          <div className="trade-card__date">
            <small>Anfrage: {new Date(trade.createdAt).toLocaleDateString('de-DE')}</small>
          </div>
          <div className="trade-card__date">
            <small>Akzeptiert: {new Date(trade.updatedAt).toLocaleDateString('de-DE')}</small>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="trades-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Trades werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trades-page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button onClick={fetchTrades} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="trades-page">
      <div className="container">
        {/* Header */}
        <div className="trades-page__header">
          <div>
            <h1>Trade History</h1>
            <p className="trades-page__subtitle">
              {trades.length} abgeschlossene{' '}
              {trades.length === 1 ? 'Trade' : 'Trades'}
            </p>
          </div>
        </div>

        {/* Trades List */}
        {trades.length === 0 ? (
          <div className="trades-empty">
            <div className="trades-empty__icon">📦</div>
            <h2>Noch keine Trades</h2>
            <p>Hier erscheinen alle abgeschlossenen Trades.</p>
          </div>
        ) : (
          <div className="trades-grid">
            {trades.map((trade) => (
              <TradeCard key={trade._id} trade={trade} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradesPage;