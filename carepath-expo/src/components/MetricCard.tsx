import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

export default function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <View style={styles.card}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text>{hint ? <Text style={styles.hint}>{hint}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 145, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: spacing.md },
  label: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  value: { color: colors.text, fontSize: 28, fontWeight: '900', marginTop: 6 },
  hint: { color: colors.subtle, fontSize: 11, marginTop: 4 },
});
