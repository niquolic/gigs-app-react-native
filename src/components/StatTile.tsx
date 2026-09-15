import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  tint?: "indigo" | "gold";
};

export default function StatTile({ icon, value, label, tint = "indigo" }: Props) {
  const tintColor = tint === "gold" ? "#F5B942" : "#8B93FF";
  const tintBg = tint === "gold" ? "bg-gold-400/15" : "bg-indigo-500/15";

  return (
    <View className="w-[48%] rounded-2xl border border-night-700 bg-night-800 p-4">
      <View className={`mb-3 h-9 w-9 items-center justify-center rounded-full ${tintBg}`}>
        <Ionicons name={icon} size={17} color={tintColor} />
      </View>
      <Text className="font-display text-2xl text-ink">{value}</Text>
      <Text className="mt-0.5 text-xs text-ink-muted">{label}</Text>
    </View>
  );
}
