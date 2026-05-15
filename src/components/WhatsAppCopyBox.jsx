import { useState } from 'react';
import { formatWhatsappMessage } from '../utils/formatWhatsappMessage.js';

export default function WhatsAppCopyBox({ shoppingList }) {
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
    <section className="shopping-card" aria-label="רשימת קניות לדוגמה">
      <div className="shopping-header">
        <div>
          <h2>רשימת קניות לוואטסאפ</h2>
          <p>דוגמה מוכנה להעתקה, בלי לסדר ידנית כל שורה.</p>
        </div>
        <button type="button" onClick={handleCopy}>
          {copied ? 'הועתק ✓' : 'העתקה לוואטסאפ'}
        </button>
      </div>

      <pre>{message}</pre>
    </section>
  );
}
