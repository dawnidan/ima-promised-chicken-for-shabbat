import MessageBubble from './MessageBubble.jsx';

export default function ChatWindow({ messages, input, onInputChange, onSubmit }) {
  return (
    <section className="chat-card" aria-label="צ'אט">
      <div className="chat-header">
        <span>העוזרת של שבת</span>
        <small>זמינה גם כשאין כוח לחשוב</small>
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
        />
        <button type="submit" aria-label="שליחה">
          שליחה
        </button>
      </form>
    </section>
  );
}
