import React from "react";
import { View, Text, ScrollView } from "react-native";

interface ClassType {
  id: number;
  name: string;
  count: number;
}

interface Props {
  classes: ClassType[];
  title?: string;
}

export default function ClassCards({
  classes,
  title = "Students by Class",
}: Props) {
  return (
    <View className="mt-6 px-5">
      <Text className="text-lg font-bold font-serif text-secondary mb-4">{title}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {classes.map((cls) => (
          <View
            key={cls.id}
            className="mr-4 px-5 py-6 rounded-2xl w-40 items-center border border-gray-100 bg-[#F9FAFB]"
          >
            <Text className="text-lg font-extrabold text-primary">
              {cls.count}
            </Text>

            <Text className="text-base font-medium text-secondary mt-1">
              {cls.name}
            </Text>

            <Text className="text-xs text-gray-400 mt-2">
              Students Enrolled
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
