import { useState } from 'react';
import { formatWhatsappMessage } from '../utils/formatWhatsappMessage.js';

export default function WhatsAppCopyBox({ shoppingList, menu }) {
  const [copied, setCopied] = useState(false);
  const message = formatWhatsappMessage(shoppingList);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="shopping-card" aria-label="סיכום ארוחת שבת">
      <div className="shopping-header">
        <div>
          <h2>סיכום לשבת</h2>
          <p>תפריט, קישורי מתכונים ורשימת קניות מוכנה לוואטסאפ.</p>
        </div>
        <button type="button" onClick={handleCopy}>
          {copied ? 'הועתק ✓' : 'העתקה לוואטסאפ'}
        </button>
      </div>

      <div className="menu-section">
        <h3>התפריט</h3>
        <ul>
          {menu.map((item) => (
            <li key={item.id}>
              <span>{item.emoji}</span>
              <a href={item.url}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>

      <pre>{message || 'רשימת הקניות תופיע כאן אחרי חיבור המאגר האמיתי.'}</pre>
    </section>
  );
}
