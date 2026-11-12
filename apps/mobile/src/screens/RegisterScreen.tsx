import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { registerRequest } from "@/api/auth";
import { getApiErrorMessage } from "@/utils/apiError";
import { RootStackParamList } from "@/navigation/types";
import { useAuth } from "@/context/AuthContext";

const CURRENCIES = [
  { code: "EUR", label: "Euro (€)" },
  { code: "USD", label: "Dollar américain ($)" },
  { code: "GBP", label: "Livre sterling (£)" },
  { code: "CHF", label: "Franc suisse" },
  { code: "CAD", label: "Dollar canadien" },
  { code: "AUD", label: "Dollar australien" },
  { code: "JPY", label: "Yen japonais (¥)" },
  { code: "CNY", label: "Yuan chinois" },
  { code: "INR", label: "Roupie indienne" },
  { code: "BRL", label: "Réal brésilien" },
  { code: "MXN", label: "Peso mexicain" },
  { code: "SEK", label: "Couronne suédoise" },
  { code: "NOK", label: "Couronne norvégienne" },
  { code: "DKK", label: "Couronne danoise" },
  { code: "PLN", label: "Złoty polonais" },
  { code: "CZK", label: "Couronne tchèque" },
  { code: "HUF", label: "Forint hongrois" },
  { code: "TRY", label: "Livre turque" },
  { code: "KRW", label: "Won sud-coréen" },
  { code: "NZD", label: "Dollar néo-zélandais" },
];

type PreferenceField = "currency" | "language";

export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { t } = useAuth();
  const [userLogin, setUserLogin] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState<"fr" | "en" | undefined>();
  const [currency, setCurrency] = useState<string | undefined>();
  const [preferencePicker, setPreferencePicker] = useState<PreferenceField | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = userPassword.length > 0 && userPassword === confirmPassword;
  const isValid = userLogin.trim().length > 0 && passwordsMatch;

  const onSubmit = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      await registerRequest(userLogin.trim(), userPassword, { language, currency });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Login",
            params: { registeredMessage: t("registerSuccess") },
          },
        ],
      });
    } catch (e: unknown) {
      setError(getApiErrorMessage(e, t("registerFailed")));
    } finally {
      setLoading(false);
    }
  };

  const selectPreference = (value: string) => {
    if (preferencePicker === "currency") setCurrency(value);
    if (preferencePicker === "language") setLanguage(value as "fr" | "en");
    setPreferencePicker(null);
  };

  const pickerOptions = preferencePicker === "currency"
    ? CURRENCIES.map((item) => ({ value: item.code, label: item.label }))
    : [{ value: "fr", label: "Français" }, { value: "en", label: "English" }];

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
          <Text className="font-display text-3xl text-ink">{t("createAccount")}</Text>
          <Text className="mt-1 text-sm text-ink-muted">{t("registerSubtitle")}</Text>
        </View>

        <View className="w-full max-w-sm rounded-3xl border border-night-600 bg-night-800/90 p-6">
          <View className="mb-4">
            <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">{t("identifier")}</Text>
            <View className="flex-row items-center rounded-xl border border-night-600 bg-night-900 px-4">
              <Ionicons name="person-outline" size={18} color="#5D6889" />
              <TextInput value={userLogin} onChangeText={setUserLogin} placeholder={t("registerPlaceholder")}
                placeholderTextColor="#5D6889" autoCapitalize="none" className="ml-3 h-12 flex-1 text-base text-ink" />
            </View>
          </View>

          <View className="mb-3">
            <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">{t("password")}</Text>
            <View className="flex-row items-center rounded-xl border border-night-600 bg-night-900 px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#5D6889" />
              <TextInput value={userPassword} onChangeText={setUserPassword} placeholder="••••••••"
                placeholderTextColor="#5D6889" secureTextEntry={!showPassword} className="ml-3 h-12 flex-1 text-base text-ink" />
              <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={18} color="#5D6889" />
              </Pressable>
            </View>
          </View>

          <View className="mb-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-2 text-[10px] font-display-medium uppercase tracking-wide text-ink-faint">{t("currencyOptional")}</Text>
              <Pressable onPress={() => setPreferencePicker("currency")} className="h-12 flex-row items-center justify-between rounded-xl border border-night-600 bg-night-900 px-3">
                <Text numberOfLines={1} className="text-sm text-ink">{currency ?? "EUR"}</Text>
                <Ionicons name="chevron-down" size={16} color="#5D6889" />
              </Pressable>
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-[10px] font-display-medium uppercase tracking-wide text-ink-faint">{t("languageOptional")}</Text>
              <Pressable onPress={() => setPreferencePicker("language")} className="h-12 flex-row items-center justify-between rounded-xl border border-night-600 bg-night-900 px-3">
                <Text className="text-sm text-ink">{language?.toUpperCase() ?? "EN"}</Text>
                <Ionicons name="chevron-down" size={16} color="#5D6889" />
              </Pressable>
            </View>
          </View>

          <View className="mb-5">
            <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">{t("confirmPassword")}</Text>
            <View className="flex-row items-center rounded-xl border border-night-600 bg-night-900 px-4">
              <Ionicons name="lock-closed-outline" size={18} color="#5D6889" />
              <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••"
                placeholderTextColor="#5D6889" secureTextEntry={!showPassword} className="ml-3 h-12 flex-1 text-base text-ink" />
            </View>
            {confirmPassword.length > 0 && !passwordsMatch && (
              <Text className="mt-2 text-xs text-danger">{t("passwordMismatch")}</Text>
            )}
          </View>

          {error && (
            <View className="mb-4 flex-row items-center rounded-xl bg-danger/10 px-3 py-2">
              <Ionicons name="alert-circle-outline" size={16} color="#F2545B" />
              <Text className="ml-2 flex-1 text-sm text-danger">{error}</Text>
            </View>
          )}

          <Pressable onPress={onSubmit} disabled={loading || !isValid}
            className="overflow-hidden rounded-xl active:opacity-90" style={{ opacity: isValid ? 1 : 0.5 }}>
            <LinearGradient colors={["#6366F1", "#4338CA"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              className="h-12 flex-row items-center justify-center">
              {loading ? <ActivityIndicator color="#fff" /> : <>
                <Text className="mr-2 text-base font-display-semibold text-white">{t("create")}</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()} className="mt-4 items-center" hitSlop={8}>
            <Text className="text-sm text-ink-muted">{t("alreadyAccount")} <Text className="font-display-medium text-indigo-400">{t("login")}</Text></Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={preferencePicker !== null} transparent animationType="fade" onRequestClose={() => setPreferencePicker(null)}>
        <Pressable onPress={() => setPreferencePicker(null)} className="flex-1 justify-center bg-black/60 px-8">
          <Pressable onPress={(event) => event.stopPropagation()} className="max-h-[70%] rounded-2xl border border-night-600 bg-night-800 p-4">
            <Text className="mb-3 font-display-semibold text-lg text-ink">
              {preferencePicker === "currency" ? t("chooseCurrency") : t("chooseLanguage")}
            </Text>
            <ScrollView>
              {pickerOptions.map((option) => (
                <Pressable key={option.value} onPress={() => selectPreference(option.value)} className="border-b border-night-700 py-3">
                  <Text className="text-sm text-ink">{option.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
