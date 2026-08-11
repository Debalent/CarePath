import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import MetricCard from '@/components/MetricCard';
import RideCard from '@/components/RideCard';
import { colors, spacing, typography } from '@/theme';
import { getMyUpcomingRidesApi } from '@/api/rides';

const asArray = (data: any): any[] => Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : Array.isArray(data?.rides) ? data.rides : [];

export default function MyRidesScreen() {
  const navigation = useNavigation<any>();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const load = useCallback(async () => { try { setRides(asArray(await getMyUpcomingRidesApi())); } catch (e: any) { Alert.alert('My rides', String(e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Could not load rides')); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const active = useMemo(() => rides.filter(r => !['COMPLETED','CANCELLED'].includes(String(r.status).toUpperCase())), [rides]);
  const completed = useMemo(() => rides.filter(r => String(r.status).toUpperCase() === 'COMPLETED'), [rides]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return <Screen scroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
    <Text style={styles.kicker}>TRANSPORTATION HISTORY</Text><Text style={styles.h1}>My rides</Text><Text style={styles.sub}>Upcoming transportation and completed care trips in one place.</Text>
    <View style={styles.metrics}><MetricCard label="Active" value={active.length} /><MetricCard label="Completed" value={completed.length} /></View>
    <Text style={styles.sectionTitle}>Upcoming & active</Text>
    {loading ? <Text style={styles.muted}>Loading rides…</Text> : null}
    {!loading && active.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No active rides</Text><Text style={styles.muted}>Request a ride when you have an upcoming appointment.</Text></View> : active.map(r => <RideCard key={r.id} ride={r} actionLabel="View ride status" onPress={() => navigation.navigate('Tracking', { rideId: r.id })} />)}
    {completed.length ? <><Text style={styles.sectionTitle}>Completed trips</Text>{completed.slice(0, 5).map(r => <RideCard key={r.id} ride={r} />)}</> : null}
    <View style={{ height: spacing.lg }} /><Button title="Request another ride" onPress={() => navigation.navigate('RequestRide')} /><View style={{ height: spacing.sm }} /><Button title="Refresh" variant="secondary" onPress={load} />
  </Screen>;
}

const styles = StyleSheet.create({
  kicker: { color: colors.primary, fontSize: 11, letterSpacing: 1.4, fontWeight: '900' }, h1: { color: colors.text, fontSize: typography.h2, fontWeight: '900', marginTop: 6 }, sub: { color: colors.muted, lineHeight: 21, marginTop: 5, marginBottom: spacing.lg }, metrics: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }, sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.xl, marginBottom: spacing.md }, muted: { color: colors.muted }, empty: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg }, emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: 4 },
});
