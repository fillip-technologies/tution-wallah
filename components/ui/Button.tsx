import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
}

export default function Button({
  title,
  onPress,
  className = "",
  textClassName = "",
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-primary w-full py-4 rounded-full items-center mb-6 ${className}`}
      onPress={onPress}
    >
      <Text className={`text-lg text-white font-medium ${textClassName}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
