import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import OpenAI from 'openai';
import recipes from './recipes.json' with { type: 'json' };
import { buildLocalSummary, searchLocalRecipes } from './localRecipeSearch.js';

const app = express();
const port = Number(process.env.PORT || 8787);
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    aiEnabled: Boolean(openai),
    retrievalEnabled: Boolean(process.env.OPENAI_VECTOR_STORE_ID),
  });
});

app.get('/api/recipes', (_request, response) => {
  response.json({ recipes });
});

app.post('/api/chat', async (request, response) => {
  const { messages = [], finishConversation = false } = request.body ?? {};

  if (!openai) {
    return response.json(buildLocalSummary(messages, finishConversation));
  }

  try {
    const result = await openai.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.1',
      input: [
        {
          role: 'system',
          content:
            'את עוזרת ביתית לתכנון ארוחות שבת. עני בעברית חמה וקצרה. השתמשי רק במתכונים שנשלפו מהמאגר כאשר את מציעה תפריט או קישורים למתכונים. אם חסר מידע, שאלי שאלה אחת בכל פעם.',
        },
        ...messages.map((message) => ({
          role: message.role,
          content: message.text,
        })),
        {
          role: 'user',
          content: finishConversation
            ? 'סיימתי. החזירי JSON בלבד עם השדות assistantMessage, menu, shoppingList.'
            : 'המשיכי את השיחה בשאלה הבאה הקצרה ביותר שצריך לשאול.',
        },
      ],
      ...(process.env.OPENAI_VECTOR_STORE_ID
        ? {
            tools: [
              {
                type: 'file_search',
                vector_store_ids: [process.env.OPENAI_VECTOR_STORE_ID],
              },
            ],
          }
        : {}),
    });

    const text = result.output_text;

    if (!finishConversation) {
      return response.json({
        assistantMessage: text,
        menu: [],
        shoppingList: [],
      });
    }

    try {
      return response.json(JSON.parse(text));
    } catch {
      return response.json({
        assistantMessage: text,
        menu: searchLocalRecipes(messages),
        shoppingList: recipes.shoppingList,
      });
    }
  } catch (error) {
    response.status(500).json({
      error: 'AI_REQUEST_FAILED',
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Recipe assistant API listening on http://localhost:${port}`);
});
