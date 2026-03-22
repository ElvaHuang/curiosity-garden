export type PlantCategory =
  | 'nature'
  | 'numbers'
  | 'stories'
  | 'how-things-work'
  | 'people'
  | 'wonder';

export type GrowthStage = 'seed' | 'sprout' | 'blossom' | 'fruit';

export interface Seed {
  id: string;
  question: string;
  inputMode: 'text' | 'voice' | 'photo';
  photoUri?: string;
  category: PlantCategory;
  growthStage: GrowthStage;
  conversationDepth: number;
  gardenPosition: { x: number; y: number };
  createdAt: string;
  lastInteractedAt: string;
}

export interface ConversationMessage {
  id: string;
  seedId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  createdAt: string;
}
