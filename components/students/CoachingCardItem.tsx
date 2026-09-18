import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import CoachingCard from "../ui/CoachingCard";
import { useRouter } from "expo-router";

interface CoachingCardItemProps {
  centers: any[];
  onCardPress?: (id: number, center?: any) => void;
  loading?: boolean;
}

export default function CoachingCardItem({
  centers = [],
  onCardPress,
  loading = false,
}: CoachingCardItemProps) {
  const router = useRouter();
  const safeCenters = Array.isArray(centers) ? centers : [];

  return (
    <View className="mt-6 px-5">
      <View className="flex-row justify-between items-center mb-5">
        <View>
          <Text className="text-lg font-serif font-bold text-secondary">
            Popular Near You
          </Text>
          <Text className="text-sm text-tertiary mt-1">
            Based on your location
          </Text>
        </View>
        <TouchableOpacity
          className="bg-primary px-4 py-2 rounded-full"
          onPress={() => router.push("/student/searching")}
        >
          <Text className="text-white font-medium text-sm">See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="py-8 items-center justify-center">
          <ActivityIndicator size="small" color="#B92124" />
          <Text className="text-xs text-tertiary mt-2">Loading coaching centers...</Text>
        </View>
      ) : safeCenters.length === 0 ? (
        <View className="bg-gray-50 p-5 rounded-xl border border-gray-100 items-center justify-center mb-3">
          <Text className="text-sm font-semibold text-secondary text-center">
            No coaching centers found in this location
          </Text>
          <Text className="text-xs text-tertiary text-center mt-1">
            Explore all available institutes across other locations
          </Text>
          <TouchableOpacity
            className="mt-3 bg-primary px-4 py-2 rounded-full"
            onPress={() => router.push("/student/searching")}
          >
            <Text className="text-white text-xs font-medium">Explore All</Text>
          </TouchableOpacity>
        </View>
      ) : (
        safeCenters.slice(0, 5).map((center: any) => (
          <CoachingCard
            key={center.id}
            center={center}
            onPress={() =>
              onCardPress
                ? onCardPress(center.id, center)
                : router.push({
                    pathname: "/course/[id]",
                    params: {
                      id: String(center.id),
                      phone: center?.phone || "",
                      address: center?.full_address || center?.address || "",
                      city: center?.city || "",
                      pincode: center?.pincode || "",
                      state: center?.state || "",
                      name: center?.name || "",
                    },
                  })
            }
          />
        ))
      )}
    </View>
  );
}
