import React from 'react';
import { RefreshControlProps, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';

export default function Screen(props: {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}) {
  if (props.scroll) {
    return (
      <SafeAreaView style={styles.root} edges={['bottom']}>
        <ScrollView
          style={styles.root}
          contentContainerStyle={[styles.scrollContent, props.contentStyle]}
          keyboardShouldPersistTaps="handled"
          refreshControl={props.refreshControl}
        >
          {props.children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <View style={[styles.content, props.contentStyle]}>{props.children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
});
