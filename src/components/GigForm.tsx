import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { GigFormValues } from "@/types/gig";

type Props = {
  initialValues?: GigFormValues;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: GigFormValues) => void;
};

const emptyValues: GigFormValues = {
  bands: [],
  city: "",
  venue: "",
  country: "",
  date: "",
  price: "",
};

type FieldProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "decimal-pad";
};

function Field({ label, icon, value, onChangeText, placeholder, keyboardType }: FieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
        {label}
      </Text>
      <View className="flex-row items-center rounded-xl border border-night-600 bg-night-800 px-4">
        <Ionicons name={icon} size={16} color="#5D6889" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#5D6889"
          keyboardType={keyboardType}
          className="ml-3 h-12 flex-1 text-base text-ink"
        />
      </View>
    </View>
  );
}

/**
 * Formulaire commun à "Ajouter un concert" et "Modifier un concert".
 * Dans le projet Angular, add-gigs-form et edit-gig-form dupliquaient
 * la quasi-totalité de cette logique : ici elle est factorisée.
 */
export default function GigForm({ initialValues, submitLabel, submitting, onSubmit }: Props) {
  const [values, setValues] = useState<GigFormValues>(initialValues ?? emptyValues);
  const [bandDraft, setBandDraft] = useState("");

  const addBand = () => {
    const name = bandDraft.trim();
    if (!name) return;
    setValues({ ...values, bands: [...values.bands, name] });
    setBandDraft("");
  };

  const removeBand = (index: number) => {
    setValues({ ...values, bands: values.bands.filter((_, i) => i !== index) });
  };

  const isValid =
    values.bands.length > 0 && values.city.trim().length > 0 && values.venue.trim().length > 0;

  return (
    <ScrollView
      className="flex-1 bg-night-900"
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
        Groupes / artistes
      </Text>

      {values.bands.length > 0 && (
        <View className="mb-3 flex-row flex-wrap gap-2">
          {values.bands.map((band, index) => (
            <View
              key={`${band}-${index}`}
              className="flex-row items-center rounded-full bg-indigo-500/15 py-1.5 pl-3 pr-2"
            >
              <Text className="mr-1 text-sm text-indigo-400">{band}</Text>
              <Pressable
                onPress={() => removeBand(index)}
                hitSlop={6}
                className="h-4 w-4 items-center justify-center"
              >
                <Ionicons name="close" size={13} color="#8B93FF" />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View className="mb-6 flex-row items-center rounded-xl border border-night-600 bg-night-800 px-4">
        <Ionicons name="musical-note-outline" size={16} color="#5D6889" />
        <TextInput
          value={bandDraft}
          onChangeText={setBandDraft}
          onSubmitEditing={addBand}
          returnKeyType="done"
          placeholder="Nom du groupe puis Entrée"
          placeholderTextColor="#5D6889"
          className="ml-3 h-12 flex-1 text-base text-ink"
        />
        <Pressable
          onPress={addBand}
          disabled={!bandDraft.trim()}
          hitSlop={6}
          className="h-8 w-8 items-center justify-center rounded-full bg-indigo-500"
          style={{ opacity: bandDraft.trim() ? 1 : 0.4 }}
        >
          <Ionicons name="add" size={18} color="#fff" />
        </Pressable>
      </View>

      <Field label="Ville" icon="business-outline" value={values.city} onChangeText={(city) => setValues({ ...values, city })} placeholder="Paris" />
      <Field label="Salle" icon="location-outline" value={values.venue} onChangeText={(venue) => setValues({ ...values, venue })} placeholder="Zénith, Bataclan..." />
      <Field label="Pays" icon="flag-outline" value={values.country} onChangeText={(country) => setValues({ ...values, country })} placeholder="France" />
      <Field label="Date" icon="calendar-outline" value={values.date} onChangeText={(date) => setValues({ ...values, date })} placeholder="AAAA-MM-JJ" />
      <Field
        label="Prix"
        icon="pricetag-outline"
        value={String(values.price)}
        onChangeText={(price) => setValues({ ...values, price })}
        placeholder="0"
        keyboardType="decimal-pad"
      />

      <Pressable
        onPress={() => onSubmit(values)}
        disabled={!isValid || submitting}
        className="mt-2 overflow-hidden rounded-xl active:opacity-90"
        style={{ opacity: isValid ? 1 : 0.4 }}
      >
        <LinearGradient
          colors={["#6366F1", "#4338CA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-12 flex-row items-center justify-center"
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-base font-display-semibold text-white">{submitLabel}</Text>
          )}
        </LinearGradient>
      </Pressable>
    </ScrollView>
  );
}
