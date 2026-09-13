import React from "react";
import { View, Text } from "react-native";

type Props = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function StatBlock({ title, children, className }: Props) {
  return (
    <View className={`mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className ?? ""}`}>
      <Text className="mb-2 text-base font-bold text-dark">{title}</Text>
      {children}
    </View>
  );
}
