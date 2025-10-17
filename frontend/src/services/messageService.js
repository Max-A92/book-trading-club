import api from './api';

const messageService = {

  sendMessage: async (receiverId, text, relatedBook = null) => {
    try {
      const response = await api.post('/messages', {
        receiver: receiverId,
        text,
        relatedBook
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getConversation: async (userId) => {
    try {
      const response = await api.get(`/messages/conversation/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get('/messages/unread-count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  markAsRead: async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }

};

export default messageService;