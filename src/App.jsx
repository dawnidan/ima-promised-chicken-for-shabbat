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

const addRecipeTriggers = ['להוסיף מתכון', 'הוסיפי מתכון', 'מתכון חדש'];

function isLikelyUrl(value) {
  return /^https?:\/\//i.test(value);
}

export default function App() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isConversationComplete, setIsConversationComplete] = useState(false);
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingRecipe, setIsAddingRecipe] = useState(false);

  const addConversationTurn = (message, response) => {
    setMessages((current) => [
      ...current,
      { role: 'user', text: message },
      { role: 'assistant', text: response },
    ]);
  };

  const requestAssistant = async (nextMessages, finishConversation = false) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
    const response = await fetch(`${apiBase}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: nextMessages,
        finishConversation,
      }),
    });

    if (!response.ok) {
      throw new Error('Chat request failed');
    }

    return response.json();
  };

  const submitRecipe = async (content) => {
    const apiBase = import.meta.env.VITE_API_BASE_URL ?? '';
    const response = await fetch(`${apiBase}/api/recipe-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: isLikelyUrl(content) ? 'url' : 'message',
        content,
      }),
    });

    if (!response.ok) {
      throw new Error('Recipe submission failed');
    }

    return response.json();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      return;
    }

    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      if (isAddingRecipe) {
        const result = await submitRecipe(trimmed);
        setMessages((current) => [
          ...current,
          { role: 'assistant', text: result.assistantMessage },
        ]);
        setIsAddingRecipe(false);
        return;
      }

      if (addRecipeTriggers.some((trigger) => trimmed.includes(trigger))) {
        setMessages((current) => [
          ...current,
          {
            role: 'assistant',
            text: 'בשמחה. הדביקי כאן קישור למתכון או את ההודעה המלאה, ואני אשמור אותו במאגר.',
          },
        ]);
        setIsAddingRecipe(true);
        return;
      }

      const result = await requestAssistant(nextMessages);
      setMessages((current) => [...current, { role: 'assistant', text: result.assistantMessage }]);
    } catch {
      const assistantTurns = messages.filter((message) => message.role === 'assistant').length;
      const response =
        followUpResponses[assistantTurns - 1] ??
        'נשמע טוב. כשאת מוכנה, לחצי על "סיימתי" ואסדר הכול לתפריט ולרשימת קניות.';
      setMessages((current) => [...current, { role: 'assistant', text: response }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishConversation = async () => {
    if (isConversationComplete) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestAssistant(messages, true);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: result.assistantMessage,
        },
      ]);
      setSummary(result);
      setIsConversationComplete(true);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          text: 'סגרנו שבת. הכנתי לך תפריט, קישורי מתכונים ורשימת קניות מסודרת.',
        },
      ]);
      setSummary({
        menu: recipes.shabbatMenu,
        shoppingList: recipes.shoppingList,
      });
      setIsConversationComplete(true);
    } finally {
      setIsLoading(false);
    }
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
        isLoading={isLoading}
      />
      {isConversationComplete && summary && (
        <WhatsAppCopyBox shoppingList={summary.shoppingList} menu={summary.menu} />
      )}
    </main>
  );
}
