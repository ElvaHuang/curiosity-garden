import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Seed } from '../../types';
import { PlantSprite } from './PlantSprite';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface GardenViewProps {
  seeds: Seed[];
  onPlantPress: (seed: Seed) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const COLUMNS = 3;

export function GardenView({ seeds, onPlantPress }: GardenViewProps) {
  if (seeds.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🌍</Text>
        <Text style={styles.emptyTitle}>Your garden is waiting!</Text>
        <Text style={styles.emptyText}>
          Ask a question to plant your first seed. What are you curious about?
        </Text>
      </View>
    );
  }

  // Arrange seeds into rows
  const rows: Seed[][] = [];
  for (let i = 0; i < seeds.length; i += COLUMNS) {
    rows.push(seeds.slice(i, i + COLUMNS));
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((seed) => (
            <PlantSprite key={seed.id} seed={seed} onPress={onPlantPress} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SPACING.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});
