import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const router = useRouter();

  // Example fetched notifications (replace with your API data)
  const notifications = [
    {
      id: 1,
      title: "Syllabus Updated",
      description: "Class 10 Maths syllabus has new chapters.",
      time: "2 hours ago",
      type: "info",
    },
    {
      id: 2,
      title: "Registration Reminder",
      description: "Olympiad registrations close tomorrow.",
      time: "6 hours ago",
      type: "alert",
    },
    {
      id: 3,
      title: "Welcome to App!",
      description: "We’re glad you joined. Let’s get started.",
      time: "1 day ago",
      type: "success",
    },
  ];

  // Type-based colors/icons
  const typeColors = {
    info: "#3B82F6", // blue
    alert: "#EF4444", // red
    success: "#10B981", // green
    general: "#F59E0B", // orange
  };

  const typeIcons = {
    info: "information-circle-outline",
    alert: "alert-circle-outline",
    success: "checkmark-circle-outline",
    general: "notifications-outline",
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              className="mr-3 p-2 -ml-2"
              onPress={() => router.push("/(tabs)")}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">
              Notifications
            </Text>
          </View>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons
              name="notifications-off-outline"
              size={64}
              color="#D1D5DB"
            />
            <Text className="text-lg font-medium text-gray-500 mt-4">
              No notifications
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
              {activeTab === "unread"
                ? "You're all caught up!"
                : "You don't have any notifications yet"}
            </Text>
          </View>
        ) : (
          notifications.map((item) => (
            <View
              key={item.id}
              className="bg-white mb-4 overflow-hidden rounded-lg shadow-lg border border-primary"
            >
              <View className="flex-row items-start p-4">
                <View className="flex-1">
                  <Text className="text-gray-600 mt-1">{item.description}</Text>
                  <Text className="text-xs text-gray-400 mt-2">
                    {item.time}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationPage;
