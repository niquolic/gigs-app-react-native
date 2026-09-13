import React, { useCallback, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import GigCard from "@/components/GigCard";
import { deleteGig, getGigsByUserId } from "@/api/gigs";
import { useAuth } from "@/context/AuthContext";
import { Gig } from "@/types/gig";
import { RootStackParamList, MainTabParamList } from "@/navigation/types";

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Dashboard">,
  NativeStackNavigationProp<RootStackParamList>
>;

/**
 * Écran principal : équivalent de DashboardComponent + GigsListComponent.
 * useFocusEffect recharge la liste à chaque retour sur l'écran, comme le
 * faisait window.location.reload()/ngOnInit côté Angular après un ajout,
 * une modification ou une suppression.
 */
export default function DashboardScreen() {
  const navigation = useNavigation<Navigation>();
  const { userId } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGigs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getGigsByUserId(userId);
      setGigs(data ?? []);
    } catch (e) {
      setGigs([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadGigs();
    }, [loadGigs])
  );

  const handleEdit = (id: number) => {
    navigation.navigate("EditGig", { id });
  };

  const handleDelete = (id: number) => {
    if (!userId) return;
    Alert.alert("Supprimer ce concert ?", "Cette action est irréversible.", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGig(userId, id);
            loadGigs();
          } catch (e) {
            Alert.alert("Erreur", "La suppression a échoué.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (gigs.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 px-8">
        <Text className="mb-6 text-center text-lg text-gray-600">
          Vous n'avez pas saisi de concerts.
        </Text>
        <Pressable
          onPress={() => navigation.navigate("AddGig")}
          className="h-11 items-center justify-center rounded-lg bg-primary px-6"
        >
          <Text className="text-base font-semibold text-white">Ajouter un concert</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 16 }}
      data={gigs}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <GigCard gig={item} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    />
  );
}
