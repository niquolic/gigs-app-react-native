import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

const CURRENCIES = [
  "EUR", "USD", "GBP", "CHF", "CAD", "AUD", "JPY", "CNY", "INR", "BRL",
  "MXN", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "TRY", "KRW", "NZD",
];

export default function ProfileSidebar() {
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences, logout, t } = useAuth();
  const [visible, setVisible] = useState(false);
  const [picker, setPicker] = useState<"language" | "currency" | null>(null);
  const [saving, setSaving] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const sidebarWidth = Dimensions.get("window").width * 0.82;

  useEffect(() => {
    if (visible) {
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  const closeOverlay = () => {
    setPicker(null);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const savePreference = async (value: string) => {
    if (picker === null || saving) return;

    const key = picker;
    setSaving(true);
    try {
      await updatePreferences({ ...preferences, [key]: value });
      setPicker(null);
    } catch {
      Alert.alert("Erreur", "Impossible d'enregistrer tes préférences. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    closeOverlay();
    await logout();
  };

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        className="h-11 w-11 items-center justify-center rounded-full border border-night-600 bg-night-800"
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le profil"
      >
        <Ionicons name="person" size={20} color="#A5ACFF" />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        statusBarTranslucent
        animationType="none"
        onRequestClose={closeOverlay}
      >
        {visible && (
        <View
          className="absolute inset-0 z-50 flex-row"
          pointerEvents="box-none"
        >
          <Animated.View
            className="absolute inset-0 bg-black/60"
            style={{ opacity: animation }}
          />
          {picker === null ? (
            <>
              <Animated.View
                className="ml-auto h-full w-[82%] border-l border-night-600 bg-night-900 px-6"
                style={{
                  paddingTop: insets.top + 28,
                  paddingBottom: insets.bottom + 20,
                  transform: [{
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [sidebarWidth, 0],
                    }),
                  }],
                }}
              >
                <View className="mb-8 flex-row items-center justify-between">
                  <View>
                    <Text className="font-display text-2xl text-ink">{t("profileTitle")}</Text>
                    <Text className="mt-1 text-xs text-ink-muted">{t("profileSubtitle")}</Text>
                  </View>
                  <Pressable onPress={closeOverlay} hitSlop={10} accessibilityRole="button">
                    <Ionicons name="close" size={24} color="#A5ACFF" />
                  </Pressable>
                </View>

                <Text className="mb-3 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
                  {t("preferences")}
                </Text>
                <Pressable
                  onPress={() => setPicker("language")}
                  className="mb-3 flex-row items-center justify-between rounded-xl border border-night-600 bg-night-800 px-4 py-4"
                  accessibilityRole="button"
                >
                  <View className="flex-row items-center">
                    <Ionicons name="language-outline" size={19} color="#8B93FF" />
                    <Text className="ml-3 text-sm text-ink">{t("language")}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="mr-2 text-sm font-display-medium text-indigo-300">
                      {preferences.language.toUpperCase()}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#5D6889" />
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => setPicker("currency")}
                  className="mb-3 flex-row items-center justify-between rounded-xl border border-night-600 bg-night-800 px-4 py-4"
                  accessibilityRole="button"
                >
                  <View className="flex-row items-center">
                    <Ionicons name="cash-outline" size={19} color="#8B93FF" />
                    <Text className="ml-3 text-sm text-ink">{t("currency")}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="mr-2 text-sm font-display-medium text-indigo-300">
                      {preferences.currency}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#5D6889" />
                  </View>
                </Pressable>

                <View className="flex-1" />
                <Pressable
                  onPress={() => void handleLogout()}
                  className="flex-row items-center justify-center rounded-xl border border-danger/30 bg-danger/10 py-4"
                >
                  <Ionicons name="log-out-outline" size={19} color="#F2545B" />
                  <Text className="ml-2 font-display-medium text-sm text-danger">
                    {t("logout")}
                  </Text>
                </Pressable>
              </Animated.View>
              <Pressable
                onPress={closeOverlay}
                className="flex-1"
                accessibilityRole="button"
                accessibilityLabel="Fermer le profil"
              />
            </>
          ) : (
            <View className="flex-1 items-center justify-center px-8">
              <Pressable
                onPress={() => setPicker(null)}
                className="absolute inset-0 bg-black/60"
                accessibilityRole="button"
                accessibilityLabel="Fermer le sélecteur"
              />
              <View className="max-h-[70%] w-full rounded-2xl border border-night-600 bg-night-800 p-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="font-display-semibold text-lg text-ink">
                    {picker === "language" ? t("chooseLanguage") : t("chooseCurrency")}
                  </Text>
                  <Pressable onPress={() => setPicker(null)} hitSlop={10}>
                    <Ionicons name="close" size={22} color="#A5ACFF" />
                  </Pressable>
                </View>
                {saving ? (
                  <ActivityIndicator color="#8B93FF" />
                ) : (
                  <ScrollView keyboardShouldPersistTaps="handled">
                    {(picker === "language" ? ["fr", "en"] : CURRENCIES).map((value) => (
                      <Pressable
                        key={value}
                        onPress={() => void savePreference(value)}
                        className="border-b border-night-700 py-3"
                        accessibilityRole="button"
                      >
                        <Text className="text-sm text-ink">
                          {picker === "language"
                            ? value === "fr" ? "Français" : "English"
                            : value}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>
            </View>
          )}
        </View>
        )}
      </Modal>
    </>
  );
}
