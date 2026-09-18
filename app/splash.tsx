import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import logo from "@/assets/images/splash-logo.png";
import logo1 from "@/assets/images/image-2.png";
import logo2 from "@/assets/images/Student-mobile-app (1).png";
import logo3 from "@/assets/images/LOGO-VAN-VENU.jpg";

// import Button from "@/components/ui/Button";
import { Button } from "@/components/ui/index";

const Splash = () => {
  const router = useRouter();
  // const handleGetStarted = () => {
  //   router.replace("/login" as any);
  // };
  return (
    <View className="flex-1 bg-white items-center justify-center px-8">
      {/* Centered Image */}
      <Image source={logo2} style={{ width: "80%", height: "100%" }} />
      {/* <Image source={logo3} className="object-cover" /> */}

      {/* Button Pinned to Bottom */}
      {/* <View className="absolute bottom-10 w-full items-center">
        <TouchableOpacity
          className="bg-primary py-4 px-20 rounded-full shadow-md shadow-primary"
          activeOpacity={0.7}
          onPress={handleGetStarted}
        >
          <Text className="text-white text-base font-semibold">
            Get Started
          </Text>
        </TouchableOpacity>
      </View> */}

      <View className="absolute bottom-10 w-full items-center">
        <Button title="Get Started" onPress={() => router.push("/userflow")} />
      </View>
    </View>
  );
};

export default Splash;
