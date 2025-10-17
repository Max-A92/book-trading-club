import { useState } from 'react';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Nachricht schreiben... (Enter zum Senden, Shift+Enter für neue Zeile)"
        className="message-input__textarea"
        disabled={disabled}
        rows={1}
        maxLength={1000}
      />
      <button
        type="submit"
        className="message-input__button"
        disabled={!message.trim() || disabled}
      >
        <span className="message-input__icon">📤</span>
        <span className="message-input__text">Senden</span>
      </button>
    </form>
  );
};

export default MessageInput;