import { PlantCategory, GrowthStage } from '../types';

export interface PlantInfo {
  category: PlantCategory;
  name: string;
  color: string;
  emoji: string;
  stageEmojis: Record<GrowthStage, string>;
  description: string;
}

export const PLANTS: Record<PlantCategory, PlantInfo> = {
  nature: {
    category: 'nature',
    name: 'Sunflower',
    color: '#66BB6A',
    emoji: '🌻',
    stageEmojis: { seed: '🫘', sprout: '🌱', blossom: '🌼', fruit: '🌻' },
    description: 'Science & Nature',
  },
  numbers: {
    category: 'numbers',
    name: 'Crystal Cactus',
    color: '#42A5F5',
    emoji: '🌵',
    stageEmojis: { seed: '🫘', sprout: '🌱', blossom: '💎', fruit: '🌵' },
    description: 'Math & Numbers',
  },
  stories: {
    category: 'stories',
    name: 'Story Tree',
    color: '#AB47BC',
    emoji: '🌳',
    stageEmojis: { seed: '🫘', sprout: '🌱', blossom: '🌸', fruit: '🌳' },
    description: 'History & Stories',
  },
  'how-things-work': {
    category: 'how-things-work',
    name: 'Gear Vine',
    color: '#FF7043',
    emoji: '🌿',
    stageEmojis: { seed: '🫘', sprout: '🌱', blossom: '⚙️', fruit: '🌿' },
    description: 'How Things Work',
  },
  people: {
    category: 'people',
    name: 'Berry Bush',
    color: '#EC407A',
    emoji: '🫐',
    stageEmojis: { seed: '🫘', sprout: '🌱', blossom: '🌺', fruit: '🫐' },
    description: 'People & Culture',
  },
  wonder: {
    category: 'wonder',
    name: 'Wonder Mushroom',
    color: '#FFD54F',
    emoji: '🍄',
    stageEmojis: { seed: '🫘', sprout: '🌱', blossom: '✨', fruit: '🍄' },
    description: 'Wonder & Philosophy',
  },
};

export const GROWTH_THRESHOLDS: Record<GrowthStage, number> = {
  seed: 0,
  sprout: 2,
  blossom: 5,
  fruit: 9,
};
