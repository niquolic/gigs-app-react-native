import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import StatBlock from "@/components/StatBlock";
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
  const [stats, setStats] = useState<StatsState>(initialState);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  // Sur tablette / desktop (web), on affiche 2 colonnes comme l'original ;
  // sur téléphone, une seule colonne pour rester lisible.
  const isWide = width >= 700;

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
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      <View className={isWide ? "flex-row flex-wrap justify-between" : "flex-col"}>
        <View className={isWide ? "w-[48%]" : "w-full"}>
          <StatBlock title="Groupes que vous avez le plus vus">
            {stats.bandsStats.length === 0 ? (
              <Text className="text-gray-500">Vous n'avez pas renseigné de concerts.</Text>
            ) : (
              stats.bandsStats.map((b, i) => (
                <Text key={i} className="text-gray-700">
                  {b.band} - x{b.count}
                </Text>
              ))
            )}
          </StatBlock>

          <StatBlock title="Nombre de concerts vus">
            <Text className="text-2xl font-bold text-primary">{stats.totalNumberOfGigs}</Text>
          </StatBlock>

          <StatBlock title="Montant dépensé pour des concerts">
            <Text className="text-2xl font-bold text-primary">{stats.totalPrice} €</Text>
          </StatBlock>
        </View>

        <View className={isWide ? "w-[48%]" : "w-full"}>
          <StatBlock title="Nombre de concerts vus cette année">
            <Text className="text-2xl font-bold text-primary">{stats.totalNumberOfGigsThisYear}</Text>
          </StatBlock>

          <StatBlock title="Pays où vous avez vu le plus de concerts">
            {stats.countryStats.length === 0 ? (
              <Text className="text-gray-500">Vous n'avez pas renseigné de concerts.</Text>
            ) : (
              stats.countryStats.map((c, i) => (
                <Text key={i} className="text-gray-700">
                  {c.country} - x{c.count}
                </Text>
              ))
            )}
          </StatBlock>

          <StatBlock title="Montant dépensé cette année">
            <Text className="text-2xl font-bold text-primary">{stats.priceThisYear} €</Text>
          </StatBlock>
        </View>
      </View>
    </ScrollView>
  );
}
