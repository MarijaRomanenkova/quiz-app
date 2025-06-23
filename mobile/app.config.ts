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
  plugins: [
    "expo-dev-client",
    [
      "expo-font",
      {
        fonts: [
          "assets/fonts/Baloo2-Regular.ttf",
          "assets/fonts/Baloo2-Medium.ttf",
          "assets/fonts/Baloo2-SemiBold.ttf",
          "assets/fonts/Baloo2-Bold.ttf",
          "assets/fonts/Baloo2-ExtraBold.ttf",
          "assets/fonts/BalooBhaina2-Regular.ttf",
          "assets/fonts/BalooBhaina2-Medium.ttf",
          "assets/fonts/BalooBhaina2-SemiBold.ttf",
          "assets/fonts/BalooBhaina2-Bold.ttf",
          "assets/fonts/BalooBhaina2-ExtraBold.ttf"
        ]
      }
    ]
  ],
  web: {
    bundler: 'webpack'
  },
});
