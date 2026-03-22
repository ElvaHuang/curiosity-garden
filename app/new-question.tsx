import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useGarden } from '../src/contexts/GardenContext';
import { useChat } from '../src/contexts/ChatContext';
import { classifyQuestion } from '../src/services/claude';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../src/constants/theme';

export default function NewQuestionScreen() {
  const [question, setQuestion] = useState('');
  const [isPlanting, setIsPlanting] = useState(false);
  const router = useRouter();
  const { plantSeed } = useGarden();
  const { loadConversation } = useChat();

  async function handlePlant() {
    const trimmed = question.trim();
    if (!trimmed || isPlanting) return;

    setIsPlanting(true);
    try {
      // Classify the question
      const category = await classifyQuestion(trimmed);

      // Plant the seed
      const seed = await plantSeed(trimmed, category, 'text');

      // Load the conversation and navigate to chat
      await loadConversation(seed);
      router.dismiss();
      // Small delay to let modal dismiss, then push chat
      setTimeout(() => {
        router.push(`/ask/${seed.id}`);
      }, 100);
    } catch (error) {
      console.error('Failed to plant seed:', error);
      setIsPlanting(false);
    }
  }

  const suggestions = [
    'Why is the sky blue?',
    'How do birds fly?',
    'Why do we dream?',
    'How do computers think?',
    'Why do leaves change color?',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🌱</Text>
        <Text style={styles.title}>What are you curious about?</Text>
        <Text style={styles.subtitle}>
          Ask any question and watch it grow into a beautiful plant!
        </Text>

        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="Why don't we have eight legs?"
          placeholderTextColor={COLORS.textLight}
          multiline
          maxLength={300}
          autoFocus
          autoCorrect
          spellCheck
        />

        <Pressable
          style={[styles.plantButton, (!question.trim() || isPlanting) && styles.plantButtonDisabled]}
          onPress={handlePlant}
          disabled={!question.trim() || isPlanting}
        >
          {isPlanting ? (
            <ActivityIndicator color={COLORS.textOnPrimary} />
          ) : (
            <Text style={styles.plantButtonText}>Plant My Seed! 🌱</Text>
          )}
        </Pressable>

        <Text style={styles.suggestionsTitle}>Need ideas? Try one of these:</Text>
        <View style={styles.suggestions}>
          {suggestions.map((s) => (
            <Pressable key={s} style={styles.suggestionChip} onPress={() => setQuestion(s)}>
              <Text style={styles.suggestionText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    minHeight: 80,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    fontSize: FONTS.sizes.lg,
    color: COLORS.text,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
  },
  plantButton: {
    width: '100%',
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  plantButtonDisabled: {
    backgroundColor: '#C8E6C9',
  },
  plantButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
  suggestionsTitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  suggestionChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary + '40',
  },
  suggestionText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
  },
});
