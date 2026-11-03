import React from "react";
import { Image, View, Text } from "react-native";
import userlogo from "@/assets/images/user.png";

const ProfileInfo = ({ user }: any) => {
  
  return (
    <View className="flex-row items-center">
      {/* <View className="p-2 border-2 border-primary rounded-full"> */}
      <View>
        <Image source={userlogo} className="w-20 h-20 rounded-full" />
      </View>

      <View className="ml-4">
        <Text className="text-xl font-bold text-secondary">{user.name}</Text>
        <Text className="text-tertiary">{user.email}</Text>
        <View className="flex-row mt-2">
          <View className="bg-primary px-3 py-1 rounded-full">
            <Text className="text-white text-xs">{user.service}</Text>
          </View>
          {/* <View className="bg-tertiary px-3 py-1 rounded-full ml-2">
            <Text className="text-white text-xs">{user.class} class</Text>
          </View> */}
        </View>
      </View>
    </View>
  );
};

export default ProfileInfo;
