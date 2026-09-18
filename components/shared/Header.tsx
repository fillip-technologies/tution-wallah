import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SearchBar } from "@/components/ui";
import { useUserLocation } from "@/hooks";
import { useEffect, useState } from "react";

interface HeaderProps {
  notification?: boolean;
  search?: boolean;
}

export default function Header({
  notification = true,
  search = true,
}: HeaderProps) {
  const [greeting, setGreeting] = useState("");
  const router = useRouter();
  const userCity = useUserLocation();

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();

      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else if (hour >= 17 && hour < 21) {
        setGreeting("Good Evening");
      } else {
        setGreeting("Good Night");
      }
    };

    updateGreeting();

    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LinearGradient colors={["#ffffff", "#f8fafc"]} className="px-5 pt-5 pb-6">
      <View
        className={`flex-row justify-between items-center ${
          search ? "mb-6" : ""
        }`}
      >
        <View className="flex-1">
          <Text className="text-tertiary text-sm font-medium">
            {greeting} 👋
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-sharp" size={18} color="#B92124" />
            <Text className="text-xl font-bold ml-2 text-secondary">
              {userCity}, India
            </Text>
          </View>
        </View>

        {notification && (
          <TouchableOpacity
            className="bg-orange-100 p-3 rounded-full shadow-sm border border-orange-100 relative"
            onPress={() => router.push("/others/Notification")}
          >
            <Ionicons name="notifications-outline" size={20} color="#FF7E55" />
            <View className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full" />
          </TouchableOpacity>
        )}
      </View>

      {search && (
        <SearchBar
          onFocus={() =>
            setTimeout(() => {
              router.push("/student/searching");
            }, 200)
          }
        />
      )}
    </LinearGradient>
  );
}
