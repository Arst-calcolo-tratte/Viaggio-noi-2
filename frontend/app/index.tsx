import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  RefreshControl,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { colors, spacing } from '@/src/theme';
import { CATS, INCOMES } from '@/src/data/categories';
import { AppState, Category, Item, Trip } from '@/src/data/types';
import { defaultState, loadState, saveState } from '@/src/data/storage';
import {
  computeTotals,
  dateLabel,
  daysBetween,
  groupByCategory,
  money,
  sumItems,
} from '@/src/utils/format';
import { BoardingPass } from '@/src/components/BoardingPass';
import { DonutChart } from '@/src/components/DonutChart';
import { CategoryCard } from '@/src/components/CategoryCard';
import { AddItemSheet, AddItemSheetHandle } from '@/src/components/AddItemSheet';
import { TripSheet, TripSheetHandle } from '@/src/components/TripSheet';
import { Toast, ToastHandle } from '@/src/components/Toast';

const HEADER_IMAGE =
  'https://images.unsplash.com/photo-1503365113766-4a362681eac5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxhaXJwb3J0JTIwZGVwYXJ0dXJlJTIwYm9hcmQlMjBhYnN0cmFjdCUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzg5MDYyMjExfDA&ixlib=rb-4.1.0&q=85';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const addSheetRef = useRef<AddItemSheetHandle>(null);
  const tripSheetRef = useRef<TripSheetHandle>(null);
  const toastRef = useRef<ToastHandle>(null);

  const showToast = (m: string) => toastRef.current?.show(m);

  useEffect(() => {
    loadState().then((s) => {
      setState(s);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  const totals = useMemo(() => computeTotals(state.items), [state.items]);
  const outGroups = useMemo(() => groupByCategory(state.items, 'out'), [state.items]);
  const inGroups = useMemo(() => groupByCategory(state.items, 'in'), [state.items]);

  const catMap = useMemo(() => {
    const m: Record<string, Category> = {};
    [...CATS, ...state.custom, ...INCOMES].forEach((c) => (m[c.id] = c));
    return m;
  }, [state.custom]);

  const slices = useMemo(() => {
    return Object.keys(outGroups).map((catId) => {
      const c = catMap[catId] || CATS[0];
      return {
        key: catId,
        value: sumItems(outGroups[catId]),
        color: c.c,
        emoji: c.e,
        label: c.n,
      };
    });
  }, [outGroups, catMap]);

  const handleSaveItem = useCallback((payload: Omit<Item, 'id'>) => {
    const item: Item = { ...payload, id: 'i_' + Date.now().toString(36) };
    setState((s) => ({ ...s, items: [item, ...s.items] }));
    showToast(payload.kind === 'in' ? 'Rientro salvato' : 'Spesa salvata');
  }, []);

  const handleCreateCustom = useCallback((name: string, emoji: string, color: { c: string; s: string }) => {
    const cat: Category = {
      id: 'c_' + Date.now().toString(36),
      n: name,
      e: emoji,
      c: color.c,
      s: color.s,
      mia: true,
    };
    setState((s) => ({ ...s, custom: [...s.custom, cat] }));
    showToast('Voce "' + name + '" creata');
    return cat;
  }, []);

  const handleDeleteItem = useCallback((id: string) => {
    setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) }));
    showToast('Voce eliminata');
  }, []);

  const handleSaveTrip = useCallback((trip: Trip) => {
    setState((s) => ({ ...s, trip }));
    showToast('Dettagli salvati');
  }, []);

  const buildSummary = () => {
    const t = totals;
    const lines: string[] = [];
    lines.push('🧳 ' + (state.trip.name || 'Conti di viaggio'));
    if (state.trip.from || state.trip.to) {
      const gg = daysBetween(state.trip.from, state.trip.to);
      lines.push(
        '🛫 ' + (dateLabel(state.trip.from) || '—') + '  →  ' + (dateLabel(state.trip.to) || '—') + (gg ? '  (' + gg + ' gg)' : '')
      );
    }
    lines.push('');
    lines.push('— Spese —');
    Object.keys(outGroups).forEach((cid) => {
      const c = catMap[cid];
      if (!c) return;
      const sum = sumItems(outGroups[cid]);
      lines.push(c.e + ' ' + c.n + ': ' + state.trip.cur + ' ' + money(sum));
      outGroups[cid].forEach((it) => {
        lines.push('   · ' + (it.desc || dateLabel(it.date)) + '  ' + state.trip.cur + ' ' + money(it.amount));
      });
    });
    if (Object.keys(inGroups).length) {
      lines.push('');
      lines.push('— Rientri —');
      Object.keys(inGroups).forEach((cid) => {
        const c = catMap[cid];
        if (!c) return;
        const sum = sumItems(inGroups[cid]);
        lines.push(c.e + ' ' + c.n + ': ' + state.trip.cur + ' ' + money(sum));
      });
    }
    lines.push('');
    lines.push('Totale spese: ' + state.trip.cur + ' ' + money(t.out));
    lines.push('Totale rientri: ' + state.trip.cur + ' ' + money(t.inc));
    lines.push('Saldo: ' + state.trip.cur + ' ' + money(t.net));
    return lines.join('\n');
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(buildSummary());
    showToast('Riepilogo copiato');
  };

  const handleExport = async () => {
    try {
      const data = JSON.stringify(
        { trip: state.trip, items: state.items, custom: state.custom, exported: new Date().toISOString() },
        null,
        2
      );
      const fileName = 'conti-viaggio-' + Date.now() + '.json';
      const path = (FileSystem as any).documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(path, data, { encoding: FileSystem.EncodingType.UTF8 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Salva backup' });
      } else {
        showToast('Backup salvato');
      }
    } catch (e) {
      showToast('Errore export');
    }
  };

  const handleImport = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
      if (res.canceled) return;
      const uri = res.assets[0].uri;
      const raw = await FileSystem.readAsStringAsync(uri);
      const d = JSON.parse(raw);
      if (!d || !d.trip || !Array.isArray(d.items)) {
        showToast('File non valido');
        return;
      }
      setState({
        trip: { ...defaultState.trip, ...d.trip },
        items: d.items,
        custom: Array.isArray(d.custom) ? d.custom : [],
        open: {},
      });
      showToast('Backup importato');
    } catch (e) {
      showToast('Errore lettura file');
    }
  };

  const handleReset = () => {
    Alert.alert('Azzerare tutto?', 'Cancella tutte le spese, rientri e dettagli del viaggio.', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Azzera',
        style: 'destructive',
        onPress: () => {
          setState(defaultState);
          showToast('Tutto azzerato');
        },
      },
    ]);
  };

  const bottomBarHeight = 76;

  return (
    <View style={styles.root}>
      {/* Header background */}
      <ImageBackground source={{ uri: HEADER_IMAGE }} style={styles.headerBg} imageStyle={styles.headerImg}>
        <LinearGradient
          colors={['rgba(13,34,55,0.75)', 'rgba(13,34,55,0.9)', colors.surface]}
          locations={[0, 0.6, 1]}
          style={styles.scrim}
        />
      </ImageBackground>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + spacing.sm, paddingBottom: bottomBarHeight + insets.bottom + spacing.lg }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              const s = await loadState();
              setState(s);
              setRefreshing(false);
            }}
            tintColor="#fff"
          />
        }
      >
        {/* Top header row */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandLabel}>CONTI DI VIAGGIO</Text>
            <Text style={styles.tripName} numberOfLines={1} testID="trip-name-display">
              {state.trip.name || 'Il tuo prossimo viaggio'}
            </Text>
          </View>
          <Pressable
            onPress={() => tripSheetRef.current?.present()}
            style={styles.iconBtn}
            testID="open-trip-settings-btn"
          >
            <Ionicons name="options-outline" size={20} color="#fff" />
          </Pressable>
        </View>

        {/* Boarding pass */}
        <BoardingPass trip={state.trip} totals={totals} entriesCount={state.items.length} />

        {/* Chart */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Dove vanno i soldi</Text>
            <Text style={styles.sectionSub}>
              {Object.keys(outGroups).length} {Object.keys(outGroups).length === 1 ? 'categoria' : 'categorie'}
            </Text>
          </View>
          <DonutChart slices={slices} total={totals.out} currency={state.trip.cur} formatMoney={money} />
        </View>

        {/* Expenses */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Spese</Text>
            <Text style={styles.sectionSub}>{Object.keys(outGroups).length}</Text>
          </View>
          {Object.keys(outGroups).length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🌍</Text>
              <Text style={styles.emptyTitle}>Ancora nessuna spesa</Text>
              <Text style={styles.emptyTxt}>Tocca "Nuova spesa" e scegli la voce.</Text>
            </View>
          ) : (
            Object.keys(outGroups).map((cid) => {
              const c = catMap[cid];
              if (!c) return null;
              return (
                <CategoryCard
                  key={cid}
                  category={c}
                  items={outGroups[cid]}
                  totalOfKind={totals.out}
                  currency={state.trip.cur}
                  onDeleteItem={handleDeleteItem}
                />
              );
            })
          )}
        </View>

        {/* Incomes */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Rientri e rimborsi</Text>
            <Text style={styles.sectionSub}>{Object.keys(inGroups).length}</Text>
          </View>
          {Object.keys(inGroups).length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>💌</Text>
              <Text style={styles.emptyTitle}>Nessun rientro</Text>
              <Text style={styles.emptyTxt}>Rimborsi, quote amici o soldi recuperati.</Text>
            </View>
          ) : (
            Object.keys(inGroups).map((cid) => {
              const c = catMap[cid];
              if (!c) return null;
              return (
                <CategoryCard
                  key={cid}
                  category={c}
                  items={inGroups[cid]}
                  totalOfKind={totals.inc}
                  currency={state.trip.cur}
                  isIncome
                  onDeleteItem={handleDeleteItem}
                />
              );
            })
          )}
        </View>

        {/* Tools */}
        <View style={[styles.section, { marginBottom: spacing.md }]}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Strumenti</Text>
          </View>
          <View style={styles.toolsGrid}>
            <ToolBtn icon="copy-outline" label="Copia riepilogo" onPress={handleCopy} testID="tool-copy" />
            <ToolBtn icon="download-outline" label="Salva backup" onPress={handleExport} testID="tool-export" />
            <ToolBtn icon="folder-open-outline" label="Apri backup" onPress={handleImport} testID="tool-import" />
            <ToolBtn icon="trash-outline" label="Azzera tutto" onPress={handleReset} danger testID="tool-reset" />
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom actions */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(spacing.md, insets.bottom) }]} pointerEvents="box-none">
        <BlurView intensity={40} tint="light" style={styles.blur}>
          <View style={styles.bottomRow}>
            <Pressable
              style={[styles.actBtn, styles.actPrimary]}
              onPress={() => addSheetRef.current?.present('out')}
              testID="new-expense-btn"
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.actPrimaryTxt}>Nuova spesa</Text>
            </Pressable>
            <Pressable
              style={[styles.actBtn, styles.actSecondary]}
              onPress={() => addSheetRef.current?.present('in')}
              testID="new-income-btn"
            >
              <Ionicons name="arrow-up" size={18} color={colors.success} />
              <Text style={styles.actSecondaryTxt}>Rientro</Text>
            </Pressable>
          </View>
        </BlurView>
      </View>

      <Toast ref={toastRef} />
      <AddItemSheet ref={addSheetRef} customCats={state.custom} onSave={handleSaveItem} onCreateCustom={handleCreateCustom} />
      <TripSheet ref={tripSheetRef} trip={state.trip} onSave={handleSaveTrip} />
    </View>
  );
}

