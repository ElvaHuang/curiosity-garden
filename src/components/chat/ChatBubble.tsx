import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConversationMessage } from '../../types';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface ChatBubbleProps {
  message: ConversationMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      {!isUser && <Text style={styles.avatar}>🌱</Text>}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
      </View>
      {isUser && <Text style={styles.avatar}>👤</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  assistantContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    fontSize: 24,
    marginHorizontal: SPACING.xs,
  },
  bubble: {
    maxWidth: '75%',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: SPACING.xs,
  },
  assistantBubble: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: SPACING.xs,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  text: {
    fontSize: FONTS.sizes.md,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.textOnPrimary,
  },
  assistantText: {
    color: COLORS.text,
  },
});
