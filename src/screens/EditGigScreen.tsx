import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GigForm from "@/components/GigForm";
import { editGig, getGigById } from "@/api/gigs";
import { useAuth } from "@/context/AuthContext";
import { Gig, GigFormValues } from "@/types/gig";
import { RootStackParamList } from "@/navigation/types";

type EditGigRouteProp = RouteProp<RootStackParamList, "EditGig">;

export default function EditGigScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditGigRouteProp>();
  const { userId } = useAuth();
  const { id } = route.params;

  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getGigById(id);
        setGig(data);
      } catch (e) {
        Alert.alert("Erreur", "Impossible de charger ce concert.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onSubmit = async (values: GigFormValues) => {
    if (!userId || !gig) return;
    setSubmitting(true);
    try {
      const updatedGig: Gig = {
        ...gig,
        ...values,
        bands: values.bands.filter((b) => b.trim().length > 0),
      };
      await editGig(userId, updatedGig);
      navigation.navigate("Main", { screen: "Dashboard" });
    } catch (e) {
      Alert.alert("Erreur", "La modification a échoué.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !gig) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <GigForm
      submitLabel="Enregistrer"
      submitting={submitting}
      initialValues={{
        bands: gig.bands?.length ? gig.bands : [""],
        city: gig.city,
        venue: gig.venue,
        country: gig.country,
        date: gig.date,
        price: String(gig.price ?? ""),
      }}
      onSubmit={onSubmit}
    />
  );
}
