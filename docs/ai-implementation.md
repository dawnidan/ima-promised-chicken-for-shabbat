# AI Implementation

## Current architecture

- `React + Vite` frontend
- `Express` API under `server/`
- local fallback recipe retrieval from `server/recipes.json`
- optional OpenAI Responses API integration
- optional file search against an OpenAI vector store

## Environment variables

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.1
OPENAI_VECTOR_STORE_ID=
PORT=8787
```

## How retrieval works

When `OPENAI_VECTOR_STORE_ID` is present, the backend gives the model access to a file-search tool connected to your uploaded recipe corpus. The assistant should then ground menus and recipe links in your own documents instead of inventing dishes.

## What still needs to happen

1. Collect the user's real recipe files.
2. Put them in `recipe-corpus/`.
3. Run:

```bash
npm run upload:recipes
```

4. Copy the printed `OPENAI_VECTOR_STORE_ID` into `.env`.
5. Replace placeholder recipe links with real recipe routes or canonical document links.
