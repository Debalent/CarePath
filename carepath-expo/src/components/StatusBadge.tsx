import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

const palette = (status?: string) => {
  switch ((status ?? '').toUpperCase()) {
    case 'COMPLETED': return { bg: '#ECFDF5', fg: '#047857' };
    case 'IN_PROGRESS': return { bg: '#EFF6FF', fg: '#1D4ED8' };
    case 'CONFIRMED': return { bg: '#F3E8FF', fg: '#7E22CE' };
    case 'MATCHED': return { bg: '#F5F3FF', fg: colors.purple };
    case 'FALLBACK_NEEDED': return { bg: '#FFF7ED', fg: '#C2410C' };
    case 'CANCELLED': return { bg: '#FEF2F2', fg: '#B91C1C' };
    default: return { bg: '#F1F5F9', fg: '#475569' };
  }
};

export default function StatusBadge({ status }: { status?: string }) {
  const p = palette(status);
  const label = (status ?? 'PENDING').replaceAll('_', ' ');
  return <View style={[styles.badge, { backgroundColor: p.bg }]}><Text style={[styles.text, { color: p.fg }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  text: { fontSize: 11, fontWeight: '900', letterSpacing: 0.3 },
});
