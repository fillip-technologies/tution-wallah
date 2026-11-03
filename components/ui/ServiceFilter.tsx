import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { instituteType } from "@/constants/institute";

export type ServiceFilterValue = "all" | string;

interface Props {
  value: ServiceFilterValue;
  onChange: (value: ServiceFilterValue) => void;
}

/** "All" + the two institute service types (Home Tuition / Coaching). */
export default function ServiceFilter({ value, onChange }: Props) {
  const options: { key: ServiceFilterValue; label: string }[] = [
    { key: "all", label: "All" },
    ...instituteType.map((t) => ({ key: t.toLowerCase(), label: t })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 8 }}
    >
      {options.map((o) => {
        const active = value === o.key;
        return (
          <TouchableOpacity
            key={o.key}
            onPress={() => onChange(o.key)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: active ? "#B92124" : "#e2e8f0",
              backgroundColor: active ? "#B92124" : "#fff",
            }}
          >
            <Text style={{ color: active ? "#fff" : "#475569", fontWeight: "600", fontSize: 13 }}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

/** Case-insensitive match on the institute's `service` field. */
export const matchesService = (item: any, filter: ServiceFilterValue) =>
  filter === "all" ||
  String(item?.service ?? "").trim().toLowerCase() === filter;
