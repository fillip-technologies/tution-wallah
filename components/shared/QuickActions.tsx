import { View, Text } from "react-native";
import React from "react";
import QuickActionCard from "@/components/ui/QuickActionCard";

const QuickActions = () => {
  const actions = [
    { title: "Payments", icon: "card-outline", color: "#FF7E55" },
    { title: "Support", icon: "help-circle-outline", color: "#FF7E55" },
  ];

  return (
    <View className="px-6 mt-6">
      <Text className="text-lg font-bold text-secondary font-serif mb-4">
        Quick Actions
      </Text>

      <View className="flex-row flex-wrap justify-between">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            title={action.title}
            icon={action.icon as any}
            color={action.color}
            onPress={() => console.log(`${action.title} clicked`)}
          />
        ))}
      </View>
    </View>
  );
};

export default QuickActions;
