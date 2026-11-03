import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Home, ClipboardList, User, Hand } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#B92124",
        tabBarInactiveTintColor: "#64748b",
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          height: 70,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              <Home color={color} size={size} fill={focused ? color : "none"} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              <ClipboardList color={color} size={size} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused, size }) => (
            <View style={styles.iconContainer}>
              <User color={color} size={size} fill={focused ? color : "none"} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
