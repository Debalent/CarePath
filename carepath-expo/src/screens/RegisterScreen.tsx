import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import { useAuth } from '@/auth/AuthContext';
import { colors, spacing } from '@/theme';
import type { Role } from '@/types/api';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const role: Role = 'PATIENT';

  const onSubmit = async () => {
    if (password.length < 8) {
      Alert.alert('Password', 'Use at least 8 characters.');
      return;
    }
    try {
      setLoading(true);
      await register({
        firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim().toLowerCase(),
        phone: phone.trim(), password, role,
      });
    } catch (e: any) {
      const msg = e?.response?.data?.error || e?.response?.data?.message || e?.message || 'Registration failed';
      Alert.alert('Registration failed', String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll contentStyle={styles.page}>
      <View style={styles.panel}>
        <Image source={require('../../assets/carepath-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.eyebrow}>CAREPATH</Text>
        <Text style={styles.title}>Welcome to CarePath!</Text>
        <Text style={styles.subtitle}>We just need a few details to create your patient account.</Text>
        <View style={styles.form}>
          <TextField label="First name" value={firstName} onChangeText={setFirstName} autoCapitalize="words" />
          <TextField label="Last name" value={lastName} onChangeText={setLastName} autoCapitalize="words" />
          <TextField label="Phone number" value={phone} onChangeText={setPhone} placeholder="(555) 555-5555" keyboardType="phone-pad" />
          <TextField label="Email address" value={email} onChangeText={setEmail} placeholder="name@example.com" keyboardType="email-address" />
          <TextField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
          <Button title="Create Account" variant="pink" onPress={onSubmit} loading={loading} disabled={!firstName || !lastName || !email || !phone || !password} />
          <View style={{ height: spacing.md }} />
          <Button title="Already have an account? Sign in" variant="secondary" onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { justifyContent: 'center', backgroundColor: '#F2EAF5' },
  panel: { width: '100%', maxWidth: 720, alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1, borderColor: colors.border, padding: spacing.xl },
  logo: { width: 92, height: 92, alignSelf: 'center' },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginTop: spacing.sm },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', textAlign: 'center', marginTop: spacing.sm },
  subtitle: { color: '#A589B1', fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: spacing.sm },
  form: { marginTop: spacing.xl },
});
