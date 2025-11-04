import { useColorScheme } from "@/hooks/use-color-scheme";
import { container } from "@/src/di/container";
import { useAuth } from "@/src/presentation/hooks/useAuth"; // ← NUEVO
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-BoldItalic.ttf"),
  });
  const [containerReady, setContainerReady] = useState(false);
  const { user, loading: authLoading } = useAuth(); // ← NUEVO
  const segments = useSegments(); // ← NUEVO
  const router = useRouter(); // ← NUEVO
  useEffect(() => {
    const initContainer = async () => {
      try {
        await container.initialize();
        setContainerReady(true);
      } catch (error) {
        console.error("Error initializing container:", error);
      }
    };
    initContainer();
  }, []);
  // ← NUEVO: Protección de rutas
  useEffect(() => {
    if (!containerReady || authLoading) return;
    // safer runtime check to avoid strict union type mismatch from generated segments types
    const inAuthGroup =
      segments[0] === "(tabs)" &&
      segments.length > 1 &&
      ["login", "register", "forgot-password"].includes(segments[1] as string);
    if (!user && !inAuthGroup) {
      // Usuario no autenticado intenta acceder a ruta protegida
      router.replace({ pathname: "/(tabs)/login" } as any);
    } else if (user && inAuthGroup) {
      // Usuario autenticado intenta acceder a login/register
      router.replace({ pathname: "/(tabs)/todos" } as any);
    }
  }, [user, segments, containerReady, authLoading]);
  useEffect(() => {
    if (loaded && containerReady && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, containerReady, authLoading]);
  if (!loaded || !containerReady || authLoading) {
    return (
      <View style={{
        flex: 1, justifyContent: "center", alignItems:
          "center"
      }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme :
      DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)/login" />
        <Stack.Screen name="(tabs)/register" />
        <Stack.Screen name="(tabs)/forgot-password" />
        <Stack.Screen name="(tabs)/todos" />
        <Stack.Screen name="(tabs)/profile" />
      </Stack>
    </ThemeProvider>
  );
}