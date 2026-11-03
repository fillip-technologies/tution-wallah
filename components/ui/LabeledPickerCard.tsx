import React from "react";
import { View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Feather } from "@expo/vector-icons";

interface LabeledPickerCardProps {
  label: string;
  iconName?: React.ComponentProps<typeof Feather>["name"];
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: string[];
}

const LabeledPickerCard: React.FC<LabeledPickerCardProps> = ({
  label,
  iconName = "book",
  selectedValue,
  onValueChange,
  options,
}) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm">
      <View className="flex-row items-center mb-3">
        <Feather name={iconName} size={20} color="#FF7E55" />
        <Text className="text-secondary font-semibold ml-2">{label}</Text>
      </View>
      <View className="border border-gray-200 rounded-lg overflow-hidden">
        <Picker
          selectedValue={selectedValue}
          style={{ color: "#303841" }}
          dropdownIconColor="#303841"
          onValueChange={onValueChange}
        >
          <Picker.Item label={`${label.toLowerCase()}`} value="" />
          {options.map((option, index) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default LabeledPickerCard;