function ToolBtn({ icon, label, onPress, danger, testID }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; danger?: boolean; testID?: string }) {
  return (
    <Pressable style={[styles.tool, danger && styles.toolDanger]} onPress={onPress} testID={testID}>
      <Ionicons name={icon} size={20} color={danger ? colors.error : colors.brand} />
      <Text style={[styles.toolTxt, danger && { color: colors.error }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 260 },
  headerImg: { resizeMode: 'cover' },
  scrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    gap: 12,
  },
  brandLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  tripName: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.onSurface, letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, color: colors.muted },
  empty: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
    gap: 6,
  },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: colors.onSurface, marginTop: 4 },
  emptyTxt: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tool: {
    flexBasis: '48%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toolDanger: { borderColor: '#fecaca', backgroundColor: '#fff5f5' },
  toolTxt: { fontSize: 13, fontWeight: '600', color: colors.onSurface },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  blur: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: 'rgba(13,34,55,0.06)' },
  bottomRow: { flexDirection: 'row', gap: 10 },
  actBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 16,
  },
  actPrimary: { flex: 2, backgroundColor: colors.brand },
  actPrimaryTxt: { color: colors.onBrandPrimary, fontWeight: '700', fontSize: 15 },
  actSecondary: {
    flex: 1,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actSecondaryTxt: { color: colors.success, fontWeight: '700', fontSize: 14 },
});
