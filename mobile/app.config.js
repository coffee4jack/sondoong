export default ({ config }) => ({
  ...config,
  plugins: ["expo-asset", "expo-status-bar", ...(config.plugins || [])],
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api",
  },
});
