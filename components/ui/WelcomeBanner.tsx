import React from "react";
import { View, Text } from "react-native";

interface WelcomeBannerProps {
  title?: string;
  subTitle?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ title, subTitle }) => {
  return (
    <View className="mt-4 bg-primary p-4 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white text-lg font-bold">
          {title || "Welcome Learners 👋"}
        </Text>
        <Text className="text-white text-sm mt-1">
          {subTitle ||
            "Select your class to download the latest official CBSE syllabus."}
        </Text>
      </View>
    </View>
  );
};

export default WelcomeBanner;
