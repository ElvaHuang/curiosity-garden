import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGarden } from '../../src/contexts/GardenContext';
import { useChat } from '../../src/contexts/ChatContext';
import { PLANTS } from '../../src/constants/plants';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../src/constants/theme';
import { Seed, PlantCategory } from '../../src/types';

export default function ExploreScreen() {
  const { seeds } = useGarden();
  const { loadConversation } = useChat();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<PlantCategory | null>(null);

  const filteredSeeds = useMemo(() => {
    let result = seeds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.question.toLowerCase().includes(q));
    }
    if (filterCategory) {
      result = result.filter((s) => s.category === filterCategory);
    }
    return result;
  }, [seeds, search, filterCategory]);

  const categories = Object.values(PLANTS);

  async function handleSeedPress(seed: Seed) {
    await loadConversation(seed);
    router.push(`/ask/${seed.id}`);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Search your questions..."
        placeholderTextColor={COLORS.textLight}
      />

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.category}
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
        contentContainerStyle={styles.categoryContent}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.categoryChip,
              filterCategory === item.category && { backgroundColor: item.color },
            ]}
            onPress={() =>
              setFilterCategory(filterCategory === item.category ? null : item.category)
            }
          >
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                filterCategory === item.category && { color: '#FFF' },
              ]}
            >
              {item.description}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        data={filteredSeeds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {seeds.length === 0 ? 'No questions yet! Go plant some seeds.' : 'No matches found.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const plant = PLANTS[item.category];
          return (
            <Pressable style={styles.seedItem} onPress={() => handleSeedPress(item)}>
              <Text style={styles.seedEmoji}>{plant.stageEmojis[item.growthStage]}</Text>
              <View style={styles.seedInfo}>
                <Text style={styles.seedQuestion}>{item.question}</Text>
                <Text style={styles.seedMeta}>
                  {plant.description} · {item.growthStage} · {item.conversationDepth} exchanges
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchInput: {
    margin: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  categoryList: {
    maxHeight: 44,
    marginBottom: SPACING.sm,
  },
  categoryContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  seedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  seedEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  seedInfo: {
    flex: 1,
  },
  seedQuestion: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  seedMeta: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textLight,
  },
  empty: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textLight,
  },
});
