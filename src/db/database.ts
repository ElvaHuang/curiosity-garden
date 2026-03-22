import AsyncStorage from '@react-native-async-storage/async-storage';
import { Seed, ConversationMessage, UserProfile } from '../types';

const KEYS = {
  user: 'cg_user',
  seeds: 'cg_seeds',
  messages: 'cg_messages',
};

// ---- User ----

export async function getUser(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export async function saveUser(user: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.user, JSON.stringify(user));
}

// ---- Seeds ----

export async function getAllSeeds(): Promise<Seed[]> {
  const raw = await AsyncStorage.getItem(KEYS.seeds);
  return raw ? JSON.parse(raw) : [];
}

export async function saveSeed(seed: Seed): Promise<void> {
  const seeds = await getAllSeeds();
  seeds.unshift(seed);
  await AsyncStorage.setItem(KEYS.seeds, JSON.stringify(seeds));
}

export async function updateSeedInStore(id: string, updates: Partial<Seed>): Promise<void> {
  const seeds = await getAllSeeds();
  const index = seeds.findIndex((s) => s.id === id);
  if (index !== -1) {
    seeds[index] = { ...seeds[index], ...updates };
    await AsyncStorage.setItem(KEYS.seeds, JSON.stringify(seeds));
  }
}

export async function getSeed(id: string): Promise<Seed | null> {
  const seeds = await getAllSeeds();
  return seeds.find((s) => s.id === id) ?? null;
}

// ---- Messages ----

export async function getMessages(seedId: string): Promise<ConversationMessage[]> {
  const raw = await AsyncStorage.getItem(`${KEYS.messages}_${seedId}`);
  return raw ? JSON.parse(raw) : [];
}

export async function addMessage(
  seedId: string,
  message: ConversationMessage
): Promise<void> {
  const messages = await getMessages(seedId);
  messages.push(message);
  await AsyncStorage.setItem(`${KEYS.messages}_${seedId}`, JSON.stringify(messages));
}
