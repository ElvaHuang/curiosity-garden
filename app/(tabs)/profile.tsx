import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGarden } from '../../src/contexts/GardenContext';
import { PLANTS } from '../../src/constants/plants';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { PlantCategory, GrowthStage } from '../../src/types';

export default function ProfileScreen() {
  const { seeds, user } = useGarden();

  const totalSeeds = seeds.length;
  const blooming = seeds.filter((s) => s.growthStage === 'blossom' || s.growthStage === 'fruit').length;
  const fruiting = seeds.filter((s) => s.growthStage === 'fruit').length;

  // Category breakdown
  const categoryCount = seeds.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.avatar}>🧒</Text>
        <Text style={styles.name}>{user?.name || 'Young Explorer'}</Text>
        <Text style={styles.subtitle}>Curiosity Gardener</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{totalSeeds}</Text>
          <Text style={styles.statLabel}>Seeds</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{blooming}</Text>
          <Text style={styles.statLabel}>Blooming</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{fruiting}</Text>
          <Text style={styles.statLabel}>Fruited</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Your Curiosity Map</Text>
      <View style={styles.categoriesContainer}>
        {Object.values(PLANTS).map((plant) => {
          const count = categoryCount[plant.category] || 0;
          return (
            <View key={plant.category} style={styles.categoryRow}>
              <Text style={styles.categoryEmoji}>{plant.emoji}</Text>
              <Text style={styles.categoryName}>{plant.description}</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${totalSeeds > 0 ? (count / totalSeeds) * 100 : 0}%`,
                      backgroundColor: plant.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.categoryCount}>{count}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  avatar: {
    fontSize: 64,
    marginBottom: SPACING.sm,
  },
  name: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  categoriesContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  categoryEmoji: {
    fontSize: 20,
    width: 30,
  },
  categoryName: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    width: 100,
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E8E8E8',
    borderRadius: 4,
    marginHorizontal: SPACING.sm,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    minWidth: 0,
  },
  categoryCount: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textLight,
    width: 24,
    textAlign: 'right',
  },
});
