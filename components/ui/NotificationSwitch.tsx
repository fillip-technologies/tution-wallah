import React from "react";
import { View, Text, Switch } from "react-native";

interface NotificationSwitchProps {
  name: string;
  description?: string;
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

export default function NotificationSwitch({
  name,
  description,
  value,
  onValueChange,
}: NotificationSwitchProps) {
  return (
    <View className="border border-bordercolor rounded-lg p-3 mb-5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-base font-bold">{name}</Text>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
      <Text className="text-xs text-gray-600 mb-1">
        {description ||
          `Reach out to other users via ${name}, directly notify about your application`}
      </Text>
    </View>
  );
}
