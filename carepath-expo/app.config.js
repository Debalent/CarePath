module.exports = ({ config }) => ({
  ...config,
  name: "CarePath",
  slug: "carepath-expo",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.carepath.mobile",
  },
  android: {
    package: "com.carepath.mobile",
  },
  extra: {
    // Overridden via EXPO_PUBLIC_CAREPATH_API_URL for staging/production builds.
    apiUrl: process.env.EXPO_PUBLIC_CAREPATH_API_URL ?? null,
  },
});
