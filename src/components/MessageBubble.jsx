export default function MessageBubble({ role, text }) {
  const avatar = role === 'assistant' ? '🥄' : '👩';

  return (
    <div className={`message-row ${role}`}>
      <span className="message-avatar" aria-hidden="true">
        {avatar}
      </span>
      <p className={`message ${role}`}>{text}</p>
    </div>
  );
}
