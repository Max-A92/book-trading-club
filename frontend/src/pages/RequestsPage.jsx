import { useState, useEffect } from 'react';
import tradeService from '../services/tradeService';
import './RequestsPage.css';

const RequestsPage = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const [incomingRes, outgoingRes] = await Promise.all([
        tradeService.getIncomingRequests(),
        tradeService.getOutgoingRequests(),
      ]);

      setIncomingRequests(incomingRes.trades || []);
      setOutgoingRequests(outgoingRes.trades || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Fehler beim Laden der Anfragen');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (tradeId) => {
    try {
      await tradeService.approveTrade(tradeId);
      // Requests neu laden
      await fetchRequests();
    } catch (err) {
      console.error('Error approving trade:', err);
      alert('Fehler beim Akzeptieren der Anfrage');
    }
  };

  const handleReject = async (tradeId) => {
    try {
      await tradeService.rejectTrade(tradeId);
      // Requests neu laden
      await fetchRequests();
    } catch (err) {
      console.error('Error rejecting trade:', err);
      alert('Fehler beim Ablehnen der Anfrage');
    }
  };

  const handleCancel = async (tradeId) => {
    if (!window.confirm('Möchtest du diese Anfrage wirklich zurückziehen?')) {
      return;
    }

    try {
      await tradeService.cancelTrade(tradeId);
      // Requests neu laden
      await fetchRequests();
    } catch (err) {
      console.error('Error canceling trade:', err);
      alert('Fehler beim Zurückziehen der Anfrage');
    }
  };

  const StatusBadge = ({ status }) => {
    const statusClass = `status-badge status-badge--${status}`;
    const statusText = {
      pending: 'Ausstehend',
      approved: 'Akzeptiert',
      rejected: 'Abgelehnt',
    };

    return <span className={statusClass}>{statusText[status]}</span>;
  };

  const RequestCard = ({ trade, type }) => (
    <div className="request-card">
      <div className="request-card__header">
        <h3 className="request-card__title">
          {type === 'incoming'
            ? `Von: ${trade.requester?.username}`
            : `An: ${trade.owner?.username}`}
        </h3>
        <StatusBadge status={trade.status} />
      </div>

      <div className="request-card__content">
        <div className="request-card__book">
          <strong>Angefragtes Buch:</strong>
          <p>{trade.book?.title}</p>
          <small>von {trade.book?.author}</small>
        </div>

        <div className="request-card__date">
          <small>
            Anfrage vom: {new Date(trade.createdAt).toLocaleDateString('de-DE')}
          </small>
        </div>
      </div>

      {/* Action Buttons */}
      {trade.status === 'pending' && (
        <div className="request-card__actions">
          {type === 'incoming' ? (
            <>
              <button
                onClick={() => handleApprove(trade._id)}
                className="btn btn-success btn-sm"
              >
                ✓ Akzeptieren
              </button>
              <button
                onClick={() => handleReject(trade._id)}
                className="btn btn-danger btn-sm"
              >
                ✕ Ablehnen
              </button>
            </>
          ) : (
            <button
              onClick={() => handleCancel(trade._id)}
              className="btn btn-outline btn-sm"
            >
              Zurückziehen
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="requests-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Anfragen werden geladen...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-page">
        <div className="container">
          <div className="alert alert-danger">{error}</div>
          <button onClick={fetchRequests} className="btn btn-primary">
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const currentRequests =
    activeTab === 'incoming' ? incomingRequests : outgoingRequests;

  return (
    <div className="requests-page">
      <div className="container">
        {/* Header */}
        <div className="requests-page__header">
          <h1>Trade Requests</h1>
          <p className="requests-page__subtitle">
            Verwalte deine eingehenden und ausgehenden Trade-Anfragen
          </p>
        </div>

        {/* Tabs */}
        <div className="requests-tabs">
          <button
            className={`requests-tab ${
              activeTab === 'incoming' ? 'requests-tab--active' : ''
            }`}
            onClick={() => setActiveTab('incoming')}
          >
            Eingehend ({incomingRequests.length})
          </button>
          <button
            className={`requests-tab ${
              activeTab === 'outgoing' ? 'requests-tab--active' : ''
            }`}
            onClick={() => setActiveTab('outgoing')}
          >
            Ausgehend ({outgoingRequests.length})
          </button>
        </div>

        {/* Requests List */}
        {currentRequests.length === 0 ? (
          <div className="requests-empty">
            <div className="requests-empty__icon">📬</div>
            <h2>Keine Anfragen</h2>
            <p>
              {activeTab === 'incoming'
                ? 'Du hast keine eingehenden Trade-Anfragen.'
                : 'Du hast keine ausgehenden Trade-Anfragen.'}
            </p>
          </div>
        ) : (
          <div className="requests-grid">
            {currentRequests.map((trade) => (
              <RequestCard key={trade._id} trade={trade} type={activeTab} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsPage;