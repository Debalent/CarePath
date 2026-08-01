# CarePath Mobile (Expo)

A React Native companion app for CarePath, built with Expo. It mirrors the core
patient flows from the web app (`carepath-ui/`): register, log in, and request a
ride to a medical appointment.

## Prerequisites

- Node.js 18+
- The CarePath backend running locally (see the repo root `README.md`), or a
  deployed API URL

## Setup

```bash
cd carepath-expo
npm install
```

## Configuring the API URL

By default the app talks to `http://localhost:3001/api` (or `http://10.0.2.2:3001/api`
on the Android emulator, since `localhost` inside the emulator refers to the
emulator itself, not your host machine).

To point at a deployed backend (e.g. staging or production), set
`EXPO_PUBLIC_CAREPATH_API_URL` before starting the app:

```bash
EXPO_PUBLIC_CAREPATH_API_URL="https://jz63ct11re.execute-api.us-east-1.amazonaws.com/api" npx expo start
```

## Running the app

```bash
npm run start    # opens the Expo dev tools / QR code
npm run android  # launches on a connected Android device or emulator
npm run ios      # launches on the iOS simulator (macOS only)
npm run web      # runs the app in a browser via react-native-web
```

## Project structure

```
src/
  api/          Fetch wrappers for the CarePath backend (auth, rides)
  auth/         Auth context + AsyncStorage-backed session persistence
  components/   Shared UI primitives (Button, Screen, TextField)
  navigation/   React Navigation stacks (auth vs. authenticated app)
  screens/      Intro, Login, Register, Home, Request Ride
  theme/        Colors, spacing, and typography tokens
  types/        Shared API request/response types
  utils/        Platform-aware API URL resolution
```

## Notes

- Authenticated requests use a Bearer token stored via
  `@react-native-async-storage/async-storage`, matching the JWT-based auth
  already used by `carepath-ui`.
- The `.expo/` directory (local Expo CLI cache) and `node_modules/` are
  git-ignored and generated automatically when you run `npm install` /
  `npx expo start`.
