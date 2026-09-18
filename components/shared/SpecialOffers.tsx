import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
  title: string;
  subtitle: string;
  desc: string;
  btntext: string;
  heading?: string;
}

const SpecialOffers = ({ title, subtitle, desc, btntext, heading }: Props) => {
  const router = useRouter();
  const handlelogin = () => {
    if (btntext === "Sign Up") {
      router.push("/userflow");
    }
  };
  return (
    <View className="mt-6 px-5">
      {heading && (
        <Text className="text-lg font-serif font-bold text-secondary mb-4">
          {heading}
        </Text>
      )}
      <LinearGradient
        colors={["#B92124", "#C83A3D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 rounded-2xl"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white font-bold text-2xl">{title}</Text>
            <Text className="text-white/90 mt-1 text-base">{subtitle}</Text>
            {/* <Text className="text-white/80 text-sm mt-3">{desc}</Text> */}
            <TouchableOpacity
              className="bg-white/20 self-start px-4 py-2 rounded-full mt-4"
              onPress={handlelogin}
            >
              <Text className="text-white font-medium">{btntext}</Text>
            </TouchableOpacity>
          </View>
          <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="gift-outline" size={32} color="white" />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default SpecialOffers;
