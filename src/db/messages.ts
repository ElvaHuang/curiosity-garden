import { v4 as uuid } from 'uuid';
import { getDatabase } from './database';
import { ConversationMessage } from '../types';

export async function addMessage(
  seedId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<ConversationMessage> {
  const db = await getDatabase();
  const id = uuid();
  const timestamp = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO messages (id, seed_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)',
    id, seedId, role, content, timestamp
  );

  return { id, seedId, role, content, timestamp };
}

export async function getMessages(seedId: string): Promise<ConversationMessage[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<any>(
    'SELECT * FROM messages WHERE seed_id = ? ORDER BY timestamp ASC',
    seedId
  );
  return rows.map((row) => ({
    id: row.id,
    seedId: row.seed_id,
    role: row.role as 'user' | 'assistant',
    content: row.content,
    timestamp: row.timestamp,
  }));
}
