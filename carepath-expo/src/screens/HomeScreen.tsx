import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import MetricCard from '@/components/MetricCard';
import RideCard from '@/components/RideCard';
import { useAuth } from '@/auth/AuthContext';
import { getMyUpcomingRidesApi } from '@/api/rides';
import { colors, spacing } from '@/theme';

const array = (d: any) => Array.isArray(d) ? d : Array.isArray(d?.rides) ? d.rides : Array.isArray(d?.results) ? d.results : [];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => { if (user?.role === 'DRIVER') navigation.replace('DriverRides'); else if (user?.role === 'COORDINATOR' || user?.role === 'ADMIN') navigation.replace('CoordinatorRequests'); }, [navigation, user?.role]);
  const load = useCallback(async () => { if (user?.role === 'PATIENT') { try { setRides(array(await getMyUpcomingRidesApi())); } catch {} } }, [user?.role]);
  useEffect(() => { load(); }, [load]);

  const active = rides.filter(r => !['COMPLETED','CANCELLED'].includes(String(r.status).toUpperCase()));
  const completed = rides.filter(r => String(r.status).toUpperCase() === 'COMPLETED').length;
  const next = active[0];

  return <Screen scroll>
    <View style={styles.hero}><Text style={styles.eyebrow}>CAREPATH PATIENT PORTAL</Text><Text style={styles.h1}>Welcome{user?.firstName ? `, ${user.firstName}` : ''}</Text><Text style={styles.heroText}>Your transportation hub for getting to care with fewer barriers.</Text></View>
    <View style={styles.metrics}><MetricCard label="Active rides" value={active.length} hint="Scheduled or in progress" /><MetricCard label="Completed" value={completed} hint="Ride history" /></View>
    <Text style={styles.sectionTitle}>Quick actions</Text>
    <View style={styles.actionGrid}><TouchableOpacity style={styles.action} onPress={() => navigation.navigate('RequestRide')}><Text style={styles.actionIcon}>＋</Text><Text style={styles.actionTitle}>Request a ride</Text><Text style={styles.actionText}>Set up transportation for an appointment.</Text></TouchableOpacity><TouchableOpacity style={styles.action} onPress={() => navigation.navigate('Tracking')}><Text style={styles.actionIcon}>⌖</Text><Text style={styles.actionTitle}>Track my ride</Text><Text style={styles.actionText}>See the latest status and care-team handoff.</Text></TouchableOpacity></View>
    <Text style={styles.sectionTitle}>Next ride</Text>
    {next ? <RideCard ride={next} actionLabel="View live status" onPress={() => navigation.navigate('Tracking', { rideId: next.id })} /> : <View style={styles.empty}><Text style={styles.emptyTitle}>No active ride yet</Text><Text style={styles.emptyText}>When you request a ride, your upcoming transportation will appear here.</Text></View>}
    <Button title="View all rides" variant="secondary" onPress={() => navigation.navigate('MyRides')} />
    <View style={{ height: spacing.sm }} /><Button title="Log out" variant="secondary" onPress={async () => { try { await logout(); } catch { Alert.alert('Logout', 'Could not logout'); } }} />
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.purple, borderRadius: 22, padding: spacing.xl, marginBottom: spacing.lg }, eyebrow: { color: '#EDE9FE', fontSize: 11, letterSpacing: 1.5, fontWeight: '900' }, h1: { color: '#FFF', fontSize: 30, fontWeight: '900', marginTop: spacing.sm }, heroText: { color: '#F3F0FA', fontSize: 15, lineHeight: 23, marginTop: spacing.sm }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, sectionTitle: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: spacing.xl, marginBottom: spacing.md }, actionGrid: { flexDirection: 'row', gap: spacing.sm }, action: { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg }, actionIcon: { color: colors.pink, fontSize: 24, fontWeight: '900' }, actionTitle: { color: colors.text, fontWeight: '900', marginTop: spacing.sm }, actionText: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 }, empty: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.xl, marginBottom: spacing.md }, emptyTitle: { color: colors.text, fontWeight: '900', fontSize: 17 }, emptyText: { color: colors.muted, lineHeight: 20, marginTop: 5 },
});
