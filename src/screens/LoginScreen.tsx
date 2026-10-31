import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAuth } from "@/context/AuthContext";
import { getApiErrorMessage } from "@/utils/apiError";
import { RootStackParamList } from "@/navigation/types";

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Login">>();
  const [successMessage, setSuccessMessage] = useState<string | null>(
    route.params?.registeredMessage ?? null
  );
  const { login } = useAuth();
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);
    try {
      await login(userLogin, userPassword);
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, "Impossible de se connecter. Réessaie."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#141B2E", "#0B1120", "#080B14"]}
      className="flex-1"
    >
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Badge / logo */}
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20">
            <Ionicons name="musical-notes" size={30} color="#8B93FF" />
          </View>
          <Text className="font-display text-3xl text-ink">Gigs</Text>
          <Text className="mt-1 text-sm text-ink-muted">
            Tous tes concerts, au même endroit
          </Text>
        </View>

        {/* Carte "verre" */}
        <View className="w-full max-w-sm rounded-3xl border border-night-600 bg-night-800/90 p-6">
          <View className="mb-4">
            <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
              Identifiant
            </Text>
            <View className="flex-row items-center rounded-xl border border-night-600 bg-night-900 px-4">
              <Ionicons name="person-outline" size={18} color="#5D6889" />
              <TextInput
                value={userLogin}
                onChangeText={setUserLogin}
                placeholder="ton login"
                placeholderTextColor="#5D6889"
                autoCapitalize="none"
                className="ml-3 h-12 flex-1 text-base text-ink"
              />
            </View>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
              Mot de passe
            </Text>
            <View className="flex-row items-center rounded-xl border border-night-600 bg-night-900 px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#5D6889" />
              <TextInput
                value={userPassword}
                onChangeText={setUserPassword}
                placeholder="••••••••"
                placeholderTextColor="#5D6889"
                secureTextEntry={!showPassword}
                className="ml-3 h-12 flex-1 text-base text-ink"
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#5D6889"
                />
              </Pressable>
            </View>
          </View>

          {successMessage && (
            <View className="mb-4 flex-row items-center rounded-xl bg-success/10 px-3 py-2">
              <Ionicons name="checkmark-circle-outline" size={16} color="#34D399" />
              <Text className="ml-2 flex-1 text-sm text-success">{successMessage}</Text>
            </View>
          )}

          {error && (
            <View className="mb-4 flex-row items-center rounded-xl bg-danger/10 px-3 py-2">
              <Ionicons name="alert-circle-outline" size={16} color="#F2545B" />
              <Text className="ml-2 flex-1 text-sm text-danger">{error}</Text>
            </View>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={loading || !userLogin || !userPassword}
            className="overflow-hidden rounded-xl active:opacity-90"
            style={{ opacity: !userLogin || !userPassword ? 0.5 : 1 }}
          >
            <LinearGradient
              colors={["#6366F1", "#4338CA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-12 flex-row items-center justify-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="mr-2 text-base font-display-semibold text-white">
                    Se connecter
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Register")}
            className="mt-4 items-center"
            hitSlop={8}
          >
            <Text className="text-sm text-ink-muted">
              Pas encore de compte ?{" "}
              <Text className="font-display-medium text-indigo-400">Créer un compte</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
