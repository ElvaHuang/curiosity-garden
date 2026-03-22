import Anthropic from '@anthropic-ai/sdk';
import { CONFIG } from '../constants/config';
import { ConversationMessage } from '../types';
import { getSocraticTutorPrompt } from '../prompts/socratic-tutor';
import { CLASSIFIER_PROMPT } from '../prompts/classifier';
import { PlantCategory } from '../types';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: CONFIG.claude.apiKey,
      baseURL: CONFIG.claude.baseURL,
      dangerouslyAllowBrowser: true,
    });
  }
  return client;
}

export async function sendSocraticMessage(
  conversationHistory: ConversationMessage[],
  wikipediaContext: string | null
): Promise<string> {
  const anthropic = getClient();

  const messages = conversationHistory.map((msg) => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  const response = await anthropic.messages.create({
    model: CONFIG.claude.model,
    max_tokens: 300,
    system: getSocraticTutorPrompt(wikipediaContext ?? undefined),
    messages,
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock?.text ?? "Hmm, I'm thinking about that! What do you think? 🤔";
}

const VALID_CATEGORIES: PlantCategory[] = [
  'nature', 'numbers', 'stories', 'how-things-work', 'people', 'wonder',
];

export async function classifyQuestion(question: string): Promise<PlantCategory> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: CONFIG.claude.model,
    max_tokens: 20,
    system: CLASSIFIER_PROMPT,
    messages: [{ role: 'user', content: question }],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  const category = textBlock?.text?.trim().toLowerCase() as PlantCategory;

  if (VALID_CATEGORIES.includes(category)) {
    return category;
  }
  return 'wonder'; // default fallback
}
