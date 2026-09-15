import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Item = { label: string; count: number };

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: Item[];
  emptyLabel: string;
};

const RANK_COLORS = ["#F5B942", "#C7CEDD", "#D08A5A"]; // or / argent / bronze

export default function RankedList({ title, icon, items, emptyLabel }: Props) {
  return (
    <View className="mb-4 rounded-2xl border border-night-700 bg-night-800 p-4">
      <View className="mb-3 flex-row items-center">
        <Ionicons name={icon} size={15} color="#8B93FF" />
        <Text className="ml-2 font-display-semibold text-sm text-ink">{title}</Text>
      </View>

      {items.length === 0 ? (
        <Text className="text-sm text-ink-faint">{emptyLabel}</Text>
      ) : (
        items.map((item, index) => (
          <View
            key={`${item.label}-${index}`}
            className={`flex-row items-center py-2 ${
              index < items.length - 1 ? "border-b border-night-700" : ""
            }`}
          >
            <View
              className="mr-3 h-6 w-6 items-center justify-center rounded-full"
              style={{
                backgroundColor: index < 3 ? `${RANK_COLORS[index]}26` : "#1B2540",
              }}
            >
              <Text
                className="text-[11px] font-display-semibold"
                style={{ color: index < 3 ? RANK_COLORS[index] : "#5D6889" }}
              >
                {index + 1}
              </Text>
            </View>
            <Text className="flex-1 text-sm text-ink" numberOfLines={1}>
              {item.label}
            </Text>
            <Text className="text-xs text-ink-muted">×{item.count}</Text>
          </View>
        ))
      )}
    </View>
  );
}
