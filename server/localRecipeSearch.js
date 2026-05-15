import recipes from './recipes.json' with { type: 'json' };

export function searchLocalRecipes(messages) {
  const joined = messages.map((message) => message.text).join(' ');
  const preferred = recipes.recipes.filter((recipe) =>
    recipe.keywords.some((keyword) => joined.includes(keyword)),
  );

  return preferred.length ? preferred : recipes.recipes.slice(0, 3);
}

export function buildLocalSummary(messages, finishConversation) {
  if (!finishConversation) {
    const assistantTurns = messages.filter((message) => message.role === 'assistant').length;
    const nextQuestions = [
      'לכמה סועדים מתכננים את ארוחת השבת?',
      'יש העדפות, רגישויות או מנות שחייבות להיות על השולחן?',
      'יש לך חשק לארוחה יותר קלאסית, קלילה או מושקעת?',
      'מעולה. אפשר להוסיף עוד פרט אחד, או לסיים ולקבל תפריט מסודר.',
    ];

    return {
      assistantMessage: nextQuestions[Math.min(assistantTurns, nextQuestions.length - 1)],
      menu: [],
      shoppingList: [],
    };
  }

  const menu = searchLocalRecipes(messages);

  return {
    assistantMessage: 'סגרנו שבת. הכנתי לך תפריט, קישורי מתכונים ורשימת קניות מסודרת.',
    menu,
    shoppingList: recipes.shoppingList,
  };
}
