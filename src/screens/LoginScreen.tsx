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
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(userLogin, userPassword);
      // La navigation bascule automatiquement vers l'app une fois isAuthenticated=true.
    } catch (e) {
      setError("Identifiants incorrects, réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-gray-50 px-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <Text className="mb-6 text-center text-xl font-semibold text-dark">
          Veuillez vous connecter
        </Text>

        <TextInput
          value={userLogin}
          onChangeText={setUserLogin}
          placeholder="Login"
          autoCapitalize="none"
          className="mb-3 h-12 rounded-lg border border-gray-300 px-4 text-base"
        />
        <TextInput
          value={userPassword}
          onChangeText={setUserPassword}
          placeholder="Password"
          secureTextEntry
          className="mb-4 h-12 rounded-lg border border-gray-300 px-4 text-base"
        />

        {error && <Text className="mb-3 text-center text-sm text-danger">{error}</Text>}

        <Pressable
          onPress={onSubmit}
          disabled={loading || !userLogin || !userPassword}
          className="h-12 items-center justify-center rounded-lg bg-primary active:bg-primary-dark"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-semibold text-white">Valider</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
