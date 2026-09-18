import React from "react";
import { View, Text } from "react-native";

const EducationalServices = ({ services }: any) => {
  return (
    <View className="mt-6 px-5">
      <Text className="text-lg font-bold text-secondary font-serif">
        Education Services
      </Text>
      <Text className="text-sm text-tertiary mb-5">
        Give you the best services we can give.
      </Text>

      {services.map((step: any) => (
        <View key={step.id} className="flex-row items-start mb-2">
          <View className="bg-primary w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-1">
            <Text className="text-white font-bold">{step.id}</Text>
          </View>
          <View className="flex-1">
            <Text className=" font-bold text-secondary ">{step.title}</Text>
            <Text className="text-sm text-secondary">{step.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default EducationalServices;
