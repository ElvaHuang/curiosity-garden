import { GrowthStage, ConversationMessage } from '../types';
import { GROWTH_THRESHOLDS } from '../constants/plants';

const LOW_EFFORT_PATTERNS = [
  /^i don'?t know\.?$/i,
  /^idk\.?$/i,
  /^no\.?$/i,
  /^yes\.?$/i,
  /^maybe\.?$/i,
  /^ok\.?$/i,
  /^sure\.?$/i,
  /^hm+\.?$/i,
];

function isLowEffortResponse(content: string): boolean {
  const trimmed = content.trim();
  return LOW_EFFORT_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function calculateDepth(messages: ConversationMessage[]): number {
  return messages.filter(
    (m) =>
      m.role === 'user' &&
      m.content.trim().split(/\s+/).length > 3 &&
      !isLowEffortResponse(m.content)
  ).length;
}

export function getGrowthStage(depth: number): GrowthStage {
  if (depth >= GROWTH_THRESHOLDS.fruit) return 'fruit';
  if (depth >= GROWTH_THRESHOLDS.blossom) return 'blossom';
  if (depth >= GROWTH_THRESHOLDS.sprout) return 'sprout';
  return 'seed';
}
