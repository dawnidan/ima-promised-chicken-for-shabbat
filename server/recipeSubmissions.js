import { readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const submissionsPath = new URL('./recipeSubmissions.json', import.meta.url);

export function listRecipeSubmissions() {
  return JSON.parse(readFileSync(submissionsPath, 'utf8'));
}

export function createRecipeSubmission({ type, content }) {
  const submissions = listRecipeSubmissions();
  const submission = {
    id: randomUUID(),
    type,
    content,
    status: 'pending_review',
    createdAt: new Date().toISOString(),
  };

  submissions.unshift(submission);
  writeFileSync(submissionsPath, JSON.stringify(submissions, null, 2));
  return submission;
}
