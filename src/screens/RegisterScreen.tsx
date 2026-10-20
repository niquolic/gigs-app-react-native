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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerRequest } from "@/api/auth";
import { RootStackParamList } from "@/navigation/types";

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = userPassword.length > 0 && userPassword === confirmPassword;
  const isValid = userLogin.trim().length > 0 && passwordsMatch;

  const onSubmit = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      await registerRequest(userLogin.trim(), userPassword);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Login",
            params: { registeredMessage: "Compte créé avec succès. Connecte-toi pour continuer." },
          },
        ],
      });
    } catch (e: any) {
      const data = e?.response?.data;
      setError(typeof data === "string" && data ? data : "Impossible de créer le compte. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#141B2E", "#0B1120", "#080B14"]} className="flex-1">
      <KeyboardAvoidingView
        className="flex-1 items-center justify-center px-6"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="mb-8 items-center">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20">
            <Ionicons name="person-add-outline" size={28} color="#8B93FF" />
          </View>
          <Text className="font-display text-3xl text-ink">Créer un compte</Text>
          <Text className="mt-1 text-sm text-ink-muted">Rejoins Gigs en quelques secondes</Text>
        </View>

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
                placeholder="choisis un login"
                placeholderTextColor="#5D6889"
                autoCapitalize="none"
                className="ml-3 h-12 flex-1 text-base text-ink"
              />
            </View>
          </View>

          <View className="mb-4">
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

          <View className="mb-5">
            <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
              Confirmer le mot de passe
            </Text>
            <View className="flex-row items-center rounded-xl border border-night-600 bg-night-900 px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#5D6889" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#5D6889"
                secureTextEntry={!showPassword}
                className="ml-3 h-12 flex-1 text-base text-ink"
              />
            </View>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text className="mt-2 text-xs text-danger">
                Les mots de passe ne correspondent pas.
              </Text>
            )}
          </View>

          {error && (
            <View className="mb-4 flex-row items-center rounded-xl bg-danger/10 px-3 py-2">
              <Ionicons name="alert-circle-outline" size={16} color="#F2545B" />
              <Text className="ml-2 flex-1 text-sm text-danger">{error}</Text>
            </View>
          )}

          <Pressable
            onPress={onSubmit}
            disabled={loading || !isValid}
            className="overflow-hidden rounded-xl active:opacity-90"
            style={{ opacity: isValid ? 1 : 0.5 }}
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
                    Créer mon compte
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} className="mt-4 items-center" hitSlop={8}>
            <Text className="text-sm text-ink-muted">
              Déjà un compte ?{" "}
              <Text className="font-display-medium text-indigo-400">Se connecter</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
