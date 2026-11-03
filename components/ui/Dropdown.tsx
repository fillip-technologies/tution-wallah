import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  Controller,
  useFormContext,
} from "react-hook-form";

interface DropdownProps {
  name: string;
  // control: Control<FieldValues>;
  label: string;
  items: string[];
}

export default function Dropdown({ name, items, label }: DropdownProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <View className="border border-gray-300 rounded-lg mb-3 overflow-hidden">
          <Picker
            selectedValue={typeof value === "string" ? value.toLowerCase() : value}
            style={{ color: "#303841" }}
            dropdownIconColor="#303841"
            onValueChange={onChange}
          >
            <Picker.Item label={label} value="" />
            {items.map((i, idx) => (
              <Picker.Item key={idx} label={i} value={i.toLowerCase()} />
            ))}
          </Picker>
        </View>
      )}
    />
  );
}
