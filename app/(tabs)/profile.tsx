import { View, Text, Image, TouchableOpacity, ScrollView} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
  const user = {
    name: "Mohit Kumar",
    email: "mohitfillip@gmail.com",
    studentId: "ST20230045",
    subject: "Science",
    class: "10th",
    avatar: "https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png",
    coursesEnrolled: 6,
    ongoingCourses: 3,
    completedCourses: 10,
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: "#ffffff" }}>
      {/* Header */}
      <View className="px-6 pt-5 pb-6 bg-white">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-secondary">My Profile</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#303841" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="flex-row items-center">
          <View className="p-2 border-2 border-primary">
            <Image
            source={{ uri: user.avatar }}
            className="w-20 h-20 "
          />
          </View>
          
          <View className="ml-4">
            <Text className="text-xl font-bold text-secondary">
              {user.name}
            </Text>
            <Text className="text-tertiary">{user.email}</Text>
            <View className="flex-row mt-2">
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-white text-xs">{user.subject}</Text>
              </View>
              <View className="bg-tertiary px-3 py-1 rounded-full ml-2">
                <Text className="text-white text-xs">{user.class} class</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="px-6 mt-6">
        <View className="flex-row justify-between">
          <View className="bg-[#FFE4D6] p-4 rounded-2xl shadow-md w-[30%] items-center">
            <Ionicons name="play-circle-outline" size={28} color="#FF7E55" />
            <Text className="text-[#A35200] mt-2 text-md font-semibold">
              {user.ongoingCourses}
            </Text>
            <Text className="text-gray-600 text-sm mt-1">Ongoing</Text>
          </View>

          <View className="bg-[#E6F4EA] p-4 rounded-2xl shadow-md w-[30%] items-center">
            <Ionicons name="book-outline" size={28} color="#34A853" />
            <Text className="text-[#1B6F31] mt-2 text-md font-semibold">
              {user.coursesEnrolled}
            </Text>
            <Text className="text-gray-600 text-sm mt-1">Enrolled</Text>
          </View>

          <View className="bg-[#E4E9FB] p-4 rounded-2xl shadow-md w-[30%] items-center">
            <Ionicons name="checkmark-done-outline" size={28} color="#4285F4" />
            <Text className="text-[#1A50A1] mt-2 text-md font-semibold">
              {user.completedCourses}
            </Text>
            <Text className="text-gray-600 text-sm mt-1">Completed</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="px-6 mt-8">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity className="bg-white w-[48%] p-5 rounded-2xl shadow-md mb-4 items-center">
            <View className="bg-[#FF7E55]/20 p-3 rounded-full mb-2">
              <Ionicons name="card-outline" size={24} color="#FF7E55" />
            </View>
            <Text className="text-gray-700 font-medium">Payments</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white w-[48%] p-5 rounded-2xl shadow-md mb-4 items-center">
            <View className="bg-[#FF7E55]/20 p-3 rounded-full mb-2">
              <Ionicons name="help-circle-outline" size={24} color="#FF7E55" />
            </View>
            <Text className="text-gray-700 font-medium">Support</Text>
          </TouchableOpacity>

          
        </View>
      </View>

      {/* Achievements Section */}
      <View className="px-6 mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Achievements
        </Text>
        <View className="bg-white p-5 rounded-2xl shadow-md">
          <Text className="text-gray-600 mb-2">🏅 Completed 10 Courses</Text>
          <Text className="text-gray-600 mb-2">
            📈 Consistent Top Performer in Science
          </Text>
          <Text className="text-gray-600">🎯 95% Attendance</Text>
        </View>
      </View>

      {/* Recent Activity Section */}
      <View className="px-6 mt-6 mb-12">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </Text>
        <View className="bg-white p-5 rounded-2xl shadow-md">
          <View className="flex-row items-center mb-3">
            <MaterialCommunityIcons
              name="book-open-outline"
              size={20}
              color="#FF7E55"
            />
            <Text className="ml-2 text-gray-700">
              Enrolled in Physics Basics
            </Text>
          </View>
          <View className="flex-row items-center mb-3">
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color="#34A853"
            />
            <Text className="ml-2 text-gray-700">
              Completed Chemistry Advanced
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#4285F4" />
            <Text className="ml-2 text-gray-700">Updated Profile Info</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
