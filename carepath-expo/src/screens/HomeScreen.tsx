import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screen } from "../components/Screen";
import { Button } from "../components/Button";
import { useAuth } from "../auth/AuthContext";
import { colors, spacing, typography } from "../theme";
import { AppStackParamList } from "../navigation/types";

type Nav = NativeStackNavigationProp<AppStackParamList, "Home">;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user, logout } = useAuth();

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi{user?.email ? `, ${user.email}` : ""}</Text>
        <Text style={styles.subtitle}>What would you like to do?</Text>
      </View>
      <View style={styles.actions}>
        <Button label="Request a Ride" onPress={() => navigation.navigate("RequestRide")} />
        <Button label="Log Out" variant="secondary" onPress={logout} style={styles.spacedButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "center",
  },
  greeting: {
    ...typography.heading,
    color: colors.text,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  actions: {
    paddingBottom: spacing.lg,
  },
  spacedButton: {
    marginTop: spacing.sm,
  },
});
