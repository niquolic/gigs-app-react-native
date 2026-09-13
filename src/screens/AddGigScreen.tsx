import React, { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import GigForm from "@/components/GigForm";
import { addGig } from "@/api/gigs";
import { useAuth } from "@/context/AuthContext";
import { GigFormValues } from "@/types/gig";
import { MainTabParamList } from "@/navigation/types";

export default function AddGigScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, "AddGig">>();
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

  return <GigForm submitLabel="Valider" submitting={submitting} onSubmit={onSubmit} />;
}
