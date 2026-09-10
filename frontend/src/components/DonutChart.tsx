import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { colors, spacing } from '../theme';

type Slice = { key: string; value: number; color: string; emoji: string; label: string };

type Props = { slices: Slice[]; total: number; currency: string; formatMoney: (n: number) => string };

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOut: number, rIn: number, start: number, end: number) {
  const large = end - start > 180 ? 1 : 0;
  const p1 = polar(cx, cy, rOut, start);
  const p2 = polar(cx, cy, rOut, end);
  const p3 = polar(cx, cy, rIn, end);
  const p4 = polar(cx, cy, rIn, start);
  return [
    'M', p1.x, p1.y,
    'A', rOut, rOut, 0, large, 1, p2.x, p2.y,
    'L', p3.x, p3.y,
    'A', rIn, rIn, 0, large, 0, p4.x, p4.y,
    'Z',
  ].join(' ');
}

export function DonutChart({ slices, total, currency, formatMoney }: Props) {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const rOut = 88;
  const rIn = 58;

  const sorted = slices.filter((s) => s.value > 0).sort((a, b) => b.value - a.value);
  const sum = sorted.reduce((a, b) => a + b.value, 0);

  if (!sorted.length || sum <= 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>📊</Text>
        <Text style={styles.emptyText}>Aggiungi la prima spesa per vedere il grafico</Text>
      </View>
    );
  }

  let acc = 0;
  const arcs = sorted.map((s) => {
    const start = (acc / sum) * 360;
    acc += s.value;
    const end = (acc / sum) * 360;
    const gap = 1.2;
    return { d: arcPath(cx, cy, rOut, rIn, start + gap, end - gap), color: s.color, key: s.key };
  });

  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5);
  const restSum = rest.reduce((a, b) => a + b.value, 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.chartWrap}>
        <Svg width={size} height={size}>
          <G>
            {arcs.map((a) => (
              <Path key={a.key} d={a.d} fill={a.color} />
            ))}
            <Circle cx={cx} cy={cy} r={rIn - 1} fill={colors.surfaceSecondary} />
          </G>
        </Svg>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.centerAmount} numberOfLines={1}>
            {currency} {formatMoney(total)}
          </Text>
          <Text style={styles.centerLabel}>speso</Text>
        </View>
      </View>
      <View style={styles.legend}>
        {top.map((s) => (
          <View style={styles.legendRow} key={s.key} testID={`legend-${s.key}`}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <Text style={styles.legendEmoji}>{s.emoji}</Text>
            <Text style={styles.legendLabel} numberOfLines={1}>{s.label}</Text>
            <Text style={styles.legendValue}>
              {currency} {formatMoney(s.value)}
            </Text>
          </View>
        ))}
        {rest.length > 0 && (
          <View style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: '#93a7b8' }]} />
            <Text style={styles.legendEmoji}>✨</Text>
            <Text style={styles.legendLabel}>Altre {rest.length}</Text>
            <Text style={styles.legendValue}>
              {currency} {formatMoney(restSum)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginTop: spacing.md,
    shadowColor: '#0d2237',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  chartWrap: { alignSelf: 'center', width: 200, height: 200, marginBottom: spacing.md },
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerAmount: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  centerLabel: { fontSize: 12, color: colors.muted, marginTop: 2 },
  legend: { gap: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  legendEmoji: { fontSize: 16 },
  legendLabel: { flex: 1, fontSize: 14, color: colors.onSurface },
  legendValue: { fontSize: 14, fontWeight: '600', color: colors.onSurface },
  empty: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    padding: spacing.xl,
    marginTop: spacing.md,
    alignItems: 'center',
    gap: 8,
  },
  emptyEmoji: { fontSize: 32 },
  emptyText: { color: colors.muted, textAlign: 'center' },
});
