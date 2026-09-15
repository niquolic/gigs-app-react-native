import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, Alert } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GigForm from "@/components/GigForm";
import { editGig, getGigById } from "@/api/gigs";
import { useAuth } from "@/context/AuthContext";
import { Gig, GigFormValues } from "@/types/gig";
import { RootStackParamList } from "@/navigation/types";

type EditGigRouteProp = RouteProp<RootStackParamList, "EditGig">;

export default function EditGigScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<EditGigRouteProp>();
  const insets = useSafeAreaInsets();
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
      <View className="flex-1 items-center justify-center bg-night-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-night-900" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
        <View className="flex-row items-center">
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-500/15">
            <Ionicons name="create-outline" size={20} color="#8B93FF" />
          </View>
          <View>
            <Text className="font-display text-xl text-ink">Modifier le concert</Text>
            <Text className="text-xs text-ink-muted">{gig.bands?.join(", ")}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={8}
          className="h-9 w-9 items-center justify-center rounded-full bg-night-800"
        >
          <Ionicons name="close" size={18} color="#98A2BE" />
        </Pressable>
      </View>
      <GigForm
        submitLabel="Enregistrer"
        submitting={submitting}
        initialValues={{
          bands: gig.bands ?? [],
          city: gig.city,
          venue: gig.venue,
          country: gig.country,
          date: gig.date,
          price: String(gig.price ?? ""),
        }}
        onSubmit={onSubmit}
      />
    </View>
  );
}
