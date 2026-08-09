import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { getPendingRidesApi } from '@/api/rides';
import { useAuth } from '@/auth/AuthContext';

type RideLite = {
  id: string;
  status?: string;
  pickupTime?: string;
  pickupAddress?: string;
  clinicName?: string;
  clinicCity?: string;
  clinicState?: string;
  patientName?: string;
};

const asArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.rides)) return data.rides;
  return [];
};

export default function CoordinatorRequestsScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const [rides, setRides] = useState<RideLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const count = useMemo(() => rides.length, [rides]);

  const load = useCallback(async () => {
    try {
      const data = await getPendingRidesApi();
      setRides(asArray(data) as RideLite[]);
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Could not load requests';
      Alert.alert('Ride requests', String(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <Screen
      scroll
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.text} />}
    >
      <Text style={styles.h1}>Pending rides</Text>
      <Text style={styles.sub}>{count} ride(s) pending assignment.</Text>

      <View style={{ height: spacing.lg }} />

      {loading ? <Text style={styles.muted}>Loading…</Text> : null}

      {!loading && rides.length === 0 ? (
        <Text style={styles.muted}>No unassigned requests found.</Text>
      ) : (
        rides.map((r) => (
          <TouchableOpacity
            key={r.id}
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => navigation.navigate('AssignDriver', { rideId: r.id })}
          >
            <Text style={styles.cardTitle}>{r.clinicName ?? 'Ride request'}</Text>
            <Text style={styles.cardLine}>Status: {r.status ?? 'requested'}</Text>
            <Text style={styles.cardLine}>Pickup: {r.pickupAddress ?? '—'}</Text>
            <Text style={styles.cardLine}>When: {r.pickupTime ?? '—'}</Text>
            <Text style={styles.cardLine}>
              Clinic: {(r.clinicCity ?? '').trim()} {(r.clinicState ?? '').trim()}
            </Text>
            {r.patientName ? <Text style={styles.cardLine}>Patient: {r.patientName}</Text> : null}

            <View style={{ height: spacing.sm }} />
            <Text style={styles.link}>Assign driver →</Text>
          </TouchableOpacity>
        ))
      )}

      <View style={{ height: spacing.lg }} />
      <Button title="Refresh" variant="secondary" onPress={load} />
       <Button
              title="Logout"
              variant="secondary"
              onPress={async () => {
                try {
                  await logout();
                } catch {
                  Alert.alert('Logout', 'Could not logout');
                }
              }}
            />
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: { color: colors.text, fontSize: typography.h2, fontWeight: '800' },
  sub: { color: colors.muted, marginTop: spacing.xs },
  muted: { color: colors.muted },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
  },
  cardTitle: { color: colors.text, fontWeight: '800', fontSize: 16 },
  cardLine: { color: colors.muted, marginTop: spacing.xs, lineHeight: 20 },
  link: { color: colors.text, fontWeight: '800' },
});
