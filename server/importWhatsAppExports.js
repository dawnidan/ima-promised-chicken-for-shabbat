import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const exportFiles = process.argv.slice(2);
const outputPath = new URL('./whatsappImportedCandidates.json', import.meta.url);
const messagePattern =
  /^(\d{1,2}\.\d{1,2}\.\d{4}), (\d{1,2}:\d{2}) - ([^:]+): (.*)$/;
const recipeSignals = [
  'כוס',
  'כף',
  'כפית',
  'גרם',
  'ג׳',
  'בצל',
  'ביצים',
  'לערבב',
  'לאפות',
  'להוסיף',
  'תנור',
  'קמח',
  'סוכר',
  'מלח',
];

function parseExport(filePath) {
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  const messages = [];
  let current = null;

  for (const line of lines) {
    const match = line.match(messagePattern);

    if (match) {
      if (current) {
        messages.push(current);
      }

      current = {
        date: match[1],
        time: match[2],
        sender: match[3].trim(),
        text: match[4].trim(),
        source: basename(filePath),
      };
      continue;
    }

    if (current && line.trim()) {
      current.text += `\n${line.trim()}`;
    }
  }

  if (current) {
    messages.push(current);
  }

  return messages;
}

function classifyMessage(message) {
  const text = message.text;
  const isUrl = /^https?:\/\//i.test(text);
  const score = recipeSignals.filter((signal) => text.includes(signal)).length;
  const hasAttachment = text.includes('(קובץ מצורף)') || text.includes('<המדיה לא נכללה>');

  if (isUrl) {
    return 'url';
  }

  if (score >= 2 && text.length >= 40) {
    return 'recipe_text';
  }

  if (hasAttachment) {
    return 'attachment';
  }

  return 'other';
}

function main() {
  if (!exportFiles.length) {
    throw new Error('Provide one or more WhatsApp export text files');
  }

  const candidates = exportFiles
    .flatMap(parseExport)
    .map((message) => ({
      ...message,
      classification: classifyMessage(message),
    }))
    .filter((message) => message.classification !== 'other');

  writeFileSync(outputPath, JSON.stringify(candidates, null, 2));
  console.log(`Imported ${candidates.length} candidate messages`);
  console.log(`Saved to ${outputPath.pathname}`);
}

main();
