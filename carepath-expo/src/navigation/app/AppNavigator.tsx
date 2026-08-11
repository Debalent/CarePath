import React, { useEffect } from 'react';
import { Alert, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuth } from '@/auth/AuthContext';
import HomeScreen from '@/screens/HomeScreen';
import RequestRideScreen from '@/screens/RequestRideScreen';
import MyRidesScreen from '@/screens/MyRidesScreen';
import DriverRidesScreen from '@/screens/DriverRidesScreen';
import CoordinatorRequestsScreen from '@/screens/CoordinatorRequestsScreen';
import AssignDriverScreen from '@/screens/AssignDriverScreen';
import TrackingScreen from '@/screens/TrackingScreen';
import { colors } from '@/theme';

const Stack = createNativeStackNavigator();

function RoleGate() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.role) Alert.alert('CarePath', 'Could not determine user role.');
  }, [user?.role]);

  // Render nothing; actual screens are still accessible via the navigator.
  // We keep Home as the default landing screen and let it route appropriately.
  return <View />;
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTintColor: colors.navy,
        headerShadowVisible: true,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      {/* Default landing routes by role */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'CarePath' }} />

      {/* PATIENT */}
      <Stack.Screen name="RequestRide" component={RequestRideScreen} options={{ title: 'Request a ride' }} />
      <Stack.Screen name="MyRides" component={MyRidesScreen} options={{ title: 'My rides' }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Ride tracking' }} />

      {/* DRIVER */}
      <Stack.Screen name="DriverRides" component={DriverRidesScreen} options={{ title: 'Assigned rides' }} />

      {/* COORDINATOR */}
      <Stack.Screen name="CoordinatorRequests" component={CoordinatorRequestsScreen} options={{ title: 'Ride requests' }} />
      <Stack.Screen name="AssignDriver" component={AssignDriverScreen} options={{ title: 'Assign driver' }} />

      {/* Hidden utility */}
      <Stack.Screen name="RoleGate" component={RoleGate} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
