import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

export default function Button(props: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'purple' | 'pink';
  style?: ViewStyle;
}) {
  const { title, onPress, disabled, loading, variant = 'primary', style } = props;

  const palette =
    variant === 'danger'
      ? { bg: colors.danger, fg: '#FFFFFF', border: colors.danger }
      : variant === 'secondary'
      ? { bg: '#FFFFFF', fg: colors.text, border: colors.border }
      : variant === 'purple'
      ? { bg: colors.purple, fg: '#FFFFFF', border: colors.purple }
      : variant === 'pink'
      ? { bg: colors.pink, fg: '#FFFFFF', border: colors.pink }
      : { bg: colors.primary, fg: '#FFFFFF', border: colors.primary };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text style={[styles.text, { color: palette.fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
  },
});
