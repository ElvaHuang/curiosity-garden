import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { Seed, UserProfile, PlantCategory } from '../types';
import { getAllSeeds, createSeed, updateSeedGrowth } from '../db/seeds';
import { getUser, createUser } from '../db/users';
import { GrowthStage } from '../types';

interface GardenState {
  seeds: Seed[];
  user: UserProfile | null;
  isLoading: boolean;
}

type GardenAction =
  | { type: 'SET_SEEDS'; seeds: Seed[] }
  | { type: 'ADD_SEED'; seed: Seed }
  | { type: 'UPDATE_SEED'; id: string; growthStage: GrowthStage; depth: number }
  | { type: 'SET_USER'; user: UserProfile }
  | { type: 'SET_LOADING'; isLoading: boolean };

function gardenReducer(state: GardenState, action: GardenAction): GardenState {
  switch (action.type) {
    case 'SET_SEEDS':
      return { ...state, seeds: action.seeds, isLoading: false };
    case 'ADD_SEED':
      return { ...state, seeds: [action.seed, ...state.seeds] };
    case 'UPDATE_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s) =>
          s.id === action.id
            ? { ...s, growthStage: action.growthStage, conversationDepth: action.depth, lastInteractedAt: new Date().toISOString() }
            : s
        ),
      };
    case 'SET_USER':
      return { ...state, user: action.user };
    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading };
    default:
      return state;
  }
}

interface GardenContextType extends GardenState {
  plantSeed: (question: string, category: PlantCategory, inputMode?: 'text' | 'voice' | 'photo') => Promise<Seed>;
  updateGrowth: (seedId: string, growthStage: GrowthStage, depth: number) => Promise<void>;
  setupUser: (name: string, avatarId: string) => Promise<void>;
  refreshSeeds: () => Promise<void>;
}

const GardenContext = createContext<GardenContextType | null>(null);

export function GardenProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gardenReducer, {
    seeds: [],
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [seeds, user] = await Promise.all([getAllSeeds(), getUser()]);
      dispatch({ type: 'SET_SEEDS', seeds });
      if (user) dispatch({ type: 'SET_USER', user });
    } catch (error) {
      console.error('Failed to load data:', error);
      dispatch({ type: 'SET_LOADING', isLoading: false });
    }
  }

  const plantSeed = useCallback(async (
    question: string,
    category: PlantCategory,
    inputMode: 'text' | 'voice' | 'photo' = 'text'
  ): Promise<Seed> => {
    const seed = await createSeed(question, category, inputMode, undefined, state.seeds.length);
    dispatch({ type: 'ADD_SEED', seed });
    return seed;
  }, [state.seeds.length]);

  const updateGrowth = useCallback(async (
    seedId: string,
    growthStage: GrowthStage,
    depth: number
  ) => {
    await updateSeedGrowth(seedId, growthStage, depth);
    dispatch({ type: 'UPDATE_SEED', id: seedId, growthStage, depth });
  }, []);

  const setupUser = useCallback(async (name: string, avatarId: string) => {
    const user = await createUser(name, avatarId);
    dispatch({ type: 'SET_USER', user });
  }, []);

  const refreshSeeds = useCallback(async () => {
    const seeds = await getAllSeeds();
    dispatch({ type: 'SET_SEEDS', seeds });
  }, []);

  return (
    <GardenContext.Provider value={{ ...state, plantSeed, updateGrowth, setupUser, refreshSeeds }}>
      {children}
    </GardenContext.Provider>
  );
}

export function useGarden() {
  const context = useContext(GardenContext);
  if (!context) throw new Error('useGarden must be used within GardenProvider');
  return context;
}
