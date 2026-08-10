import React from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, spacing } from '@/theme';

/**
 * Cross-platform "easy" datetime input:
 * - Web: uses <input type="datetime-local"> for a real picker.
 * - iOS/Android (Expo Go): falls back to a plain TextInput (ISO-ish).
 *
 * Value format: "YYYY-MM-DDTHH:mm" (no seconds, no timezone)
 */
export default function DateTimeField(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  helperText?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder="2026-08-08T14:30"
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        style={styles.input}
        // RN-web will pass these through to the DOM <input>
        {...(Platform.OS === 'web'
          ? ({ type: 'datetime-local', inputMode: 'numeric' } as any)
          : ({ keyboardType: 'default' } as any))}
      />
      {props.helperText ? <Text style={styles.helper}>{props.helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.md },
  label: {
    color: colors.muted,
    marginBottom: spacing.xs,
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.inputBg,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  helper: { color: colors.muted, marginTop: spacing.xs, fontSize: 12 },
});
