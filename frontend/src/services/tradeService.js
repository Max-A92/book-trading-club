import api from './api';

const tradeService = {
  getAllTrades: async () => {
    const response = await api.get('/trades');
    return response.data;
  },

  getIncomingRequests: async () => {
    const response = await api.get('/trades/incoming');
    return response.data;
  },

  getOutgoingRequests: async () => {
    const response = await api.get('/trades/outgoing');
    return response.data;
  },

  createTradeRequest: async (bookId) => {
    const response = await api.post('/trades', { bookId }); 
    return response.data;
  },

  approveTrade: async (tradeId) => {
    const response = await api.put(`/trades/${tradeId}/approve`);
    return response.data;
  },

  rejectTrade: async (tradeId) => {
    const response = await api.put(`/trades/${tradeId}/reject`);
    return response.data;
  },

  cancelTrade: async (tradeId) => {
    const response = await api.delete(`/trades/${tradeId}`);
    return response.data;
  },
};

export default tradeService;