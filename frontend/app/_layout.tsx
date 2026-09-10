import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/src/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Prewarm icon assets so Expo Go on Android reliably loads them.
const iconAsset = require('../assets/icon.png');

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prewarm = async () => {
      try {
        await Image.prefetch(Image.resolveAssetSource(iconAsset).uri);
      } catch {}
      setReady(true);
      SplashScreen.hideAsync().catch(() => {});
    };
    prewarm();
  }, []);

  if (!ready) return <View style={styles.splash} />;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.surface },
            }}
          />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  splash: { flex: 1, backgroundColor: colors.brand },
});
