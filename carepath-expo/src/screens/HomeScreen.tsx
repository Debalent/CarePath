import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  // Auto-route by role so each role lands on the right screen.
  useEffect(() => {
    const role = user?.role;
    if (!role) return;

    if (role === 'DRIVER') navigation.replace('DriverRides');
    else if (role === 'COORDINATOR' || role === 'ADMIN') navigation.replace('CoordinatorRequests');
    // PATIENT stays on Home.
  }, [navigation, user?.role]);

  return (
    <Screen>
      <Text style={styles.h1}>Hi{user?.firstName ? `, ${user.firstName}` : ''}</Text>
      <Text style={styles.p}>You are logged in as: {user?.email ?? 'unknown'}</Text>
      <Text style={styles.p}>Role: {user?.role ?? 'unknown'}</Text>

      <View style={{ height: spacing.xl }} />

      {user?.role === 'PATIENT' ? (
        <>
          <Button title="Request a ride" onPress={() => navigation.navigate('RequestRide')} />
          <View style={{ height: spacing.md }} />
          <Button title="My upcoming rides" variant="secondary" onPress={() => navigation.navigate('MyRides')} />
        </>
      ) : null}

      {(user?.role === 'COORDINATOR' || user?.role === 'ADMIN') ? (
        <>
          <Button title="Ride requests" onPress={() => navigation.navigate('CoordinatorRequests')} />
        </>
      ) : null}

      {user?.role === 'DRIVER' ? (
        <>
          <Button title="My assigned rides" onPress={() => navigation.navigate('DriverRides')} />
        </>
      ) : null}

      <View style={{ height: spacing.xl }} />

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
  h1: { color: colors.text, fontSize: typography.h1, fontWeight: '800' },
  p: { color: colors.muted, marginTop: spacing.sm, fontSize: 15 },
});
