import React, { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Screen from '@/components/Screen';
import Button from '@/components/Button';
import StatusBadge from '@/components/StatusBadge';
import { getCurrentTrackingApi, getRideTrackingApi } from '@/api/rides';
import { colors, spacing, typography } from '@/theme';

export default function TrackingScreen() {
  const route = useRoute();
  const params = route.params as { rideId?: string } | undefined;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const result = params?.rideId ? await getRideTrackingApi(params.rideId) : await getCurrentTrackingApi();
      setData(result);
    } catch (e: any) {
      Alert.alert('Ride tracking', String(e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Could not load tracking'));
    } finally { setLoading(false); }
  }, [params?.rideId]);

  useEffect(() => { load(); }, [load]);

  const refresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  return <Screen scroll refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
    <View style={styles.hero}>
      <Text style={styles.kicker}>LIVE RIDE STATUS</Text>
      <Text style={styles.h1}>{data?.title || 'Ride tracking'}</Text>
      <Text style={styles.sub}>{data?.subtitle || 'Follow the current transportation handoff.'}</Text>
      <View style={styles.heroRow}><StatusBadge status={data?.status} /><Text style={styles.eta}>{data?.etaMinutes ? `${data.etaMinutes} min ETA` : 'Awaiting movement'}</Text></View>
    </View>

    {loading ? <Text style={styles.muted}>Loading tracking…</Text> : null}
    {!loading ? <>
      <View style={styles.card}><Text style={styles.cardLabel}>Current location</Text><Text style={styles.cardValue}>{data?.locationLabel || 'No active location yet'}</Text><Text style={styles.cardMeta}>{data?.visibilityLabel}</Text></View>
      <Text style={styles.section}>Ride timeline</Text>
      {(data?.timeline || []).map((item: any, index: number) => <View key={`${item.label}-${index}`} style={styles.timelineRow}><View style={[styles.dot, item.active && styles.dotActive]} /><View style={styles.timelineCopy}><Text style={styles.timelineTitle}>{item.label}</Text><Text style={styles.timelineDetail}>{item.detail}</Text></View></View>)}
      {Array.isArray(data?.participants) && data.participants.length ? <><Text style={styles.section}>People connected to this ride</Text>{data.participants.map((p: any, i: number) => <View key={`${p.name}-${i}`} style={styles.person}><View><Text style={styles.personName}>{p.name}</Text><Text style={styles.personRole}>{p.role}</Text></View><Text style={styles.access}>{p.access}</Text></View>)}</> : null}
    </> : null}
    <View style={{ height: spacing.lg }} /><Button title="Refresh tracking" variant="secondary" onPress={load} />
  </Screen>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.navy, borderRadius: 20, padding: spacing.xl, marginBottom: spacing.lg }, kicker: { color: '#BAE6FD', fontWeight: '900', fontSize: 11, letterSpacing: 1.4 }, h1: { color: '#FFF', fontSize: typography.h2, fontWeight: '900', marginTop: 8 }, sub: { color: '#CBD5E1', lineHeight: 21, marginTop: 7 }, heroRow: { marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, eta: { color: '#FFF', fontWeight: '900' },
  card: { backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: spacing.lg }, cardLabel: { color: colors.muted, fontWeight: '800', fontSize: 12 }, cardValue: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 5 }, cardMeta: { color: colors.muted, marginTop: 5, lineHeight: 20 }, section: { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.xl, marginBottom: spacing.md },
  timelineRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg }, dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#CBD5E1', marginTop: 4 }, dotActive: { backgroundColor: colors.primary }, timelineCopy: { flex: 1 }, timelineTitle: { color: colors.text, fontWeight: '900' }, timelineDetail: { color: colors.muted, marginTop: 3, lineHeight: 20 },
  person: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: colors.border, padding: spacing.md, borderRadius: 14, marginBottom: spacing.sm }, personName: { color: colors.text, fontWeight: '900' }, personRole: { color: colors.muted, marginTop: 2 }, access: { color: colors.purple, fontWeight: '800', fontSize: 12 }, muted: { color: colors.muted },
});
