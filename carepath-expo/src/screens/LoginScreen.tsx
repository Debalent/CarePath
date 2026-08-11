import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      await login({ email: email.trim().toLowerCase(), password });
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Login failed';
      Alert.alert('Login failed', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll contentStyle={styles.page}>
      <View style={styles.panel}>
        <Image source={require('../../assets/carepath-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to manage rides and transportation services.</Text>

        <View style={styles.form}>
          <TextField label="Email address" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" />
          <TextField label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry autoCapitalize="none" />
          <Button title="Sign In" variant="pink" onPress={onSubmit} loading={loading} disabled={!email || !password} />
          <View style={{ height: spacing.md }} />
          <Button title="Register here" variant="secondary" onPress={() => navigation.navigate('Register')} />
        </View>

        <Text style={styles.footer}>You’ll be sent to the correct dashboard for your role.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { justifyContent: 'center', backgroundColor: '#F2EAF5' },
  panel: {
    width: '100%', maxWidth: 720, alignSelf: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: spacing.xl,
    shadowColor: '#450466', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 4,
  },
  logo: { width: 116, height: 116, alignSelf: 'center', marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#766D7C', fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: spacing.sm },
  form: { marginTop: spacing.xl },
  footer: { color: colors.subtle, fontSize: 13, textAlign: 'center', marginTop: spacing.lg },
});
