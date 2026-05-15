import { createReadStream, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config';
import OpenAI from 'openai';

const corpusDir = join(process.cwd(), 'recipe-corpus');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supportedExtensions = new Set(['.md', '.txt', '.pdf', '.docx']);

function collectFiles(directory) {
  return readdirSync(directory)
    .map((entry) => join(directory, entry))
    .filter((path) => statSync(path).isFile())
    .filter((path) => supportedExtensions.has(path.slice(path.lastIndexOf('.')).toLowerCase()));
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }

  const files = collectFiles(corpusDir);

  if (!files.length) {
    throw new Error('No recipe files found in recipe-corpus/');
  }

  const vectorStore = await openai.vectorStores.create({
    name: 'shabbat-recipe-corpus',
  });

  for (const path of files) {
    const uploadedFile = await openai.files.create({
      file: createReadStream(path),
      purpose: 'assistants',
    });

    await openai.vectorStores.files.create(vectorStore.id, {
      file_id: uploadedFile.id,
    });
  }

  console.log(`OPENAI_VECTOR_STORE_ID=${vectorStore.id}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
