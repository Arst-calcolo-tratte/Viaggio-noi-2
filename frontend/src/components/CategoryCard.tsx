import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { Category, Item } from '../data/types';
import { dateLabel, money, sumItems } from '../utils/format';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  category: Category;
  items: Item[];
  totalOfKind: number; // total for all items of this kind (for share bar)
  currency: string;
  isIncome?: boolean;
  onDeleteItem: (id: string) => void;
};

export function CategoryCard({ category, items, totalOfKind, currency, isIncome, onDeleteItem }: Props) {
  const [open, setOpen] = useState(false);
  const sum = sumItems(items);
  const share = totalOfKind > 0 ? (sum / totalOfKind) * 100 : 0;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(!open);
  };

  return (
    <View style={styles.card} testID={`cat-card-${category.id}`}>
      <Pressable onPress={toggle} style={styles.head} testID={`cat-toggle-${category.id}`}>
        <View style={[styles.emo, { backgroundColor: category.s }]}>
          <Text style={styles.emoTxt}>{category.e}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{category.n}</Text>
          <View style={styles.shareTrack}>
            <View style={[styles.shareFill, { width: `${share.toFixed(1)}%`, backgroundColor: category.c }]} />
          </View>
          <Text style={styles.count}>
            {items.length} {items.length === 1 ? 'voce' : 'voci'} · {share.toFixed(0)}%
          </Text>
        </View>
        <View style={styles.totalCol}>
          <Text style={[styles.total, isIncome && { color: colors.success }]}>
            {isIncome ? '−' : ''}{currency} {money(sum)}
          </Text>
          <Ionicons
            name={open ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={colors.muted}
            style={{ marginTop: 2 }}
          />
        </View>
      </Pressable>

      {open && (
        <View style={styles.itemList}>
          {items.map((it) => (
            <View style={styles.itemRow} key={it.id} testID={`item-${it.id}`}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemDesc} numberOfLines={1}>{it.desc || 'Voce'}</Text>
                <Text style={styles.itemDate}>{dateLabel(it.date)}</Text>
              </View>
              <Text style={[styles.itemAmt, isIncome && { color: colors.success }]}>
                {isIncome ? '−' : ''}{currency} {money(it.amount)}
              </Text>
              <Pressable
                onPress={() => onDeleteItem(it.id)}
                hitSlop={10}
                style={styles.delBtn}
                testID={`item-delete-${it.id}`}
              >
                <Ionicons name="trash-outline" size={16} color={colors.muted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    marginTop: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#0d2237',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  head: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: 12 },
  emo: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emoTxt: { fontSize: 22 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600', color: colors.onSurface },
  shareTrack: { marginTop: 6, height: 4, backgroundColor: colors.surface, borderRadius: 999, overflow: 'hidden' },
  shareFill: { height: '100%', borderRadius: 999 },
  count: { fontSize: 11.5, color: colors.muted, marginTop: 4 },
  totalCol: { alignItems: 'flex-end' },
  total: { fontSize: 15, fontWeight: '700', color: colors.onSurface },
  itemList: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemInfo: { flex: 1, minWidth: 0 },
  itemDesc: { fontSize: 14, color: colors.onSurface },
  itemDate: { fontSize: 11, color: colors.muted, marginTop: 2 },
  itemAmt: { fontSize: 14, fontWeight: '700', color: colors.onSurface },
  delBtn: { padding: 4 },
});
