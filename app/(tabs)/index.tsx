import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GardenView } from '../../src/components/garden/GardenView';
import { FAB } from '../../src/components/common/FAB';
import { useGarden } from '../../src/contexts/GardenContext';
import { useChat } from '../../src/contexts/ChatContext';
import { Seed } from '../../src/types';
import { COLORS } from '../../src/constants/theme';

export default function GardenScreen() {
  const router = useRouter();
  const { seeds } = useGarden();
  const { loadConversation } = useChat();

  async function handlePlantPress(seed: Seed) {
    await loadConversation(seed);
    router.push(`/ask/${seed.id}`);
  }

  function handleAskPress() {
    router.push('/new-question');
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.skyLight, COLORS.skyBlue, '#C8E6C9', COLORS.grassLight]}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      >
        <GardenView seeds={seeds} onPlantPress={handlePlantPress} />
        <FAB onPress={handleAskPress} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
