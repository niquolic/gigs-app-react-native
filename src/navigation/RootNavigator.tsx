import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@/context/AuthContext";
import LoginScreen from "@/screens/LoginScreen";
import EditGigScreen from "@/screens/EditGigScreen";
import MainTabs from "./MainTabs";
import { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Équivalent de app-routing.module.ts : selon isAuthenticated (dérivé du
 * même mécanisme que AuthGuard côté Angular), on affiche soit l'écran de
 * connexion, soit l'app (onglets + écran de modification empilé au-dessus).
 */
export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="EditGig"
              component={EditGigScreen}
              options={{ headerShown: true, title: "Modifier le concert" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
