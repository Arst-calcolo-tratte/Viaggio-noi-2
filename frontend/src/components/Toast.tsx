import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { colors, spacing } from '../theme';

export type ToastHandle = { show: (msg: string) => void };

export const Toast = forwardRef<ToastHandle, {}>(function Toast(_p, ref) {
  const [msg, setMsg] = useState('');
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useImperativeHandle(ref, () => ({
    show: (m: string) => {
      setMsg(m);
      opacity.value = withTiming(1, { duration: 180 });
      translateY.value = withTiming(0, { duration: 220 });
      setTimeout(() => {
        opacity.value = withTiming(0, { duration: 220 }, () => {
          runOnJS(setMsg)('');
        });
        translateY.value = withTiming(20, { duration: 220 });
      }, 1600);
    },
  }));

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!msg) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.toast, animStyle]}>
        <Text style={styles.txt}>{msg}</Text>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 0, right: 0, bottom: 130, alignItems: 'center', zIndex: 100 },
  toast: {
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: '#0d2237',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  txt: { color: colors.onBrandPrimary, fontSize: 13, fontWeight: '600' },
});
