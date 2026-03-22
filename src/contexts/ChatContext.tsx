import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConversationMessage, Seed } from '../types';
import { addMessage, getMessages } from '../db/messages';
import { calculateDepth, getGrowthStage } from '../utils/growthStages';
import { sendSocraticMessage } from '../services/claude';
import { fetchWikipediaContext } from '../services/wikipedia';
import { useGarden } from './GardenContext';

interface ChatContextType {
  messages: ConversationMessage[];
  isLoading: boolean;
  currentSeed: Seed | null;
  loadConversation: (seed: Seed) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSeed, setCurrentSeed] = useState<Seed | null>(null);
  const [wikipediaContext, setWikipediaContext] = useState<string | null>(null);
  const { updateGrowth } = useGarden();

  const loadConversation = useCallback(async (seed: Seed) => {
    setCurrentSeed(seed);
    const msgs = await getMessages(seed.id);
    setMessages(msgs);

    // Fetch Wikipedia context if this is a new or early conversation
    if (msgs.length <= 2) {
      const context = await fetchWikipediaContext(seed.question);
      setWikipediaContext(context);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentSeed || isLoading) return;

    setIsLoading(true);
    try {
      // Save user message
      const userMsg = await addMessage(currentSeed.id, 'user', content);
      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);

      // Get AI response
      const aiResponse = await sendSocraticMessage(updatedMessages, wikipediaContext);

      // Save assistant message
      const assistantMsg = await addMessage(currentSeed.id, 'assistant', aiResponse);
      const allMessages = [...updatedMessages, assistantMsg];
      setMessages(allMessages);

      // Update growth
      const depth = calculateDepth(allMessages);
      const stage = getGrowthStage(depth);
      if (stage !== currentSeed.growthStage || depth !== currentSeed.conversationDepth) {
        await updateGrowth(currentSeed.id, stage, depth);
        setCurrentSeed((prev) => prev ? { ...prev, growthStage: stage, conversationDepth: depth } : null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message so user knows something went wrong
      const errorMsg = await addMessage(
        currentSeed.id,
        'assistant',
        "Oops! I got a little confused there. Can you try saying that again? 🌿"
      );
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSeed, messages, isLoading, wikipediaContext, updateGrowth]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setCurrentSeed(null);
    setWikipediaContext(null);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, currentSeed, loadConversation, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
