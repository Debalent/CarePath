import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '@/components/Screen';
import TextField from '@/components/TextField';
import DateTimeField from '@/components/DateTimeField';
import Button from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { createRideRequestApi } from '@/api/rides';
import { useAuth } from '@/auth/AuthContext';

const pad2 = (n: number) => String(n).padStart(2, '0');

const toLocalDateTimeInputValue = (d: Date) =>
  `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

const defaultAppointmentTime = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(10, 0, 0, 0);
  return toLocalDateTimeInputValue(d);
};

const defaultPickupTime = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  d.setHours(9, 0, 0, 0);
  return toLocalDateTimeInputValue(d);
};

const toIsoFromLocalInput = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error('Please choose a valid date and time.');
  return d.toISOString();
};

type AppointmentType =
  | 'ONCOLOGY'
  | 'CARDIOLOGY'
  | 'NEUROLOGY'
  | 'DIALYSIS'
  | 'MENTAL_HEALTH'
  | 'POST_SURGICAL'
  | 'SPECIALIST'
  | 'OTHER';

const APPOINTMENT_TYPES: Array<{ value: AppointmentType; label: string }> = [
  { value: 'SPECIALIST', label: 'Specialist' },
  { value: 'CARDIOLOGY', label: 'Cardiology' },
  { value: 'ONCOLOGY', label: 'Oncology' },
  { value: 'DIALYSIS', label: 'Dialysis' },
  { value: 'NEUROLOGY', label: 'Neurology' },
  { value: 'MENTAL_HEALTH', label: 'Mental health' },
  { value: 'POST_SURGICAL', label: 'Post-surgical' },
  { value: 'OTHER', label: 'Other' },
];

export default function RequestRideScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [appointmentType, setAppointmentType] = useState<AppointmentType>('SPECIALIST');
  const [clinicName, setClinicName] = useState('Care Clinic');
  const [clinicCity, setClinicCity] = useState('Tulsa');
  const [clinicState, setClinicState] = useState('OK');
  const [appointmentDateLocal, setAppointmentDateLocal] = useState(defaultAppointmentTime);
  const [estimatedMiles, setEstimatedMiles] = useState('10');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupTimeLocal, setPickupTimeLocal] = useState(defaultPickupTime);
  const [appointmentNotes, setAppointmentNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formMessageType, setFormMessageType] = useState<'error' | 'success'>('error');

  const showMessage = (title: string, message: string, type: 'error' | 'success' = 'error') => {
    setFormMessageType(type);
    setFormMessage(message);

    // Alert.alert can be inconsistent on web, so the inline message is always shown.
    if (Platform.OS !== 'web') {
      Alert.alert(title, message);
    }
  };

  const validateForm = (): string | null => {
    if (user?.role !== 'PATIENT') return 'Only patient accounts can request rides.';
    if (!clinicName.trim()) return 'Please enter the clinic name.';
    if (!clinicCity.trim()) return 'Please enter the clinic city.';
    if (clinicState.trim().length !== 2) return 'Please enter a 2-letter clinic state, such as OK.';
    if (!pickupAddress.trim()) return 'Please enter the pickup address.';

    const miles = Number(estimatedMiles);
    if (!Number.isInteger(miles) || miles <= 0) {
      return 'Estimated miles must be a whole number greater than 0.';
    }

    try {
      const appointmentDate = toIsoFromLocalInput(appointmentDateLocal);
      const pickupTime = toIsoFromLocalInput(pickupTimeLocal);

      if (new Date(pickupTime).getTime() >= new Date(appointmentDate).getTime()) {
        return 'Pickup time must be before the appointment time.';
      }

      if (new Date(pickupTime).getTime() <= Date.now()) {
        return 'Pickup time must be in the future.';
      }
    } catch (error) {
      return error instanceof Error ? error.message : 'Please choose a valid date and time.';
    }

    return null;
  };

  const onSubmit = async () => {
    if (loading) return;

    setFormMessage(null);

    const validationError = validateForm();
    if (validationError) {
      showMessage('Check your request', validationError, 'error');
      return;
    }

    try {
      setLoading(true);

      const miles = Number(estimatedMiles);
      const appointmentDate = toIsoFromLocalInput(appointmentDateLocal);
      const pickupTime = toIsoFromLocalInput(pickupTimeLocal);

      const body = {
        appointmentType,
        clinicName: clinicName.trim(),
        clinicCity: clinicCity.trim(),
        clinicState: clinicState.trim().toUpperCase(),
        appointmentDate,
        estimatedMiles: miles,
        isRecurring: false,
        recurrenceNote: null,
        appointmentNotes: appointmentNotes.trim() || null,
        pickupAddress: pickupAddress.trim(),
        pickupTime,
        creditId: null,
        urgencyLevel: 'NORMAL' as const,
        needsSameDayFallback: false,
        allowsCommunityVolunteer: false,
        requestedAdvanceWindowHours: null,
      };

      if (__DEV__) {
        console.log('Submitting ride request:', body);
      }

      const created = await createRideRequestApi(body);
      const successMessage = created?.id
        ? 'Your ride request was created successfully.'
        : 'Your request was sent successfully.';

      showMessage('Ride request submitted', successMessage, 'success');

      // Send the patient directly to their ride list after a successful request.
      setTimeout(() => {
        navigation.navigate('MyRides');
      }, 350);
    } catch (e: any) {
      const status = e?.response?.status;
      const backendMessage =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        e?.response?.data?.details ||
        e?.message;

      const message = backendMessage
        ? `${backendMessage}${status ? ` (HTTP ${status})` : ''}`
        : `Request failed${status ? ` (HTTP ${status})` : ''}.`;

      if (__DEV__) {
        console.error('Ride request failed:', {
          status,
          data: e?.response?.data,
          message: e?.message,
        });
      }

      showMessage('Request failed', String(message), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Request a ride</Text>
      <Text style={styles.subtitle}>Tell us where you need to go and when. We’ll handle the transportation matching.</Text>

      <View style={{ height: spacing.lg }} />

      <Text style={styles.sectionLabel}>Appointment type</Text>
      <View style={styles.typeGrid}>
        {APPOINTMENT_TYPES.map((type) => {
          const active = type.value === appointmentType;
          return (
            <TouchableOpacity
              key={type.value}
              style={[styles.typeChip, active && styles.typeChipActive]}
              onPress={() => setAppointmentType(type.value)}
            >
              <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>{type.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: spacing.md }} />
      <TextField label="Clinic name" value={clinicName} onChangeText={setClinicName} />
      <TextField label="Clinic city" value={clinicCity} onChangeText={setClinicCity} />
      <TextField
        label="Clinic state (2 letters)"
        value={clinicState}
        onChangeText={(value) => setClinicState(value.slice(0, 2).toUpperCase())}
        autoCapitalize="characters"
      />

      <DateTimeField
        label="Appointment date & time"
        value={appointmentDateLocal}
        onChangeText={setAppointmentDateLocal}
        helperText="Use the arrows or quick-date buttons, then tap the appointment time."
      />

      <TextField
        label="Estimated one-way miles"
        value={estimatedMiles}
        onChangeText={setEstimatedMiles}
        keyboardType="numeric"
      />

      <TextField
        label="Pickup address"
        value={pickupAddress}
        onChangeText={setPickupAddress}
        placeholder="Street address, city, state"
      />

      <DateTimeField
        label="Pickup date & time"
        value={pickupTimeLocal}
        onChangeText={setPickupTimeLocal}
        helperText="Choose a pickup time before the appointment."
      />

      <TextField label="Notes (optional)" value={appointmentNotes} onChangeText={setAppointmentNotes} />

      {formMessage ? (
        <View style={[styles.messageCard, formMessageType === 'success' ? styles.successCard : styles.errorCard]}>
          <Text style={[styles.messageTitle, formMessageType === 'success' ? styles.successText : styles.errorText]}>
            {formMessageType === 'success' ? 'Request submitted' : 'Please check your request'}
          </Text>
          <Text style={styles.messageText}>{formMessage}</Text>
        </View>
      ) : null}

      <View style={{ height: spacing.md }} />
      <Button
        title={loading ? 'Submitting request…' : 'Submit ride request'}
        onPress={onSubmit}
        loading={loading}
        variant="pink"
      />

      <View style={{ height: spacing.lg }} />
      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>Before submitting</Text>
        <Text style={styles.tipText}>Your CarePath patient intake/profile must be completed so the API knows your county, state, and transportation preferences.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: typography.h2, fontWeight: '800' },
  subtitle: { color: colors.muted, marginTop: spacing.xs, lineHeight: 20 },
  sectionLabel: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  typeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeChipText: { color: colors.text, fontWeight: '700', fontSize: 12 },
  typeChipTextActive: { color: '#fff' },
  messageCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  errorCard: { backgroundColor: '#FEF2F2', borderColor: '#FECACA' },
  successCard: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  messageTitle: { fontWeight: '800', marginBottom: 4 },
  errorText: { color: '#B91C1C' },
  successText: { color: '#047857' },
  messageText: { color: colors.text, lineHeight: 20 },
  tipCard: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 14,
  },
  tipTitle: { color: colors.text, fontWeight: '800' },
  tipText: { color: colors.muted, marginTop: spacing.xs, lineHeight: 20 },
});
