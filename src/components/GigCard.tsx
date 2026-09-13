import React from "react";
import { View, Text, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Gig } from "@/types/gig";

type Props = {
  gig: Gig;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

/**
 * Sur desktop l'app Angular affichait un tableau (<table>) ; sur mobile
 * une carte est bien plus lisible qu'un tableau qui obligerait à scroller
 * horizontalement. Les mêmes informations restent affichées.
 */
export default function GigCard({ gig, onEdit, onDelete }: Props) {
  return (
    <View className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-base font-bold text-dark">{gig.bands?.join(", ")}</Text>
          <Text className="mt-1 text-sm text-gray-600">
            {gig.venue} · {gig.city}, {gig.country}
          </Text>
          <View className="mt-2 flex-row flex-wrap items-center">
            <Text className="mr-4 text-sm text-gray-500">{gig.date}</Text>
            <Text className="text-sm font-semibold text-primary">{gig.price} €</Text>
          </View>
        </View>
        <View className="flex-row">
          <Pressable
            onPress={() => onEdit(gig.id)}
            className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            <FontAwesome5 name="pen" size={14} color="#0056b3" />
          </Pressable>
          <Pressable
            onPress={() => onDelete(gig.id)}
            className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            <FontAwesome5 name="trash-alt" size={14} color="#f20202" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
