import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatTile from "@/components/StatTile";
import RankedList from "@/components/RankedList";
import { useAuth } from "@/context/AuthContext";
import {
  getBandsStats,
  getCountryStatsOfUser,
  getPriceThisYear,
  getTotalNumberOfGigs,
  getTotalNumberOfGigsThisYear,
  getTotalPrice,
} from "@/api/stats";
import { BandStat, CountryStat } from "@/types/gig";

type StatsState = {
  bandsStats: BandStat[];
  countryStats: CountryStat[];
  totalNumberOfGigs: number;
  totalNumberOfGigsThisYear: number;
  totalPrice: number;
  priceThisYear: number;
};

const initialState: StatsState = {
  bandsStats: [],
  countryStats: [],
  totalNumberOfGigs: 0,
  totalNumberOfGigsThisYear: 0,
  totalPrice: 0,
  priceThisYear: 0,
};

export default function StatsScreen() {
  const { userId } = useAuth();
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<StatsState>(initialState);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [bandsStats, countryStats, totalNumberOfGigs, totalNumberOfGigsThisYear, totalPrice, priceThisYear] =
        await Promise.all([
          getBandsStats(userId),
          getCountryStatsOfUser(userId),
          getTotalNumberOfGigs(userId),
          getTotalNumberOfGigsThisYear(userId),
          getTotalPrice(userId),
          getPriceThisYear(userId),
        ]);
      setStats({
        bandsStats: bandsStats ?? [],
        countryStats: countryStats ?? [],
        totalNumberOfGigs: totalNumberOfGigs ?? 0,
        totalNumberOfGigsThisYear: totalNumberOfGigsThisYear ?? 0,
        totalPrice: totalPrice ?? 0,
        priceThisYear: priceThisYear ?? 0,
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-night-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-night-900"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 110 }}
    >
      <Text className="mb-1 text-sm text-ink-muted">Ton palmarès</Text>
      <Text className="mb-5 font-display text-2xl text-ink">Statistiques</Text>

      <View className="mb-4 flex-row flex-wrap justify-between gap-y-3">
        <StatTile icon="ticket-outline" value={stats.totalNumberOfGigs} label="Concerts vus" />
        <StatTile icon="calendar-outline" value={stats.totalNumberOfGigsThisYear} label="Cette année" />
        <StatTile icon="wallet-outline" value={`${stats.totalPrice} €`} label="Dépensé au total" tint="gold" />
        <StatTile icon="trending-up-outline" value={`${stats.priceThisYear} €`} label="Dépensé cette année" tint="gold" />
      </View>

      <RankedList
        title="Groupes les plus vus"
        icon="musical-notes-outline"
        items={stats.bandsStats.map((b) => ({ label: b.band, count: b.count }))}
        emptyLabel="Aucun concert renseigné pour l'instant."
      />

      <RankedList
        title="Pays visités"
        icon="earth-outline"
        items={stats.countryStats.map((c) => ({ label: c.country, count: c.count }))}
        emptyLabel="Aucun concert renseigné pour l'instant."
      />
    </ScrollView>
  );
}
