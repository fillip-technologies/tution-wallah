import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface StatCardProps {
  value: number | string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bgColor: string;
  textColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  iconColor,
  bgColor,
  textColor,
}) => {
  return (
    <View
      className="p-4 rounded-2xl shadow-md w-[30%] items-center"
      style={{ backgroundColor: bgColor }}
    >
      <Ionicons name={icon} size={28} color={iconColor} />
      <Text
        className="mt-2 text-md font-semibold"
        style={{ color: textColor }}
      >
        {value}
      </Text>
      <Text className="text-gray-600 text-sm mt-1 text-center">{label}</Text>
    </View>
  );
};

export default StatCard;
