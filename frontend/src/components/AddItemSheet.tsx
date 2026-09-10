import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { colors, spacing } from '../theme';
import { CATS, INCOMES, PALETTE, FREE_EMOJI } from '../data/categories';
import { Category, Item } from '../data/types';
import { num, today, dateLabel } from '../utils/format';

export type AddItemSheetHandle = {
  present: (kind: 'out' | 'in') => void;
  dismiss: () => void;
};

type Props = {
  customCats: Category[];
  onSave: (payload: Omit<Item, 'id'>) => void;
  onCreateCustom: (name: string, emoji: string, color: { c: string; s: string }) => Category;
};

export const AddItemSheet = forwardRef<AddItemSheetHandle, Props>(function AddItemSheet(
  { customCats, onSave, onCreateCustom },
  ref
) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [kind, setKind] = useState<'out' | 'in'>('out');
  const [catId, setCatId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(today());
  const [showPicker, setShowPicker] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState(FREE_EMOJI[0]);
  const [newPaletteIdx, setNewPaletteIdx] = useState(0);
  const [amountError, setAmountError] = useState(false);

  useImperativeHandle(ref, () => ({
    present: (k: 'out' | 'in') => {
      setKind(k);
      setCatId(k === 'in' ? INCOMES[0].id : '');
      setAmount('');
      setDesc('');
      setDate(today());
      setCreatingNew(false);
      setNewName('');
      setNewEmoji(FREE_EMOJI[0]);
      setNewPaletteIdx(0);
      setAmountError(false);
      sheetRef.current?.present();
    },
    dismiss: () => sheetRef.current?.dismiss(),
  }));

  const snapPoints = useMemo(() => ['85%'], []);
  const catList: Category[] = kind === 'in' ? INCOMES : [...CATS, ...customCats];

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: new Date(date),
        onChange: (_e, d) => {
          if (d) setDate(d.toISOString().slice(0, 10));
        },
        mode: 'date',
      });
    } else {
      setShowPicker(true);
    }
  };

  const handleSave = () => {
    const val = num(amount);
    if (!val || val <= 0) {
      setAmountError(true);
      return;
    }
    if (!catId) return;
    onSave({ cat: catId, kind, amount: val, desc: desc.trim(), date });
    sheetRef.current?.dismiss();
  };

  const handleCreateCustomSubmit = () => {
    if (!newName.trim()) return;
    const c = onCreateCustom(newName.trim(), newEmoji, PALETTE[newPaletteIdx]);
    setCatId(c.id);
    setCreatingNew(false);
    setNewName('');
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backgroundStyle={styles.bg}
      handleIndicatorStyle={styles.handle}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={(p) => (
        <BottomSheetBackdrop {...p} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.4} />
      )}
    >
      <BottomSheetView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{kind === 'in' ? 'Nuovo rientro' : 'Nuova spesa'}</Text>
            <Pressable onPress={() => sheetRef.current?.dismiss()} hitSlop={12} testID="sheet-close-btn">
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionLabel}>Categoria</Text>
            <View style={styles.picker}>
              {catList.map((c) => {
                const active = catId === c.id;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => {
                      setCatId(c.id);
                      setCreatingNew(false);
                      Keyboard.dismiss();
                    }}
                    style={[styles.chip, { backgroundColor: c.s }, active && { borderColor: c.c }]}
                    testID={`chip-${c.id}`}
                  >
                    <Text style={styles.chipEmo}>{c.e}</Text>
                    <Text style={styles.chipLbl} numberOfLines={2}>
                      {c.n}
                    </Text>
                  </Pressable>
                );
              })}
              {kind === 'out' && (
                <Pressable
                  onPress={() => {
                    setCreatingNew(true);
                    setCatId('');
                  }}
                  style={[styles.chip, styles.chipAdd, creatingNew && { borderColor: colors.brand }]}
                  testID="chip-add-custom"
                >
                  <Ionicons name="add" size={22} color={colors.brand} />
                  <Text style={styles.chipLbl}>Nuova voce</Text>
                </Pressable>
              )}
            </View>

            {creatingNew && (
              <View style={styles.newCat}>
                <Text style={styles.sectionLabel}>Nome della voce</Text>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  placeholder="Es. Volo di ritorno"
                  style={styles.input}
                  maxLength={30}
                  testID="new-cat-name"
                />
                <Text style={styles.sectionLabel}>Emoji</Text>
                <View style={styles.emojiRow}>
                  {FREE_EMOJI.map((e) => (
                    <Pressable
                      key={e}
                      onPress={() => setNewEmoji(e)}
                      style={[styles.emojiBtn, newEmoji === e && styles.emojiBtnActive]}
                    >
                      <Text style={styles.chipEmo}>{e}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={styles.sectionLabel}>Colore</Text>
                <View style={styles.emojiRow}>
                  {PALETTE.map((p, i) => (
                    <Pressable
                      key={i}
                      onPress={() => setNewPaletteIdx(i)}
                      style={[styles.colorDot, { backgroundColor: p.c }, newPaletteIdx === i && styles.colorDotActive]}
                    />
                  ))}
                </View>
                <Pressable style={styles.createBtn} onPress={handleCreateCustomSubmit} testID="create-custom-btn">
                  <Text style={styles.createBtnTxt}>Crea voce</Text>
                </Pressable>
              </View>
            )}

            <Text style={styles.sectionLabel}>Importo</Text>
            <View style={[styles.amtWrap, amountError && styles.amtWrapErr]}>
              <Text style={styles.amtCur}>€</Text>
              <TextInput
                value={amount}
                onChangeText={(v) => {
                  setAmount(v);
                  if (amountError) setAmountError(false);
                }}
                placeholder="0,00"
                keyboardType="decimal-pad"
                style={styles.amtInput}
                testID="amount-input"
              />
            </View>
            {amountError && <Text style={styles.errTxt}>Scrivi un importo maggiore di zero</Text>}

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionLabel}>Descrizione</Text>
                <TextInput
                  value={desc}
                  onChangeText={setDesc}
                  placeholder="Facoltativa"
                  style={styles.input}
                  maxLength={60}
                  testID="desc-input"
                />
              </View>
              <View style={{ width: 130 }}>
                <Text style={styles.sectionLabel}>Data</Text>
                <Pressable onPress={openDatePicker} style={styles.input} testID="date-picker-btn">
                  <Text style={{ color: colors.onSurface }}>{dateLabel(date) || 'Oggi'}</Text>
                </Pressable>
              </View>
            </View>

            {Platform.OS === 'ios' && showPicker && (
              <DateTimePicker
                value={new Date(date)}
                mode="date"
                display="spinner"
                onChange={(_e, d) => {
                  if (d) setDate(d.toISOString().slice(0, 10));
                }}
              />
            )}

            <View style={styles.actions}>
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => sheetRef.current?.dismiss()}>
                <Text style={[styles.btnTxt, { color: colors.onSurface }]}>Annulla</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handleSave} testID="save-item-btn">
                <Text style={styles.btnTxt}>Salva</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheetView>
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
  sectionLabel: {
    fontSize: 12,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  picker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    width: '30%',
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  chipEmo: { fontSize: 22 },
  chipLbl: { fontSize: 11, textAlign: 'center', color: colors.onSurface, fontWeight: '500' },
  chipAdd: {
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSecondary,
  },
  newCat: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 12,
  },
  input: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    color: colors.onSurface,
  },
  emojiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiBtnActive: { borderColor: colors.brand },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorDotActive: { borderColor: colors.onSurface },
  createBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.brand,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  createBtnTxt: { color: colors.onBrandPrimary, fontWeight: '700' },
  amtWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  amtWrapErr: { borderColor: colors.error },
  amtCur: { fontSize: 22, color: colors.muted, marginRight: 8 },
  amtInput: { flex: 1, fontSize: 22, fontWeight: '700', color: colors.onSurface, paddingVertical: 12 },
  errTxt: { color: colors.error, fontSize: 12, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 10, marginTop: spacing.xl },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  btnGhost: { backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.border },
  btnPrimary: { backgroundColor: colors.brand },
  btnTxt: { color: colors.onBrandPrimary, fontWeight: '700', fontSize: 15 },
});
