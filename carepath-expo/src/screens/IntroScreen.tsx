import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { colors, spacing, typography } from "../theme";
import { AuthStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<AuthStackParamList, "Intro">;

export function IntroScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <Screen scroll={false}>
      <View style={styles.content}>
        <Text style={styles.title}>CarePath</Text>
        <Text style={styles.subtitle}>
          Reliable, coordinated rides to medical appointments — for patients, drivers, and care
          coordinators.
        </Text>
      </View>
      <View style={styles.actions}>
        <Button label="Log In" onPress={() => navigation.navigate("Login")} />
        <Button
          label="Create Account"
          variant="secondary"
          onPress={() => navigation.navigate("Register")}
          style={styles.spacedButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    ...typography.heading,
    fontSize: 36,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  actions: {
    paddingBottom: spacing.lg,
  },
  spacedButton: {
    marginTop: spacing.sm,
  },
});
