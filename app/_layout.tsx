import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useNavigation } from 'expo-router';
import 'react-native-reanimated';
import FontLoader from '@/components/FontLoader';
import Toast from 'react-native-toast-message';
import { BackHandler, Platform } from 'react-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { InternetProvider } from '@/context/InternetProvider';

export default function RootLayout() {
  const navigation = useNavigation()

  useEffect(() => {
    const preventGoingBack = () => {
      return true
    }
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      const currentRoute = e.data.action.target?.split('-')[0]
      if (currentRoute === 'index' || currentRoute === 'selectdatatime') {
        e.preventDefault()
      }
    })

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', preventGoingBack)
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', preventGoingBack)
      }
      unsubscribe()
    }
  }, [navigation])

  return (
    <FontLoader>
      <ThemeProvider value={DefaultTheme}>
        <GestureHandlerRootView>
          <InternetProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="connection-error" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false, animation: "slide_from_bottom", presentation: "modal" }} />
              <Stack.Screen name="logout" options={{
                animation: "slide_from_bottom",
                headerShown: false,
                contentStyle: {
                  backgroundColor: "transparent",
                  backfaceVisibility: "hidden"
                },
                presentation: "containedTransparentModal"
              }} />
              <Stack.Screen name="(pages)" options={{ headerShown: false, gestureEnabled: false }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="error-page" options={{ headerShown: false }} />
            </Stack>
          </InternetProvider>
          <Toast />
        </GestureHandlerRootView>
      </ThemeProvider>
    </FontLoader>
  );
}
