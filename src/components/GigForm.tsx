import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Platform,
} from "react-native";
import type { ScrollViewInstance, TextInputInstance } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { GigFormValues } from "@/types/gig";
import { useAuth } from "@/context/AuthContext";

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

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const day = digits.slice(6, 8);

  return [year, month, day].filter(Boolean).join("-");
}

type FieldProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: "default" | "decimal-pad" | "number-pad";
  onSubmitEditing?: () => void;
  onFocus?: (input: TextInputInstance | null) => void;
};

function Field({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  onSubmitEditing,
  onFocus,
}: FieldProps) {
  const inputRef = useRef<TextInputInstance>(null);

  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-display-medium uppercase tracking-wide text-ink-faint">
        {label}
      </Text>
      <View className="flex-row items-center rounded-xl border border-night-600 bg-night-800 px-4">
        <Ionicons name={icon} size={16} color="#5D6889" />
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => onFocus?.(inputRef.current)}
          placeholder={placeholder}
          placeholderTextColor="#5D6889"
          keyboardType={keyboardType}
          onSubmitEditing={onSubmitEditing}
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
  const { t } = useAuth();
  const [values, setValues] = useState<GigFormValues>(initialValues ?? emptyValues);
  const [bandDraft, setBandDraft] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollToFocusedField = (input: TextInputInstance | null, extraOffset = 120) => {
    if (!input) return;
    scrollRef.current?.scrollResponderScrollNativeHandleToKeyboard(input, extraOffset, true);
  };

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
    <View className="flex-1 bg-night-900">
      <ScrollView
        ref={scrollRef}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, padding: 20, paddingBottom: keyboardVisible ? 240 : 20 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
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
          placeholder={t("bandPlaceholder")}
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

      <Field label={t("city")} icon="business-outline" value={values.city} onChangeText={(city) => setValues({ ...values, city })} placeholder="Paris" onFocus={scrollToFocusedField} />
      <Field label={t("venue")} icon="location-outline" value={values.venue} onChangeText={(venue) => setValues({ ...values, venue })} placeholder="Zénith, Bataclan..." onFocus={scrollToFocusedField} />
      <Field label={t("country")} icon="flag-outline" value={values.country} onChangeText={(country) => setValues({ ...values, country })} placeholder="France" onFocus={scrollToFocusedField} />
      <Field label={t("date")} icon="calendar-outline" value={values.date} onChangeText={(date) => setValues({ ...values, date: formatDateInput(date) })} placeholder="AAAA-MM-JJ" keyboardType="number-pad" onFocus={scrollToFocusedField} />
      <Field
        label={t("price")}
        icon="pricetag-outline"
        value={String(values.price)}
        onChangeText={(price) => setValues({ ...values, price: price.replace(/,/g, ".") })}
        placeholder="0"
        keyboardType="decimal-pad"
        onSubmitEditing={Keyboard.dismiss}
        onFocus={(input) => scrollToFocusedField(input, 240)}
      />

      <Pressable
        onPress={() => onSubmit({ ...values, price: values.price.replace(/,/g, ".") })}
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

      {keyboardVisible && (
        <View
          className="absolute left-0 right-0 items-end border-t border-night-600 bg-night-800 px-4 py-2"
          style={{ bottom: Platform.OS === "ios" ? keyboardHeight : 0, zIndex: 10 }}
        >
          <Pressable onPress={Keyboard.dismiss} className="px-3 py-1">
            <Text className="font-display-semibold text-indigo-400">{t("keyboardDone")}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
