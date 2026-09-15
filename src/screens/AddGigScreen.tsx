import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GigForm from "@/components/GigForm";
import { addGig } from "@/api/gigs";
import { useAuth } from "@/context/AuthContext";
import { GigFormValues } from "@/types/gig";
import { MainTabParamList } from "@/navigation/types";

export default function AddGigScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "AddGig">>();
  const insets = useSafeAreaInsets();
  const { userId } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: GigFormValues) => {
    if (!userId) return;
    setSubmitting(true);
    try {
      await addGig(userId, {
        ...values,
        bands: values.bands.filter((b) => b.trim().length > 0),
      });
      navigation.navigate("Dashboard");
    } catch (e) {
      Alert.alert("Erreur", "L'ajout du concert a échoué.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-night-900" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center px-5 pb-2 pt-4">
        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15">
          <Ionicons name="add-circle-outline" size={20} color="#8B93FF" />
        </View>
        <View>
          <Text className="font-display text-xl text-ink">Nouveau concert</Text>
          <Text className="text-xs text-ink-muted">Ajoute-le à ta collection</Text>
        </View>
      </View>
      <GigForm submitLabel="Valider" submitting={submitting} onSubmit={onSubmit} />
    </View>
  );
}
