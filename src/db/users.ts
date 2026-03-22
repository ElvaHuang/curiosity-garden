import { v4 as uuid } from 'uuid';
import { getDatabase } from './database';
import { UserProfile } from '../types';

export async function createUser(name: string, avatarId: string): Promise<UserProfile> {
  const db = await getDatabase();
  const id = uuid();
  const createdAt = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO users (id, name, avatar_id, created_at) VALUES (?, ?, ?, ?)',
    id, name, avatarId, createdAt
  );

  return { id, name, avatarId, createdAt };
}

export async function getUser(): Promise<UserProfile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<any>('SELECT * FROM users LIMIT 1');
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    createdAt: row.created_at,
  };
}
