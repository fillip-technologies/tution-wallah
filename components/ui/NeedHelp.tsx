import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const NeedHelp = () => {
  return (
    <View className="bg-primary mb-8 p-4 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white text-lg font-bold">Need Guidance?</Text>
        <Text className="text-white text-sm mt-1">
          Connect with our experts for study plans and queries.
        </Text>
      </View>
      <TouchableOpacity className="bg-white px-4 py-2 rounded-lg ml-4">
        <Text className="text-primary font-bold">Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NeedHelp;
