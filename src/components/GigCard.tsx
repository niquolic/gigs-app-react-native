import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Gig } from "@/types/gig";

type Props = {
  gig: Gig;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

const MONTHS = [
  "JANV",
  "FÉVR",
  "MARS",
  "AVR",
  "MAI",
  "JUIN",
  "JUIL",
  "AOÛT",
  "SEPT",
  "OCT",
  "NOV",
  "DÉC",
];

function formatDateStub(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { day: "–", month: "", year: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: MONTHS[d.getMonth()],
    year: String(d.getFullYear()),
  };
}

/**
 * Carte façon ticket de concert : souche-date à gauche, ligne pointillée de
 * "déchirure", encoches sur les bords. Choix délibéré pour coller au sujet
 * (une app de suivi de concerts) plutôt qu'une carte générique.
 */
export default function GigCard({ gig, onEdit, onDelete }: Props) {
  const { day, month, year } = formatDateStub(gig.date);

  return (
    <View className="relative mb-4">
      {/* Encoches façon ticket, sur les bords gauche/droit */}
      <View className="absolute -left-2 top-1/2 -mt-2 z-10 h-4 w-4 rounded-full bg-night-900" />
      <View className="absolute -right-2 top-1/2 -mt-2 z-10 h-4 w-4 rounded-full bg-night-900" />

      <Pressable
        onPress={() => onEdit(gig.id)}
        className="flex-row overflow-hidden rounded-2xl border border-night-700 bg-night-800 active:opacity-90"
      >
        {/* Souche : date */}
        <View className="w-20 items-center justify-center bg-night-700/50 py-4">
          <Text className="font-display text-2xl text-ink">{day}</Text>
          <Text className="mt-0.5 text-[11px] font-display-medium tracking-wide text-indigo-400">
            {month}
          </Text>
          <Text className="mt-1 text-[10px] text-ink-faint">{year}</Text>
        </View>

        {/* Ligne de déchirure */}
        <View className="self-stretch border-l border-dashed border-night-600" />

        {/* Contenu */}
        <View className="flex-1 px-4 py-3">
          <View className="flex-row items-start justify-between">
            <Text className="mr-2 flex-1 text-base font-display-semibold text-ink" numberOfLines={2}>
              {gig.bands?.join(", ")}
            </Text>
            <Pressable
              onPress={() => onDelete(gig.id)}
              hitSlop={8}
              className="h-7 w-7 items-center justify-center rounded-full bg-night-700"
            >
              <Ionicons name="trash-outline" size={14} color="#F2545B" />
            </Pressable>
          </View>

          <View className="mt-1.5 flex-row items-center">
            <Ionicons name="location-outline" size={13} color="#98A2BE" />
            <Text className="ml-1 flex-1 text-sm text-ink-muted" numberOfLines={1}>
              {gig.venue} · {gig.city}, {gig.country}
            </Text>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center rounded-full bg-gold-400/15 px-2.5 py-1">
              <Ionicons name="pricetag-outline" size={12} color="#F5B942" />
              <Text className="ml-1 text-xs font-display-medium text-gold-400">
                {gig.price} €
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#5D6889" />
          </View>
        </View>
      </Pressable>
    </View>
  );
}
