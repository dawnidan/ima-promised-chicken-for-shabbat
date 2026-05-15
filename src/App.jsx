import { useState } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import RecipeNotebookHeader from './components/RecipeNotebookHeader.jsx';
import WhatsAppCopyBox from './components/WhatsAppCopyBox.jsx';
import recipes from './data/recipes.json';

const initialMessages = [
  {
    role: 'assistant',
    text: 'שלום שלום. לכמה סועדים מתכננים את ארוחת השבת?',
  },
];

const followUpResponses = [
  'יופי. יש העדפות, רגישויות או מנות שחייבות להיות על השולחן?',
  'רשמתי. יש לך חשק לארוחה יותר קלאסית, קלילה או מושקעת?',
  'מעולה, נראה שיש לנו כיוון טוב. אפשר להוסיף עוד פרט אחד, או לסיים ולקבל תפריט מסודר.',
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isConversationComplete, setIsConversationComplete] = useState(false);

  const addConversationTurn = (message, response) => {
    setMessages((current) => [
      ...current,
      { role: 'user', text: message },
      { role: 'assistant', text: response },
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    const assistantTurns = messages.filter((message) => message.role === 'assistant').length;
    const response =
      followUpResponses[assistantTurns - 1] ??
      'נשמע טוב. כשאת מוכנה, לחצי על "סיימתי" ואסדר הכול לתפריט ולרשימת קניות.';

    addConversationTurn(trimmed, response);
    setInput('');
  };

  const handleFinishConversation = () => {
    if (isConversationComplete) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        text: 'סגרנו שבת. הכנתי לך תפריט, קישורי מתכונים ורשימת קניות מסודרת.',
      },
    ]);
    setIsConversationComplete(true);
  };

  return (
    <main className="app-shell">
      <RecipeNotebookHeader />
      <ChatWindow
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        onFinishConversation={handleFinishConversation}
        isConversationComplete={isConversationComplete}
      />
      {isConversationComplete && (
        <WhatsAppCopyBox shoppingList={recipes.shoppingList} menu={recipes.shabbatMenu} />
      )}
    </main>
  );
}
