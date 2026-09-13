import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { GigFormValues } from "@/types/gig";

type Props = {
  initialValues?: GigFormValues;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (values: GigFormValues) => void;
};

const emptyValues: GigFormValues = {
  bands: [""],
  city: "",
  venue: "",
  country: "",
  date: "",
  price: "",
};

/**
 * Formulaire commun à "Ajouter un concert" et "Modifier un concert".
 * Dans le projet Angular, add-gigs-form et edit-gig-form dupliquaient
 * la quasi-totalité de cette logique : ici elle est factorisée.
 */
export default function GigForm({ initialValues, submitLabel, submitting, onSubmit }: Props) {
  const [values, setValues] = useState<GigFormValues>(initialValues ?? emptyValues);

  const updateBand = (index: number, text: string) => {
    const bands = [...values.bands];
    bands[index] = text;
    setValues({ ...values, bands });
  };

  const addBand = () => {
    setValues({ ...values, bands: [...values.bands, ""] });
  };

  const removeBand = (index: number) => {
    if (values.bands.length === 1) return;
    setValues({ ...values, bands: values.bands.filter((_, i) => i !== index) });
  };

  const isValid =
    values.bands.some((b) => b.trim().length > 0) &&
    values.city.trim().length > 0 &&
    values.venue.trim().length > 0;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 20 }}>
      <Text className="mb-1 text-lg font-bold text-dark">Groupe(s) / Artiste(s)</Text>
      {values.bands.map((band, index) => (
        <View key={index} className="mb-2 flex-row items-center">
          <TextInput
            value={band}
            onChangeText={(text) => updateBand(index, text)}
            placeholder="Groupe/Artiste"
            className="mr-2 h-11 flex-1 rounded-lg border border-gray-300 px-3 text-base"
          />
          {values.bands.length > 1 && (
            <Pressable
              onPress={() => removeBand(index)}
              className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
            >
              <FontAwesome5 name="trash-alt" size={13} color="#f20202" />
            </Pressable>
          )}
        </View>
      ))}
      <Pressable onPress={addBand} className="mb-5 flex-row items-center self-start">
        <FontAwesome5 name="plus" size={12} color="#0056b3" />
        <Text className="ml-2 text-primary-dark">Ajouter un groupe</Text>
      </Pressable>

      <Text className="mb-1 text-sm text-gray-500">Ville</Text>
      <TextInput
        value={values.city}
        onChangeText={(city) => setValues({ ...values, city })}
        placeholder="Ville"
        className="mb-4 h-11 rounded-lg border border-gray-300 px-3 text-base"
      />

      <Text className="mb-1 text-sm text-gray-500">Lieu</Text>
      <TextInput
        value={values.venue}
        onChangeText={(venue) => setValues({ ...values, venue })}
        placeholder="Lieu"
        className="mb-4 h-11 rounded-lg border border-gray-300 px-3 text-base"
      />

      <Text className="mb-1 text-sm text-gray-500">Pays</Text>
      <TextInput
        value={values.country}
        onChangeText={(country) => setValues({ ...values, country })}
        placeholder="Pays"
        className="mb-4 h-11 rounded-lg border border-gray-300 px-3 text-base"
      />

      <Text className="mb-1 text-sm text-gray-500">Date (AAAA-MM-JJ)</Text>
      <TextInput
        value={values.date}
        onChangeText={(date) => setValues({ ...values, date })}
        placeholder="2026-09-13"
        className="mb-4 h-11 rounded-lg border border-gray-300 px-3 text-base"
      />

      <Text className="mb-1 text-sm text-gray-500">Prix</Text>
      <TextInput
        value={String(values.price)}
        onChangeText={(price) => setValues({ ...values, price })}
        placeholder="Prix"
        keyboardType="decimal-pad"
        className="mb-6 h-11 rounded-lg border border-gray-300 px-3 text-base"
      />

      <Pressable
        onPress={() => onSubmit(values)}
        disabled={!isValid || submitting}
        className={`h-12 items-center justify-center rounded-lg ${
          isValid ? "bg-primary" : "bg-gray-300"
        }`}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-base font-semibold text-white">{submitLabel}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}
