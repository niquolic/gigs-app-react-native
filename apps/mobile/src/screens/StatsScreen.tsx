import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import StatTile from "@/components/StatTile";
import ProfileSidebar from "@/components/ProfileSidebar";
import RankedList from "@/components/RankedList";
import { useAuth } from "@/context/AuthContext";
import { getBandsStats, getCountryStatsOfUser, getGigStats } from "@/api/stats";
import { BandStat, CountryStat } from "@/types/gig";

export default function StatsScreen() {
  const { preferences, t } = useAuth();
  const insets = useSafeAreaInsets();
  const [bandsStats, setBandsStats] = useState<BandStat[]>([]);
  const [countryStats, setCountryStats] = useState<CountryStat[]>([]);
  const [gigStats, setGigStats] = useState({
    totalNumberOfGigs: 0,
    totalNumberOfGigsThisYear: 0,
    totalPrice: 0,
    priceThisYear: 0,
  });
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat(preferences.language === "fr" ? "fr-FR" : "en-US", {
        style: "currency",
        currency: preferences.currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${amount} ${preferences.currency}`;
    }
  };

  const loadStats = useCallback(async () => {
    setLoading(true);
    setPage(0);
    try {
      const [bandsPage, countries, totals] = await Promise.all([
        getBandsStats(0),
        getCountryStatsOfUser(),
        getGigStats(),
      ]);
      setBandsStats(bandsPage?.content ?? []);
      setHasNext(bandsPage?.hasNext ?? false);
      setCountryStats(countries ?? []);
      setGigStats(totals ?? {
        totalNumberOfGigs: 0,
        totalNumberOfGigsThisYear: 0,
        totalPrice: 0,
        priceThisYear: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreBands = async () => {
    if (!hasNext || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getBandsStats(nextPage);
      setBandsStats((current) => [...current, ...(response?.content ?? [])]);
      setPage(nextPage);
      setHasNext(response?.hasNext ?? false);
    } finally {
      setLoadingMore(false);
    }
  };

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
    <ScrollView className="flex-1 bg-night-900"
      contentContainerStyle={{ padding: 20, paddingTop: insets.top + 12, paddingBottom: 110 }}>
      <View className="mb-5 flex-row items-center justify-between">
        <View className="flex-1 pr-4">
          <Text className="mb-1 text-sm text-ink-muted">{t("highlights")}</Text>
          <Text className="font-display text-2xl text-ink">{t("statistics")}</Text>
        </View>
        <ProfileSidebar />
      </View>

      <View className="mb-4 flex-row flex-wrap justify-between gap-y-3">
        <StatTile icon="ticket-outline" value={gigStats.totalNumberOfGigs} label={t("gigsSeen")} />
        <StatTile icon="calendar-outline" value={gigStats.totalNumberOfGigsThisYear} label={t("thisYear")} />
        <StatTile icon="wallet-outline" value={formatCurrency(gigStats.totalPrice)} label={t("totalSpent")} tint="gold" />
        <StatTile icon="trending-up-outline" value={formatCurrency(gigStats.priceThisYear)} label={t("spentThisYear")} tint="gold" />
      </View>

      <RankedList title={t("topBands")} icon="musical-notes-outline"
        items={bandsStats.map((band) => ({ label: band.band, count: band.count }))}
        emptyLabel={t("noStats")} />

      {hasNext && (
        <Pressable onPress={loadMoreBands} disabled={loadingMore}
          className="mb-5 flex-row items-center justify-center rounded-xl bg-night-800 py-3">
          {loadingMore ? <ActivityIndicator color="#8B93FF" /> : <>
            <Text className="mr-2 font-display-medium text-sm text-indigo-300">{t("seeMore")}</Text>
            <Ionicons name="chevron-down" size={16} color="#8B93FF" />
          </>}
        </Pressable>
      )}

      <RankedList title={t("countries")} icon="earth-outline"
        items={countryStats.map((country) => ({ label: country.country, count: country.count }))}
        emptyLabel={t("noStats")} />
    </ScrollView>
  );
}
