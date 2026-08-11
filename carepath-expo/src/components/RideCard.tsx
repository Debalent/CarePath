import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '@/theme';
import StatusBadge from './StatusBadge';

export const rideField = (ride: any, key: string) => ride?.[key] ?? ride?.appointment?.[key];
export const personName = (person: any) => {
  const user = person?.user ?? person;
  return `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || '';
};
export const formatDateTime = (value?: string) => {
  if (!value) return 'Not scheduled';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};

export default function RideCard({ ride, actionLabel, onPress }: { ride: any; actionLabel?: string; onPress?: () => void }) {
  const clinic = rideField(ride, 'clinicName') || 'Medical appointment';
  const city = rideField(ride, 'clinicCity');
  const state = rideField(ride, 'clinicState');
  const patient = ride?.patientName || personName(ride?.patient);
  const driver = ride?.driverName || personName(ride?.driver);
  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.82} style={styles.card}>
      <View style={styles.top}><View style={styles.titleWrap}><Text style={styles.title}>{clinic}</Text><Text style={styles.when}>{formatDateTime(ride?.pickupTime || rideField(ride, 'appointmentDate'))}</Text></View><StatusBadge status={ride?.status} /></View>
      <View style={styles.divider} />
      <Text style={styles.line}><Text style={styles.label}>Pickup  </Text>{ride?.pickupAddress || 'Not provided'}</Text>
      {(city || state) ? <Text style={styles.line}><Text style={styles.label}>Destination  </Text>{[city, state].filter(Boolean).join(', ')}</Text> : null}
      {patient ? <Text style={styles.line}><Text style={styles.label}>Patient  </Text>{patient}</Text> : null}
      {driver ? <Text style={styles.line}><Text style={styles.label}>Driver  </Text>{driver}</Text> : null}
      {actionLabel ? <Text style={styles.action}>{actionLabel} →</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg, marginBottom: spacing.md },
  top: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', justifyContent: 'space-between' },
  titleWrap: { flex: 1 }, title: { color: colors.text, fontSize: 17, fontWeight: '900' }, when: { color: colors.muted, marginTop: 4, fontSize: 13 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md }, line: { color: '#475569', lineHeight: 21, marginTop: 3 }, label: { color: colors.text, fontWeight: '800' },
  action: { color: colors.blue, fontWeight: '900', marginTop: spacing.md },
});
