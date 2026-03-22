import { v4 as uuid } from 'uuid';
import { getDatabase } from './database';
import { Seed, PlantCategory } from '../types';
import { assignGardenPosition } from '../utils/gardenLayout';

export async function createSeed(
  question: string,
  category: PlantCategory,
  inputMode: 'text' | 'voice' | 'photo' = 'text',
  photoUri?: string,
  existingSeedCount: number = 0
): Promise<Seed> {
  const db = await getDatabase();
  const id = uuid();
  const now = new Date().toISOString();
  const position = assignGardenPosition(existingSeedCount);

  const seed: Seed = {
    id,
    question,
    inputMode,
    photoUri,
    category,
    growthStage: 'seed',
    conversationDepth: 0,
    gardenPosition: position,
    createdAt: now,
    lastInteractedAt: now,
  };

  await db.runAsync(
    `INSERT INTO seeds (id, question, input_mode, photo_uri, category, growth_stage, conversation_depth, garden_x, garden_y, created_at, last_interacted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, question, inputMode, photoUri ?? null, category, 'seed', 0, position.x, position.y, now, now
  );

  return seed;
}

export async function getAllSeeds(): Promise<Seed[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>('SELECT * FROM seeds ORDER BY created_at DESC');
  return rows.map(rowToSeed);
}

export async function getSeed(id: string): Promise<Seed | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>('SELECT * FROM seeds WHERE id = ?', id);
  return row ? rowToSeed(row) : null;
}

export async function updateSeedGrowth(
  id: string,
  growthStage: string,
  conversationDepth: number
): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    'UPDATE seeds SET growth_stage = ?, conversation_depth = ?, last_interacted_at = ? WHERE id = ?',
    growthStage, conversationDepth, now, id
  );
}

function rowToSeed(row: any): Seed {
  return {
    id: row.id,
    question: row.question,
    inputMode: row.input_mode,
    photoUri: row.photo_uri ?? undefined,
    category: row.category as PlantCategory,
    growthStage: row.growth_stage as any,
    conversationDepth: row.conversation_depth,
    gardenPosition: { x: row.garden_x, y: row.garden_y },
    createdAt: row.created_at,
    lastInteractedAt: row.last_interacted_at,
  };
}
