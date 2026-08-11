import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import MetricCard from '@/components/MetricCard';
import RideCard from '@/components/RideCard';
import { colors, spacing, typography } from '@/theme';
import { getAssignedUpcomingRidesApi, updateRideStatusApi } from '@/api/rides';
import { useAuth } from '@/auth/AuthContext';

const asArray = (data: any): any[] => Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : Array.isArray(data?.rides) ? data.rides : [];

export default function DriverRidesScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const load = useCallback(async () => { try { setRides(asArray(await getAssignedUpcomingRidesApi())); } catch (e: any) { Alert.alert('Assigned rides', String(e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Could not load rides')); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const active = useMemo(() => rides.filter(r => !['COMPLETED','CANCELLED'].includes(String(r.status).toUpperCase())), [rides]);
  const completed = useMemo(() => rides.filter(r => String(r.status).toUpperCase() === 'COMPLETED').length, [rides]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const update = async (ride: any, status: string) => { try { setWorkingId(ride.id); await updateRideStatusApi(ride.id, status); await load(); } catch (e: any) { Alert.alert('Ride status', String(e?.response?.data?.error || e?.message || 'Could not update ride')); } finally { setWorkingId(null); } };

  return <Screen scroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
    <View style={styles.hero}><Text style={styles.kicker}>DRIVER DASHBOARD</Text><Text style={styles.h1}>Ready to drive{user?.firstName ? `, ${user.firstName}` : ''}?</Text><Text style={styles.heroText}>Review your assignments, keep ride status current, and help patients arrive with confidence.</Text></View>
    <View style={styles.metrics}><MetricCard label="Active assignments" value={active.length} hint="Matched or underway" /><MetricCard label="Completed" value={completed} hint="Trips on this account" /></View>
    <View style={styles.trackCard}><View><Text style={styles.trackTitle}>Live navigation view</Text><Text style={styles.trackText}>Open your active trip timeline and handoff status.</Text></View><Button title="Track" variant="purple" onPress={() => navigation.navigate('Tracking')} style={{ minWidth: 90 }} /></View>
    <Text style={styles.sectionTitle}>Assigned rides</Text>
    {loading ? <Text style={styles.muted}>Loading assignments…</Text> : null}
    {!loading && rides.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>No assigned rides</Text><Text style={styles.muted}>New coordinator assignments will appear here.</Text></View> : rides.map(r => <View key={r.id}>
      <RideCard ride={r} actionLabel="View tracking" onPress={() => navigation.navigate('Tracking', { rideId: r.id })} />
      {!['COMPLETED','CANCELLED'].includes(String(r.status).toUpperCase()) ? <View style={styles.actions}>
        {String(r.status).toUpperCase() === 'MATCHED' ? <Button title="Confirm ride" variant="purple" loading={workingId===r.id} onPress={() => update(r, 'CONFIRMED')} style={styles.flexButton} /> : null}
        {String(r.status).toUpperCase() === 'CONFIRMED' ? <Button title="Start ride" loading={workingId===r.id} onPress={() => update(r, 'IN_PROGRESS')} style={styles.flexButton} /> : null}
        {String(r.status).toUpperCase() === 'IN_PROGRESS' ? <Button title="Complete ride" loading={workingId===r.id} onPress={() => update(r, 'COMPLETED')} style={styles.flexButton} /> : null}
      </View> : null}
    </View>)}
    <View style={{ height: spacing.md }} /><Button title="Refresh assignments" variant="secondary" onPress={load} /><View style={{ height: spacing.sm }} /><Button title="Log out" variant="secondary" onPress={async () => { try { await logout(); } catch { Alert.alert('Logout', 'Could not logout'); } }} />
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 22, padding: spacing.xl, marginBottom: spacing.lg }, kicker: { color: '#BAE6FD', fontSize: 11, letterSpacing: 1.5, fontWeight: '900' }, h1: { color: '#FFF', fontSize: typography.h2, fontWeight: '900', marginTop: spacing.sm }, heroText: { color: '#CBD5E1', lineHeight: 22, marginTop: spacing.sm }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, trackCard: { marginTop: spacing.lg, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, trackTitle: { color: colors.text, fontWeight: '900' }, trackText: { color: colors.muted, fontSize: 12, marginTop: 4, maxWidth: 210 }, sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.xl, marginBottom: spacing.md }, muted: { color: colors.muted }, empty: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg }, emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: 4 }, actions: { flexDirection: 'row', gap: spacing.sm, marginTop: -spacing.xs, marginBottom: spacing.lg }, flexButton: { flex: 1 },
});
