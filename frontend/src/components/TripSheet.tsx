import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, TextInput, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import { Trip } from '../data/types';
import { dateLabel } from '../utils/format';

export type TripSheetHandle = { present: () => void; dismiss: () => void };

type Props = {
  trip: Trip;
  onSave: (t: Trip) => void;
};

const CURRENCIES = ['€', '$', '£', 'CHF'];

export const TripSheet = forwardRef<TripSheetHandle, Props>(function TripSheet({ trip, onSave }, ref) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [draft, setDraft] = useState<Trip>(trip);
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  useEffect(() => setDraft(trip), [trip]);

  useImperativeHandle(ref, () => ({
    present: () => {
      setDraft(trip);
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const snapPoints = useMemo(() => ['80%'], []);

  const openDate = (key: 'from' | 'to') => {
    const val = draft[key] ? new Date(draft[key]) : new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: val,
        mode: 'date',
        onChange: (_e, d) => {
          if (d) setDraft({ ...draft, [key]: d.toISOString().slice(0, 10) });
        },
      });
    } else {
      key === 'from' ? setShowFrom(true) : setShowTo(true);
    }
  };

  const handleSave = () => {
    onSave({ ...draft, people: Math.max(1, Number(draft.people) || 1) });
    sheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backdropComponent={(p) => (
        <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />
      )}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dettagli viaggio</Text>
        <Pressable onPress={() => sheetRef.current?.dismiss()} hitSlop={12} testID="trip-close-btn">
          <Ionicons name="close" size={22} color={colors.muted} />
        </Pressable>
      </View>
      <BottomSheetScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxxl }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Nome del viaggio</Text>
        <TextInput
          value={draft.name}
          onChangeText={(v) => setDraft({ ...draft, name: v })}
          placeholder="Es. Weekend a Lisbona"
          style={styles.input}
          maxLength={40}
          testID="trip-name-input"
        />

        <Text style={styles.label}>Valuta</Text>
        <View style={styles.pillRow}>
          {CURRENCIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setDraft({ ...draft, cur: c })}
              style={[styles.pill, draft.cur === c && styles.pillActive]}
              testID={`cur-pill-${c}`}
            >
              <Text style={[styles.pillTxt, draft.cur === c && styles.pillTxtActive]}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Persone</Text>
            <TextInput
              value={String(draft.people)}
              onChangeText={(v) => setDraft({ ...draft, people: Number(v.replace(/[^0-9]/g, '')) || 1 })}
              keyboardType="number-pad"
              style={styles.input}
              testID="people-input"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Budget totale</Text>
            <TextInput
              value={draft.budget}
              onChangeText={(v) => setDraft({ ...draft, budget: v })}
              placeholder="Facoltativo"
              keyboardType="decimal-pad"
              style={styles.input}
              testID="budget-input"
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Partenza</Text>
            <Pressable onPress={() => openDate('from')} style={styles.input} testID="from-date-btn">
              <Text style={{ color: draft.from ? colors.onSurface : colors.muted }}>
                {dateLabel(draft.from) || 'Seleziona'}
              </Text>
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Ritorno</Text>
            <Pressable onPress={() => openDate('to')} style={styles.input} testID="to-date-btn">
              <Text style={{ color: draft.to ? colors.onSurface : colors.muted }}>
                {dateLabel(draft.to) || 'Seleziona'}
              </Text>
            </Pressable>
          </View>
        </View>

        {Platform.OS === 'ios' && showFrom && (
          <DateTimePicker
            value={draft.from ? new Date(draft.from) : new Date()}
            mode="date"
            display="spinner"
            onChange={(_e, d) => {
              if (d) setDraft({ ...draft, from: d.toISOString().slice(0, 10) });
            }}
          />
        )}
        {Platform.OS === 'ios' && showTo && (
          <DateTimePicker
            value={draft.to ? new Date(draft.to) : new Date()}
            mode="date"
            display="spinner"
            onChange={(_e, d) => {
              if (d) setDraft({ ...draft, to: d.toISOString().slice(0, 10) });
            }}
          />
        )}

        <Pressable style={styles.saveBtn} onPress={handleSave} testID="trip-save-btn">
          <Text style={styles.saveTxt}>Salva dettagli</Text>
        </Pressable>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bg: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  handle: { backgroundColor: colors.borderStrong, width: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  label: {
    fontSize: 12,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    fontSize: 15,
    color: colors.onSurface,
    minHeight: 46,
    justifyContent: 'center',
  },
  pillRow: { flexDirection: 'row', gap: 8 },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  pillActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  pillTxt: { color: colors.onSurface, fontWeight: '600' },
  pillTxtActive: { color: colors.onBrandPrimary },
  saveBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.brand,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveTxt: { color: colors.onBrandPrimary, fontWeight: '700', fontSize: 15 },
});
