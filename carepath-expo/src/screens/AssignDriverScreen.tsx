import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRoute } from '@react-navigation/native';

import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { assignDriverToRideApi, getDriversApi } from '@/api/rides';

type DriverLite = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
};;

const asArray = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.drivers)) return data.drivers;
  return [];
};

const fullName = (d: DriverLite) => {
  // First try the format returned directly by the API
  const directName = `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim();

  if (directName) {
    return directName;
  }

  const userName = `${d.user?.firstName ?? ''} ${d.user?.lastName ?? ''}`.trim();

  if (userName) {
    return userName;
  }

  return d.email || d.user?.email || 'Unknown Driver';
};

export default function AssignDriverScreen() {
  const route = useRoute();

const params = route.params as { rideId?: string } | undefined;
const rideId = params?.rideId;

  const [drivers, setDrivers] = useState<DriverLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [primaryDriverId, setPrimaryDriverId] = useState<string | null>(null);
  const [fallbackIds, setFallbackIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getDriversApi();
      setDrivers(asArray(data) as DriverLite[]);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        'Could not load drivers';

      Alert.alert('Drivers', String(msg));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const canSave = useMemo(
    () => Boolean(rideId && primaryDriverId),
    [rideId, primaryDriverId]
  );

  const toggleFallback = (driverId: string) => {
    setFallbackIds((prev) => {
      if (prev.includes(driverId)) {
        return prev.filter((x) => x !== driverId);
      }

      return [...prev, driverId];
    });
  };

  const onAssign = async () => {
    if (!canSave || !rideId || !primaryDriverId) return;

    try {
      setSaving(true);

      await assignDriverToRideApi(rideId, {
        // Keep the database ID for the assignment.
        driverId: primaryDriverId,

        fallbackDriverIds: fallbackIds.filter(
          (id) => id !== primaryDriverId
        ),
      });

      Alert.alert('Assigned', 'Driver assignment saved.');
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.message ||
        'Assign failed';

      Alert.alert('Assign failed', String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.h1}>Assign Driver</Text>

      <Text style={styles.sub}>
        Ride: {rideId ?? 'unknown'}
      </Text>

      <View style={{ height: spacing.lg }} />

      {loading ? (
        <Text style={styles.muted}>Loading drivers…</Text>
      ) : null}

      {!loading && drivers.length === 0 ? (
        <Text style={styles.muted}>
          No drivers available.
        </Text>
      ) : null}

      {drivers.map((d) => {
        const isPrimary = primaryDriverId === d.id;
        const isFallback = fallbackIds.includes(d.id);

        return (
          <View key={d.id} style={styles.card}>
            {/* Show driver's actual name, NOT database ID */}
            <Text style={styles.cardTitle}>
              {fullName(d)}
            </Text>

            {(d.email || d.user?.email) ? (
              <Text style={styles.cardLine}>{d.email || d.user?.email}</Text>
            ) : null}

            {(d.phone || d.user?.phone) ? (
              <Text style={styles.cardLine}>{d.phone || d.user?.phone}</Text>
            ) : null}

            <View style={{ height: spacing.sm }} />

            <View style={styles.row}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setPrimaryDriverId(d.id);

                  // A primary driver cannot also be fallback.
                  setFallbackIds((prev) =>
                    prev.filter((x) => x !== d.id)
                  );
                }}
                style={[
                  styles.pill,
                  isPrimary ? styles.pillOn : styles.pillOff,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isPrimary
                      ? styles.pillTextOn
                      : styles.pillTextOff,
                  ]}
                >
                  Primary
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  if (primaryDriverId === d.id) {
                    Alert.alert(
                      'Fallback',
                      'Primary driver cannot also be fallback.'
                    );
                    return;
                  }

                  toggleFallback(d.id);
                }}
                style={[
                  styles.pill,
                  isFallback ? styles.pillOn : styles.pillOff,
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    isFallback
                      ? styles.pillTextOn
                      : styles.pillTextOff,
                  ]}
                >
                  Fallback
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      <View style={{ height: spacing.lg }} />

      <Button
        title="Save assignment"
        onPress={onAssign}
        loading={saving}
        disabled={!canSave}
      />

      <View style={{ height: spacing.md }} />

      <Button
        title="Reload drivers"
        variant="secondary"
        onPress={load}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  h1: {
    color: colors.text,
    fontSize: typography.h2,
    fontWeight: '800',
  },

  sub: {
    color: colors.muted,
    marginTop: spacing.xs,
  },

  muted: {
    color: colors.muted,
  },

  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    borderRadius: 14,
    marginBottom: spacing.md,
  },

  cardTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
  },

  cardLine: {
    color: colors.muted,
    marginTop: spacing.xs,
  },

  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },

  pillOn: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },

  pillOff: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
  },

  pillText: {
    fontWeight: '800',
  },

  pillTextOn: {
    color: colors.bg,
  },

  pillTextOff: {
    color: colors.text,
  },
});
