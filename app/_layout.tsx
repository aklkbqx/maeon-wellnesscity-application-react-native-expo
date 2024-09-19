import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import FontLoader from '@/components/FontLoader';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  return (
    <FontLoader>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "slide_from_bottom", presentation: "modal" }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <Toast />
      </ThemeProvider>
    </FontLoader>
  );
}
