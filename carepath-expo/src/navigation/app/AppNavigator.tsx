import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../../screens/HomeScreen";
import { RequestRideScreen } from "../../screens/RequestRideScreen";
import { AppStackParamList } from "../types";

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RequestRide" component={RequestRideScreen} options={{ headerShown: true, title: "Request a Ride" }} />
    </Stack.Navigator>
  );
}
