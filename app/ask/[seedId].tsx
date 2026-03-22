import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useChat } from '../../src/contexts/ChatContext';
import { useGarden } from '../../src/contexts/GardenContext';
import { ChatBubble } from '../../src/components/chat/ChatBubble';
import { ChatInput } from '../../src/components/chat/ChatInput';
import { DepthIndicator } from '../../src/components/chat/DepthIndicator';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { PLANTS } from '../../src/constants/plants';

export default function ChatScreen() {
  const { seedId } = useLocalSearchParams<{ seedId: string }>();
  const { messages, isLoading, currentSeed, loadConversation, sendMessage } = useChat();
  const { seeds } = useGarden();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (seedId && !currentSeed) {
      // Load seed if navigated directly
      const seed = seeds.find((s) => s.id === seedId);
      if (seed) {
        loadConversation(seed);
      }
    }
  }, [seedId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Find the up-to-date seed (with latest growth stage)
  const seed = seeds.find((s) => s.id === seedId) || currentSeed;

  if (!seed) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const plant = PLANTS[seed.category];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{plant.stageEmojis[seed.growthStage]}</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {seed.question}
          </Text>
        </View>
      </View>

      {/* Depth Indicator */}
      <DepthIndicator
        category={seed.category}
        growthStage={seed.growthStage}
        depth={seed.conversationDepth}
      />

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        ListHeaderComponent={
          messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeEmoji}>🌱</Text>
              <Text style={styles.welcomeText}>
                You planted: "{seed.question}"
              </Text>
              <Text style={styles.welcomeHint}>
                Type your first thought to start growing this seed!
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => <ChatBubble message={item} />}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.thinkingContainer}>
              <Text style={styles.thinkingText}>🌱 Sprout is thinking...</Text>
            </View>
          ) : null
        }
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        placeholder={messages.length === 0 ? "What do you already think about this?" : "Tell me more..."}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? 56 : SPACING.md,
    paddingBottom: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    paddingRight: SPACING.sm,
  },
  backText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: SPACING.md,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  welcomeText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  welcomeHint: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  thinkingContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  thinkingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
});
