import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/context/AuthContext";
import LoginScreen from "@/screens/LoginScreen";
import EditGigScreen from "@/screens/EditGigScreen";
import MainTabs from "./MainTabs";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

// Thème sombre custom pour que les zones non couvertes par nos écrans
// (transitions, fonds de statusbar) restent bleu-nuit plutôt que blanches.
const NavTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#0B1120",
    card: "#0B1120",
    border: "#1B2540",
    primary: "#6366F1",
  },
};

/**
 * Équivalent de app-routing.module.ts : selon isAuthenticated (dérivé du
 * même mécanisme que AuthGuard côté Angular), on affiche soit l'écran de
 * connexion, soit l'app (onglets + écran de modification empilé au-dessus).
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-night-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={NavTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="EditGig"
              component={EditGigScreen}
              options={{ presentation: "modal" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
