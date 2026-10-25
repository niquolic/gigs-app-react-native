import "react-native-gesture-handler";
import "./global.css";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from "@expo-google-fonts/sora";
import { AuthProvider } from "@/context/AuthContext";
import RootNavigator from "@/navigation/RootNavigator";
import "@/utils/nativewind-interop";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Sora_500Medium,
    Sora_600SemiBold,
    Sora_700Bold,
  });

  // Filet de sécurité : si les polices ne répondent pas (erreur ou blocage),
  // on affiche quand même l'app avec la police système au bout de 4 s plutôt
  // que de rester indéfiniment sur l'écran de chargement.
  const [fontTimeout, setFontTimeout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFontTimeout(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const ready = fontsLoaded || !!fontError || fontTimeout;

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <View className="flex-1 bg-night-900">
      <SafeAreaProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
        <StatusBar style="light" />
      </SafeAreaProvider>
    </View>
  );
}
