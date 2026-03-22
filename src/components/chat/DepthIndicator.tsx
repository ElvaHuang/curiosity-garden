import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GrowthStage, PlantCategory } from '../../types';
import { PLANTS, GROWTH_THRESHOLDS } from '../../constants/plants';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from '../../constants/theme';

interface DepthIndicatorProps {
  category: PlantCategory;
  growthStage: GrowthStage;
  depth: number;
}

const STAGES: GrowthStage[] = ['seed', 'sprout', 'blossom', 'fruit'];

export function DepthIndicator({ category, growthStage, depth }: DepthIndicatorProps) {
  const plant = PLANTS[category];
  const currentIndex = STAGES.indexOf(growthStage);

  return (
    <View style={styles.container}>
      <View style={styles.stages}>
        {STAGES.map((stage, index) => (
          <View key={stage} style={styles.stageItem}>
            <Text style={[styles.stageEmoji, index <= currentIndex && styles.stageActive]}>
              {plant.stageEmojis[stage]}
            </Text>
            {index < STAGES.length - 1 && (
              <View style={[styles.connector, index < currentIndex && styles.connectorActive]} />
            )}
          </View>
        ))}
      </View>
      <Text style={styles.label}>{plant.name} - {growthStage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  stages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageEmoji: {
    fontSize: 20,
    opacity: 0.3,
  },
  stageActive: {
    opacity: 1,
  },
  connector: {
    width: 30,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  connectorActive: {
    backgroundColor: COLORS.primary,
  },
  label: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    textTransform: 'capitalize',
  },
});
