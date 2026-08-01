import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "../types/api";

const TOKEN_KEY = "carepath.auth.token";
const USER_KEY = "carepath.auth.user";

export async function saveSession(token: string, user: AuthUser): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function loadSession(): Promise<{ token: string; user: AuthUser } | null> {
  const [[, token], [, userJson]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  if (!token || !userJson) return null;
  return { token, user: JSON.parse(userJson) as AuthUser };
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}
