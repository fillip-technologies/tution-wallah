import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";

interface LocationInputProps {
  value: string;
  placeholder?: string;
}

export default function LocationInput({
  value,
  placeholder,
}: LocationInputProps) {
  return (
    <View className="w-full border border-bordercolor mb-3 flex-row items-center px-3 py-1 rounded-lg">
      <TextInput
        className="flex-1 text-[#1c1c1c] text-lg"
        placeholderTextColor="#9e9e9e"
        placeholder={placeholder}
        value={value}
      />
      <TouchableOpacity>
        <MapPin size={24} color="#9e9e9e" />
      </TouchableOpacity>
    </View>
  );
}
