import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

const StudyTipsCard = ({ tip }: any) => {
  return (
    <View className="bg-orange-50 p-5 rounded-xl w-64 shadow-sm mr-2">
      <View className="flex-row items-center mb-3 gap-2">
        <Feather name={tip.icon} size={18} color="#FF7E55" />
        <Text className="text-secondary text-lg">{tip.title}</Text>
      </View>
      <Text className="text-gray-500 text-sm mt-1">{tip.desc}</Text>
    </View>
  );
};

export default StudyTipsCard;
