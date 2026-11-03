import React from "react";
import { View, Text, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import StudyTipsCard from "@/components/ui/StudyTipsCard";

const ExamTipsCarousel = ({ tips, heading }: any) => {
  return (
    <View className="mt-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-secondary text-lg font-serif font-bold">{heading}</Text>
        <AntDesign name="bulb" size={20} color="#FF7E55" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="gap-3"
      >
        {tips.map((tip: any, idx: any) => (
          <StudyTipsCard key={idx} tip={tip} />
        ))}
      </ScrollView>
    </View>
  );
};

export default ExamTipsCarousel;
