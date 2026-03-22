import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GardenProvider } from '../src/contexts/GardenContext';
import { ChatProvider } from '../src/contexts/ChatContext';
import { COLORS } from '../src/constants/theme';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GardenProvider>
      <ChatProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.text,
            contentStyle: { backgroundColor: COLORS.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="ask/[seedId]"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="new-question"
            options={{
              presentation: 'modal',
              title: 'Plant a Seed',
              headerStyle: { backgroundColor: COLORS.surface },
            }}
          />
        </Stack>
      </ChatProvider>
    </GardenProvider>
  );
}
