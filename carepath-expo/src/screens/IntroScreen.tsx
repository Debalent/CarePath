import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import Button from '@/components/Button';
import { colors, spacing } from '@/theme';
import { useAuth } from '@/auth/AuthContext';

export default function IntroScreen() {
  const navigation = useNavigation<any>();
  const { bootstrapping, token } = useAuth();
  const [pressed, setPressed] = useState(false);
  const canContinue = useMemo(() => !bootstrapping, [bootstrapping]);

  const onGetStarted = () => {
    setPressed(true);
    if (token) navigation.navigate('App');
    else navigation.navigate('Auth');
  };

  return (
    <Screen contentStyle={styles.page}>
      <View style={styles.heroCard}>
        <Image source={require('../../assets/carepath-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.kicker}>CONNECT • COORDINATE • CARE</Text>
        <Text style={styles.title}>Reliable rides. Better access to care.</Text>
        <Text style={styles.subtitle}>CarePath connects patients, coordinators, and drivers so transportation doesn’t become the reason someone misses care.</Text>

        <View style={styles.steps}>
          <Text style={styles.step}><Text style={styles.stepNum}>1</Text>  Request a medical ride</Text>
          <Text style={styles.step}><Text style={styles.stepNum}>2</Text>  Coordinator matches a driver</Text>
          <Text style={styles.step}><Text style={styles.stepNum}>3</Text>  Track the ride through completion</Text>
        </View>

        {bootstrapping ? (
          <View style={styles.loadingRow}><ActivityIndicator color={colors.purple} /><Text style={styles.loadingText}>Checking your session…</Text></View>
        ) : null}

        <Button title={pressed ? 'Opening…' : 'Get started'} variant="purple" onPress={onGetStarted} disabled={!canContinue} style={{ marginTop: spacing.lg }} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { justifyContent: 'center', backgroundColor: '#EEE7F4' },
  heroCard: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: spacing.xl, borderWidth: 1, borderColor: colors.border, maxWidth: 720, width: '100%', alignSelf: 'center' },
  logo: { width: 170, height: 170, alignSelf: 'center' },
  kicker: { color: colors.purple, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center', fontSize: 12 },
  title: { color: colors.text, fontSize: 30, lineHeight: 38, fontWeight: '900', textAlign: 'center', marginTop: spacing.md },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: spacing.md },
  steps: { backgroundColor: colors.purpleLight, borderRadius: 16, padding: spacing.lg, marginTop: spacing.xl },
  step: { color: '#374151', fontSize: 15, marginBottom: spacing.sm, fontWeight: '600' },
  stepNum: { color: colors.purple, fontWeight: '900' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg },
  loadingText: { color: colors.muted, marginLeft: spacing.sm },
});
