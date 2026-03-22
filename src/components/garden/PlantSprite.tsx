import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Seed } from '../../types';
import { PLANTS } from '../../constants/plants';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

interface PlantSpriteProps {
  seed: Seed;
  onPress: (seed: Seed) => void;
}

const STAGE_SIZES = {
  seed: 36,
  sprout: 44,
  blossom: 52,
  fruit: 60,
};

export function PlantSprite({ seed, onPress }: PlantSpriteProps) {
  const plant = PLANTS[seed.category];
  const size = STAGE_SIZES[seed.growthStage];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1, { damping: 10, stiffness: 100 }) }],
  }));

  return (
    <Pressable onPress={() => onPress(seed)} style={styles.container}>
      <Animated.View style={[styles.spriteContainer, animatedStyle]}>
        <Text style={[styles.emoji, { fontSize: size }]}>
          {plant.stageEmojis[seed.growthStage]}
        </Text>
      </Animated.View>
      <View style={[styles.label, { backgroundColor: plant.color + '30' }]}>
        <Text style={styles.labelText} numberOfLines={1}>
          {seed.question.length > 15 ? seed.question.slice(0, 15) + '...' : seed.question}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 110,
    paddingVertical: SPACING.sm,
  },
  spriteContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
  },
  emoji: {
    textAlign: 'center',
  },
  label: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.xs,
    maxWidth: 100,
  },
  labelText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.text,
    textAlign: 'center',
  },
});
