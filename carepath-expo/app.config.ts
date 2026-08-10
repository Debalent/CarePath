const API_URL = 'http://localhost:3001';

export default ({ config }: any) => ({
  ...config,
  name: 'CarePath',
  slug: 'carepath',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',

  plugins: ['expo-secure-store'],

  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0B1020',
  },

  extra: {
    apiUrl: API_URL,
  },
});