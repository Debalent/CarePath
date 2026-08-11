import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import MetricCard from '@/components/MetricCard';
import RideCard from '@/components/RideCard';
import { colors, spacing, typography } from '@/theme';
import { getPendingRidesApi, triggerFallbackApi } from '@/api/rides';
import { useAuth } from '@/auth/AuthContext';

const asArray = (data: any): any[] => Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : Array.isArray(data?.rides) ? data.rides : [];

export default function CoordinatorRequestsScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const load = useCallback(async () => { try { setRides(asArray(await getPendingRidesApi())); } catch (e: any) { Alert.alert('Ride requests', String(e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Could not load requests')); } finally { setLoading(false); } }, []);
  useEffect(() => { load(); }, [load]);
  const fallbackCount = useMemo(() => rides.filter(r => String(r.status).toUpperCase() === 'FALLBACK_NEEDED').length, [rides]);
  const urgentCount = useMemo(() => rides.filter(r => ['HIGH','CRITICAL'].includes(String(r.urgencyLevel).toUpperCase())).length, [rides]);
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };
  const fallback = async (rideId: string) => { try { setWorkingId(rideId); await triggerFallbackApi(rideId); await load(); } catch (e: any) { Alert.alert('Fallback', String(e?.response?.data?.error || e?.message || 'Could not activate fallback')); } finally { setWorkingId(null); } };

  return <Screen scroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
    <View style={styles.hero}><Text style={styles.kicker}>COORDINATOR WORKSPACE</Text><Text style={styles.h1}>Ride command center{user?.firstName ? `, ${user.firstName}` : ''}</Text><Text style={styles.heroText}>Triage transportation requests, assign the best driver, and protect appointment access.</Text></View>
    <View style={styles.metrics}><MetricCard label="Awaiting assignment" value={rides.length} hint="Current queue" /><MetricCard label="Urgent" value={urgentCount} hint="High / critical" /><MetricCard label="Fallback" value={fallbackCount} hint="Needs escalation" /></View>
    <Text style={styles.sectionTitle}>Dispatch queue</Text>
    {loading ? <Text style={styles.muted}>Loading requests…</Text> : null}
    {!loading && rides.length === 0 ? <View style={styles.empty}><Text style={styles.emptyTitle}>Queue is clear</Text><Text style={styles.muted}>New patient ride requests will appear here.</Text></View> : rides.map(r => <View key={r.id}>
      <RideCard ride={r} actionLabel="Choose driver" onPress={() => navigation.navigate('AssignDriver', { rideId: r.id })} />
      <View style={styles.actions}><Button title="Assign driver" variant="purple" onPress={() => navigation.navigate('AssignDriver', { rideId: r.id })} style={styles.flexButton} /><Button title="Fallback" variant="secondary" loading={workingId===r.id} onPress={() => fallback(r.id)} style={styles.flexButton} /></View>
    </View>)}
    <View style={{ height: spacing.md }} /><Button title="Refresh queue" variant="secondary" onPress={load} /><View style={{ height: spacing.sm }} /><Button title="Log out" variant="secondary" onPress={async () => { try { await logout(); } catch { Alert.alert('Logout', 'Could not logout'); } }} />
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.purple, borderRadius: 22, padding: spacing.xl, marginBottom: spacing.lg }, kicker: { color: '#EDE9FE', fontSize: 11, letterSpacing: 1.5, fontWeight: '900' }, h1: { color: '#FFF', fontSize: typography.h2, fontWeight: '900', marginTop: spacing.sm }, heroText: { color: '#F3F0FA', lineHeight: 22, marginTop: spacing.sm }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.xl, marginBottom: spacing.md }, muted: { color: colors.muted }, empty: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg }, emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: 4 }, actions: { flexDirection: 'row', gap: spacing.sm, marginTop: -spacing.xs, marginBottom: spacing.lg }, flexButton: { flex: 1 },
});
