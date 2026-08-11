import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '@/theme';

const pad2 = (n: number) => String(n).padStart(2, '0');

const toLocalValue = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const parseLocal = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

const TIME_OPTIONS = [8, 9, 10, 11, 12, 13, 14, 15, 16];

export default function DateTimeField(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  helperText?: string;
}) {
  const selected = useMemo(() => parseLocal(props.value), [props.value]);

  const changeDay = (days: number) => {
    const next = new Date(selected);
    next.setDate(next.getDate() + days);
    props.onChangeText(toLocalValue(next));
  };

  const setDayOffsetFromToday = (days: number) => {
    const next = new Date();
    next.setDate(next.getDate() + days);
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    props.onChangeText(toLocalValue(next));
  };

  const setHour = (hour: number) => {
    const next = new Date(selected);
    next.setHours(hour, 0, 0, 0);
    props.onChangeText(toLocalValue(next));
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>

      <View style={styles.dateCard}>
        <TouchableOpacity style={styles.arrowButton} onPress={() => changeDay(-1)}>
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.dateCenter}>
          <Text style={styles.dateText}>{formatDate(selected)}</Text>
          <Text style={styles.timeText}>{formatTime(selected)}</Text>
        </View>

        <TouchableOpacity style={styles.arrowButton} onPress={() => changeDay(1)}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickRow}>
        <TouchableOpacity style={styles.quickButton} onPress={() => setDayOffsetFromToday(0)}>
          <Text style={styles.quickText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => setDayOffsetFromToday(1)}>
          <Text style={styles.quickText}>Tomorrow</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickButton} onPress={() => setDayOffsetFromToday(7)}>
          <Text style={styles.quickText}>+1 week</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.timeLabel}>Choose a time</Text>
      <View style={styles.timeGrid}>
        {TIME_OPTIONS.map((hour) => {
          const active = selected.getHours() === hour && selected.getMinutes() === 0;
          const sample = new Date(selected);
          sample.setHours(hour, 0, 0, 0);

          return (
            <TouchableOpacity
              key={hour}
              onPress={() => setHour(hour)}
              style={[styles.timeChip, active && styles.timeChipActive]}
            >
              <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>
                {sample.toLocaleTimeString(undefined, { hour: 'numeric' })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {props.helperText ? <Text style={styles.helper}>{props.helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  label: {
    color: colors.text,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '700',
  },
  dateCard: {
    minHeight: 72,
    backgroundColor: colors.inputBg,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  arrowText: { color: colors.primary, fontSize: 30, lineHeight: 32, fontWeight: '700' },
  dateCenter: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.sm },
  dateText: { color: colors.text, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  timeText: { color: colors.primary, fontSize: 15, fontWeight: '700', marginTop: 3 },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  quickButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
  },
  quickText: { color: colors.text, fontSize: 12, fontWeight: '700' },
  timeLabel: { color: colors.muted, fontSize: 12, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.sm },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    minWidth: 62,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  timeChipTextActive: { color: '#fff' },
  helper: { color: colors.muted, marginTop: spacing.sm, fontSize: 12, lineHeight: 17 },
});
