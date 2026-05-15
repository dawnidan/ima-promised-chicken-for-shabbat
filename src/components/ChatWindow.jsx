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

      <form className="chat-form" onSubmit={onSubmit}>
        <input
          type="text"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="כתבי משהו כמו: יש לי עוף ותפוחי אדמה..."
          disabled={isLoading}
        />
        <button type="submit" aria-label="שליחה" disabled={isLoading}>
          {isLoading ? 'רגע...' : 'שליחה'}
        </button>
      </form>

      <div className="chat-actions">
        <button type="button" onClick={onFinishConversation} disabled={isConversationComplete || isLoading}>
          {isConversationComplete ? 'השיחה הסתיימה' : 'סיימתי, הכיני לי סיכום'}
        </button>
      </div>
    </section>
  );
}
