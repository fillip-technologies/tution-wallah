import logo from "@/assets/images/tutionwala.png";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Index() {
  const router = useRouter();

  const handleGetStarted = async () => {
    router.replace("/userflow");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGetStarted();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Animatable.Image
        animation="fadeIn"
        duration={3000}
        source={logo}
        className="w-3/5"
        resizeMode="contain"
      />
    </View>
  );
}
