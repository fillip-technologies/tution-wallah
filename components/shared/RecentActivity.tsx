import React from "react";
import { View, Text } from "react-native";
import ActivityItem from "../ui/ActivityItem";

interface Activity {
  title: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <View className="px-6 mt-6">
      <Text className="text-lg font-bold text-secondary font-serif mb-4">
        Recent Activity
      </Text>
      <View className="">
        {activities.map((item, index) => (
          <ActivityItem key={index} title={item.title} time={item.time} />
        ))}
      </View>
    </View>
  );
};

export default RecentActivity;
