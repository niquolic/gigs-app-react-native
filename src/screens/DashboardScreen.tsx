import React, { useCallback, useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GigCard from "@/components/GigCard";
import ProfileSidebar from "@/components/ProfileSidebar";
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
  const insets = useSafeAreaInsets();
  const { userId, t } = useAuth();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGigs = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getGigsByUserId(userId);
      // Les concerts les plus proches / récents en premier.
      const sorted = [...(data ?? [])].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setGigs(sorted);
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

  const nextGig = useMemo(() => {
    const now = Date.now();
    return [...gigs]
      .filter((g) => new Date(g.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [gigs]);

  const handleEdit = (id: string) => {
    navigation.navigate("EditGig", { id });
  };

  const handleDelete = (gigId: string) => {
    if (!userId) return;
    Alert.alert(t("deleteGig"), t("irreversible"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteGig(gigId);
            loadGigs();
          } catch (e) {
            Alert.alert("Erreur", "La suppression a échoué.");
          }
        },
      },
    ]);
  };

  const Header = (
    <View className="mb-5">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="text-sm text-ink-muted">{t("greeting")}</Text>
          <Text className="mt-1 font-display text-2xl text-ink">
            {gigs.length > 0
              ? `${gigs.length} ${t("gigCounter")}`
              : t("yourGigs")}
          </Text>
        </View>
        <ProfileSidebar />
      </View>
      {nextGig && (
        <View className="mt-3 flex-row items-center rounded-xl bg-indigo-500/10 px-3 py-2">
          <Ionicons name="sparkles-outline" size={14} color="#8B93FF" />
          <Text className="ml-2 flex-1 text-xs text-indigo-400" numberOfLines={1}>
            {t("next")}: {nextGig.bands?.join(", ")} · {nextGig.venue}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-night-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (gigs.length === 0) {
    return (
      <View className="flex-1 bg-night-900 px-8" style={{ paddingTop: insets.top + 12 }}>
        <View className="mb-3 flex-row items-center justify-end">
          <ProfileSidebar />
        </View>
        <View className="flex-1 items-center justify-center">
        <View className="mb-5 h-20 w-20 items-center justify-center rounded-full bg-indigo-500/10">
          <Ionicons name="ticket-outline" size={36} color="#8B93FF" />
        </View>
        <Text className="mb-2 text-center font-display-semibold text-lg text-ink">
          {t("noGigs")}
        </Text>
        <Text className="mb-6 text-center text-sm text-ink-muted">
          {t("emptyGigs")}
        </Text>
        <Pressable
          onPress={() => navigation.navigate("AddGig")}
          className="flex-row items-center rounded-full bg-indigo-500 px-6 py-3 active:bg-indigo-600"
        >
          <Ionicons name="add" size={18} color="#fff" />
          <Text className="ml-1 font-display-semibold text-white">{t("addGig")}</Text>
        </Pressable>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-night-900"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 20, paddingBottom: 110 }}
      data={gigs}
      keyExtractor={(item) => String(item.id)}
      ListHeaderComponent={Header}
      renderItem={({ item }) => (
        <GigCard gig={item} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    />
  );
}
