import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
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
  const { preferences, updatePreferences, logout } = useAuth();
  const [visible, setVisible] = useState(false);
  const [picker, setPicker] = useState<"language" | "currency" | null>(null);
  const [saving, setSaving] = useState(false);

  const savePreference = async (value: string) => {
    setSaving(true);
    try {
      await updatePreferences({
        ...preferences,
        [picker === "language" ? "language" : "currency"]: value,
      });
      setPicker(null);
    } catch {
      Alert.alert("Erreur", "Impossible d'enregistrer tes préférences. Réessaie.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    setVisible(false);
    await logout();
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)}
        className="absolute left-5 z-20 h-11 w-11 items-center justify-center rounded-full border border-night-600 bg-night-800"
        style={{ top: insets.top + 8 }}
        accessibilityRole="button" accessibilityLabel="Ouvrir le profil">
        <Ionicons name="person" size={20} color="#A5ACFF" />
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View className="flex-1 flex-row bg-black/60">
          <View className="h-full w-[82%] border-r border-night-600 bg-night-900 px-6"
            style={{ paddingTop: insets.top + 28, paddingBottom: insets.bottom + 20 }}>
            <View className="mb-8 flex-row items-center justify-between">
              <View>
                <Text className="font-display text-2xl text-ink">Mon profil</Text>
                <Text className="mt-1 text-xs text-ink-muted">Tes préférences Gigs</Text>
              </View>
              <Pressable onPress={() => setVisible(false)} hitSlop={10}>
                <Ionicons name="close" size={24} color="#A5ACFF" />
              </Pressable>
            </View>

            <Text className="mb-3 text-xs font-display-medium uppercase tracking-wide text-ink-faint">Préférences</Text>
            <Pressable onPress={() => setPicker("language")}
              className="mb-3 flex-row items-center justify-between rounded-xl border border-night-600 bg-night-800 px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="language-outline" size={19} color="#8B93FF" />
                <Text className="ml-3 text-sm text-ink">Langue</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm font-display-medium text-indigo-300">{preferences.language.toUpperCase()}</Text>
                <Ionicons name="chevron-forward" size={16} color="#5D6889" />
              </View>
            </Pressable>

            <Pressable onPress={() => setPicker("currency")}
              className="mb-3 flex-row items-center justify-between rounded-xl border border-night-600 bg-night-800 px-4 py-4">
              <View className="flex-row items-center">
                <Ionicons name="cash-outline" size={19} color="#8B93FF" />
                <Text className="ml-3 text-sm text-ink">Devise</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm font-display-medium text-indigo-300">{preferences.currency}</Text>
                <Ionicons name="chevron-forward" size={16} color="#5D6889" />
              </View>
            </Pressable>

            <View className="flex-1" />
            <Pressable onPress={handleLogout}
              className="flex-row items-center justify-center rounded-xl border border-danger/30 bg-danger/10 py-4">
              <Ionicons name="log-out-outline" size={19} color="#F2545B" />
              <Text className="ml-2 font-display-medium text-sm text-danger">Se déconnecter</Text>
            </Pressable>
          </View>
          <Pressable onPress={() => setVisible(false)} className="flex-1" />
        </View>
      </Modal>

      <Modal visible={picker !== null} transparent animationType="fade" onRequestClose={() => setPicker(null)}>
        <Pressable onPress={() => setPicker(null)} className="flex-1 justify-center bg-black/60 px-8">
          <Pressable onPress={(event) => event.stopPropagation()} className="max-h-[70%] rounded-2xl border border-night-600 bg-night-800 p-4">
            <Text className="mb-3 font-display-semibold text-lg text-ink">
              {picker === "language" ? "Choisir une langue" : "Choisir une devise"}
            </Text>
            {saving ? <ActivityIndicator color="#8B93FF" /> : (
              <ScrollView>
                {(picker === "language" ? ["fr", "en"] : CURRENCIES).map((value) => (
                  <Pressable key={value} onPress={() => savePreference(value)}
                    className="border-b border-night-700 py-3">
                    <Text className="text-sm text-ink">
                      {picker === "language"
                        ? value === "fr" ? "Français" : "English"
                        : value}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
