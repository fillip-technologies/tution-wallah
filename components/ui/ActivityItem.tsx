import React from "react";
import { View, Text } from "react-native";

interface ActivityItemProps {
  title: string;
  time: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ title, time }) => {
  return (
    <View className="mb-4 pl-3 border-l-4 border-primary bg-gray-100 p-2 rounded-md">
      <Text className="text-gray-800 font-medium text-sm">{title}</Text>
      <Text className="text-gray-400 text-xs mt-1">{time}</Text>
    </View>
  );
};

export default ActivityItem;
