import Constants from "expo-constants";
import { Platform } from "react-native";

// Android emulators can't reach the host machine via localhost; 10.0.2.2 is the emulator's alias for it.
export function platformApiUrl(): string {
  const configured = Constants.expoConfig?.extra?.apiUrl as string | null | undefined;
  if (configured) return configured;

  return Platform.OS === "android" ? "http://10.0.2.2:3001/api" : "http://localhost:3001/api";
}
