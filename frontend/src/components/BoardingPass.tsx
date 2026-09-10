import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors, spacing } from '../theme';
import { Trip } from '../data/types';
import { dateLabel, daysBetween, money, num } from '../utils/format';

type Props = {
  trip: Trip;
  totals: { out: number; inc: number; net: number };
  entriesCount: number;
};

export function BoardingPass({ trip, totals, entriesCount }: Props) {
  const days = daysBetween(trip.from, trip.to);
  const cur = trip.cur || '€';
  const people = Math.max(1, trip.people || 1);
  const perHead = totals.net / people;

  const budgetAmt = num(trip.budget);
  const budgetLeft = budgetAmt ? budgetAmt - totals.net : 0;
  const budgetPerc = budgetAmt ? Math.max(0, Math.min(100, (totals.net / budgetAmt) * 100)) : 0;
  const overBudget = budgetAmt && budgetLeft < 0;

  return (
    <View style={styles.card} testID="boarding-pass">
      {/* Route */}
      <View style={styles.route}>
        <View style={styles.routePt}>
          <Text style={styles.routeLabel}>partenza</Text>
          <Text style={styles.routeValue}>{dateLabel(trip.from) || '—'}</Text>
        </View>
        <View style={styles.routeLine}>
          <View style={styles.dashLine} />
          <View style={styles.planeChip}>
            <Text style={styles.planeEmoji}>✈️</Text>
          </View>
          {days > 0 && <Text style={styles.daysLabel}>{days} giorni</Text>}
        </View>
        <View style={[styles.routePt, styles.routePtRight]}>
          <Text style={styles.routeLabel}>ritorno</Text>
          <Text style={styles.routeValue}>{dateLabel(trip.to) || '—'}</Text>
        </View>
      </View>

      {/* Perforation */}
      <View style={styles.perfWrap}>
        <View style={[styles.perfCircle, styles.perfLeft]} />
        <View style={styles.perfDashes} />
        <View style={[styles.perfCircle, styles.perfRight]} />
      </View>

      {/* Balance */}
      <Text style={styles.balanceLabel}>Saldo del viaggio</Text>
      <Text style={styles.balanceBig} testID="balance-total">
        {cur} {money(totals.net)}
      </Text>

      <View style={styles.split}>
        <View style={styles.splitItem}>
          <Text style={styles.splitLabel}>Uscite</Text>
          <Text style={styles.splitValue} testID="total-out">{cur} {money(totals.out)}</Text>
        </View>
        <View style={styles.splitDivider} />
        <View style={styles.splitItem}>
          <Text style={styles.splitLabel}>Rientri</Text>
          <Text style={[styles.splitValue, { color: colors.success }]} testID="total-in">
            {cur} {money(totals.inc)}
          </Text>
        </View>
      </View>

      <View style={styles.perHead}>
        <Text style={styles.perHeadLabel}>A testa ({people})</Text>
        <Text style={styles.perHeadValue}>{cur} {money(perHead)}</Text>
      </View>

      {budgetAmt > 0 && (
        <View style={styles.budgetBox}>
          <View style={styles.budgetRow}>
            <Text style={styles.perHeadLabel}>
              {overBudget ? 'Oltre il budget' : 'Restano dal budget'}
            </Text>
            <Text style={[styles.perHeadValue, overBudget && { color: colors.error }]}>
              {cur} {money(Math.abs(budgetLeft))}
            </Text>
          </View>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.max(2, budgetPerc)}%`,
                  backgroundColor: overBudget ? colors.error : colors.brandSecondary,
                },
              ]}
            />
            <Text style={[styles.flyer, { left: `${Math.min(96, Math.max(0, budgetPerc - 4))}%` }]}>
              ✈️
            </Text>
          </View>
        </View>
      )}

      <View style={styles.footRow}>
        <View style={styles.barcode}>
          {Array.from({ length: 32 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.barcodeBar,
                { width: (i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2), opacity: i % 4 === 0 ? 0.85 : 0.5 },
              ]}
            />
          ))}
        </View>
        <View style={styles.stamp}>
          <Text style={styles.stampN}>{entriesCount}</Text>
          <Text style={styles.stampLbl}>voci</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    shadowColor: '#0d2237',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  route: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  routePt: { flex: 1 },
  routePtRight: { alignItems: 'flex-end' },
  routeLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: colors.muted },
  routeValue: { fontSize: 15, fontWeight: '700', color: colors.onSurface, marginTop: 2 },
  routeLine: { flex: 1.4, alignItems: 'center', justifyContent: 'center', position: 'relative', height: 28 },
  dashLine: { position: 'absolute', left: 6, right: 6, top: 13, height: 2, borderBottomWidth: 1.5, borderStyle: 'dashed', borderColor: colors.borderStrong },
  planeChip: { backgroundColor: colors.surfaceSecondary, paddingHorizontal: 4 },
  planeEmoji: { fontSize: 18, transform: [{ rotate: '10deg' }] },
  daysLabel: { position: 'absolute', bottom: -14, fontSize: 10, color: colors.muted },
  perfWrap: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.md, marginHorizontal: -spacing.lg, height: 22 },
  perfCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.surface },
  perfLeft: { marginLeft: -11 },
  perfRight: { marginRight: -11 },
  perfDashes: { flex: 1, borderBottomWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, marginHorizontal: 6 },
  balanceLabel: { fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 },
  balanceBig: { fontSize: 36, fontWeight: '800', color: colors.onSurface, letterSpacing: -1, marginTop: 2 },
  split: { flexDirection: 'row', marginTop: spacing.md, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md },
  splitItem: { flex: 1 },
  splitDivider: { width: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
  splitLabel: { fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  splitValue: { fontSize: 16, fontWeight: '700', color: colors.onSurface, marginTop: 2 },
  perHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  perHeadLabel: { fontSize: 13, color: colors.muted },
  perHeadValue: { fontSize: 15, fontWeight: '700', color: colors.onSurface },
  budgetBox: { marginTop: spacing.md },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  barTrack: { position: 'relative', height: 10, backgroundColor: colors.surface, borderRadius: 999, overflow: 'visible' },
  barFill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 999 },
  flyer: { position: 'absolute', top: -8, fontSize: 16 },
  footRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, gap: 12 },
  barcode: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 24, gap: 2 },
  barcodeBar: { height: '100%', backgroundColor: colors.onSurface },
  stamp: { alignItems: 'center', backgroundColor: colors.brandTertiary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, transform: [{ rotate: '-4deg' }] },
  stampN: { fontSize: 18, fontWeight: '800', color: colors.brand, lineHeight: 20 },
  stampLbl: { fontSize: 9, color: colors.brand, textTransform: 'uppercase', letterSpacing: 1 },
});
