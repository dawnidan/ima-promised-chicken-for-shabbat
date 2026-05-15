import { useState } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import QuickPromptButtons from './components/QuickPromptButtons.jsx';
import RecipeNotebookHeader from './components/RecipeNotebookHeader.jsx';
import WhatsAppCopyBox from './components/WhatsAppCopyBox.jsx';
import recipes from './data/recipes.json';

const quickPrompts = [
  {
    label: '🍲 עזור לי לבנות תפריט לשבת',
    message: 'עזור לי לבנות תפריט לשבת',
    response:
      'בשמחה. נתחיל רגוע: מרק, עוף, תוספת אחת, סלט, וקינוח שלא דורש ועדת חקירה. לכמה סועדים מתכננים?',
  },
  {
    label: '📝 אני רוצה להוסיף מתכון למאגר',
    message: 'אני רוצה להוסיף מתכון למאגר',
    response:
      'מעולה. שלחי לי את המתכון כמו שהוא, גם אם הוא נראה כמו צילום מסך אחרי מלחמה. אני אסדר אותו לרכיבים ושלבים.',
  },
  {
    label: '❓ איך להשתמש בך?',
    message: 'איך להשתמש בך?',
    response:
      'אפשר לבקש ממני לבנות תפריט, להפוך מתכון מבולגן למסודר, או להכין רשימת קניות מוכנה להדבקה בוואטסאפ.',
  },
];

const initialMessages = [
  {
    role: 'assistant',
    text: 'שלום שלום. מה נכין לשבת לפני שמישהו יפתח עוד שקית ביסלי במקום ארוחת ערב?',
  },
];

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const addConversationTurn = (message, response) => {
    setMessages((current) => [
      ...current,
      { role: 'user', text: message },
      { role: 'assistant', text: response },
    ]);
  };

  const handlePromptClick = (prompt) => {
    addConversationTurn(prompt.message, prompt.response);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    addConversationTurn(
      trimmed,
      'קיבלתי. כרגע אני בגרסת טעימה, אבל כבר רשמתי לעצמי להחזיר תשובה חכמה יותר בהמשך.',
    );
    setInput('');
  };

  return (
    <main className="app-shell">
      <RecipeNotebookHeader />
      <QuickPromptButtons prompts={quickPrompts} onPromptClick={handlePromptClick} />
      <ChatWindow
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
      <WhatsAppCopyBox shoppingList={recipes.shoppingList} />
    </main>
  );
}
