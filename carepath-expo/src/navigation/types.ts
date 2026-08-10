export type RootStackParamList = {
  Intro: undefined;
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  // PATIENT
  Home: undefined;
  RequestRide: undefined;
  MyRides: undefined;

  // DRIVER
  DriverRides: undefined;

  // COORDINATOR
  CoordinatorRequests: undefined;
  AssignDriver: { rideId: string };
};
