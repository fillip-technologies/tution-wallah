import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

interface QuickActionCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap; // restricts to valid Ionicons
  color: string;
  onPress?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white w-[48%] p-5 rounded-2xl shadow-md items-center"
    >
      <View className="p-3 rounded-full mb-2" style={{ backgroundColor: `${color}20` }}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text className="text-gray-700 font-medium">{title}</Text>
    </TouchableOpacity>
  );
};

export default QuickActionCard;
