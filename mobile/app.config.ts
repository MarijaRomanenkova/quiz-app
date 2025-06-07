import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mobile-quiz-app",
  slug: "mobile-quiz-app",
  version: "1.0.0",
  orientation: "portrait",
  userInterfaceStyle: "light",
  splash: {
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    package: "com.marijar.reactnativeboilerplate",
    adaptiveIcon: {
      backgroundColor: "#ffffff",
    },
  },
  developmentClient: {
    silentLaunch: true
  },
  plugins: ["expo-dev-client"],
  web: {
    bundler: 'webpack'
  },
});
