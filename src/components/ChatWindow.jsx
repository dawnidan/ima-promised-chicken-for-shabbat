import MessageBubble from './MessageBubble.jsx';

export default function ChatWindow({
  messages,
  input,
  onInputChange,
  onSubmit,
  onFinishConversation,
  isConversationComplete,
  isLoading,
}) {
  return (
    <section className="chat-card" aria-label="צ'אט">
      <div className="chat-header">
        <div>
          <span>העוזרת של שבת</span>
          <small>זמינה גם כשאין כוח לחשוב</small>
        </div>
        <em>●</em>
      </div>

      <div className="chat-window">
        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}`} role={message.role} text={message.text} />
        ))}
      </div>

      <div className="composer-shell">
        <form className="chat-form" onSubmit={onSubmit}>
          <input
            type="text"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="כתבי הודעה..."
            disabled={isLoading}
          />
          <button type="submit" aria-label="שליחה" disabled={isLoading}>
            {isLoading ? '...' : 'שליחה'}
          </button>
        </form>

        <div className="chat-actions">
          <button
            type="button"
            onClick={onFinishConversation}
            disabled={isConversationComplete || isLoading}
          >
            {isConversationComplete ? 'השיחה הסתיימה' : 'סיימתי, הכיני לי סיכום'}
          </button>
        </div>
      </div>
    </section>
  );
}
