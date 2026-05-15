export default function MessageBubble({ role, text }) {
  return <p className={`message ${role}`}>{text}</p>;
}
