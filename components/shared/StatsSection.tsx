import React from "react";
import { View } from "react-native";
import StatCard from "@/components/ui/StatCard";

interface StatsSectionProps {
  stats: {
    value: number | string;
    label: string;
    icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
    iconColor: string;
    bgColor: string;
    textColor: string;
  }[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <View className="px-6 mt-6">
      <View className="flex-row justify-between">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            value={item.value}
            label={item.label}
            icon={item.icon}
            iconColor={item.iconColor}
            bgColor={item.bgColor}
            textColor={item.textColor}
          />
        ))}
      </View>
    </View>
  );
};

export default StatsSection;
