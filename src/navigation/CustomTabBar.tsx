import React from "react";
import { View, Pressable, Text } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICONS: Record<string, { active: any; inactive: any; label: string }> = {
  Dashboard: { active: "home", inactive: "home-outline", label: "Accueil" },
  Stats: { active: "stats-chart", inactive: "stats-chart-outline", label: "Stats" },
};

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute inset-x-5 flex-row items-center justify-between rounded-[28px] border border-night-700 bg-night-800 px-4"
      style={{ bottom: insets.bottom -16, height: 68 }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        if (route.name === "AddGig") {
          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className="-top-6 active:opacity-90"
              hitSlop={8}
            >
              <LinearGradient
                colors={["#8B93FF", "#6366F1"]}
                className="h-16 w-16 items-center justify-center rounded-full"
                style={{
                  shadowColor: "#6366F1",
                  shadowOpacity: 0.5,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 8,
                }}
              >
                <Ionicons name="add" size={30} color="#fff" />
              </LinearGradient>
            </Pressable>
          );
        }

        const meta = ICONS[route.name];
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className="flex-1 items-center justify-center py-2"
          >
            <Ionicons
              name={isFocused ? meta.active : meta.inactive}
              size={22}
              color={isFocused ? "#8B93FF" : "#5D6889"}
            />
            <Text
              className={`mt-1 text-[11px] ${
                isFocused ? "font-display-medium text-indigo-400" : "text-ink-faint"
              }`}
            >
              {meta.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
