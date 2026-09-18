import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import userlogo from "@/assets/images/user.png";

interface StudentProfileInfoProps {
  user: {
    name?: string;
    email?: string;
    studentId?: string;
    education_level?: string;
    subjects?: string;
    target_exam?: string;
    status?: string;
    image?: any;
    phone?: string;
    city?: string;
  };
  onEditPress?: () => void;
}

const StudentProfileInfo: React.FC<StudentProfileInfoProps> = ({
  user,
  onEditPress,
}) => {
  const formatText = (val?: string | null) => {
    if (!val || !val.trim()) return null;
    return val
      .split(" ")
      .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  const formattedClass = formatText(user.education_level);
  const formattedSubject = formatText(user.subjects);
  const formattedExam = formatText(user.target_exam);

  return (
    <View className="bg-white">
      {/* Horizontal Profile Header: Avatar + Info */}
      <View className="flex-row items-center">
        {/* Clean Avatar */}
        <View className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
          <Image
            source={
              user.image
                ? typeof user.image === "string"
                  ? { uri: user.image }
                  : user.image
                : userlogo
            }
            className="w-full h-full"
            resizeMode={user.image ? "cover" : "contain"}
          />
        </View>

        {/* Student Name, Email, Phone, Status & ID */}
        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-secondary" numberOfLines={1}>
            {user.name || "Student"}
          </Text>

          <Text className="text-tertiary text-xs mt-0.5" numberOfLines={1}>
            {user.email || "No email"}
          </Text>

          {user.phone ? (
            <Text className="text-tertiary text-xs mt-0.5 font-medium">
              {user.phone}
            </Text>
          ) : null}

          {/* Quick Status & ID Badges */}
          <View className="flex-row items-center mt-2 gap-2 flex-wrap">
            {user.studentId ? (
              <View className="bg-gray-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-gray-700 text-[11px] font-semibold">
                  {user.studentId}
                </Text>
              </View>
            ) : null}

            <View className="bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
              <Text className="text-green-700 text-[10px] font-bold">
                {user.status ? user.status.toUpperCase() : "ACTIVE"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Academic Tags */}
      {(formattedClass || formattedSubject || formattedExam) && (
        <View className="flex-row flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          {formattedClass ? (
            <View className="bg-primary/10 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="school-outline" size={12} color="#B92124" />
              <Text className="text-primary text-xs font-semibold ml-1.5">
                {formattedClass}
              </Text>
            </View>
          ) : null}

          {formattedSubject ? (
            <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="book-outline" size={12} color="#1A50A1" />
              <Text className="text-blue-800 text-xs font-semibold ml-1.5">
                {formattedSubject}
              </Text>
            </View>
          ) : null}

          {formattedExam ? (
            <View className="bg-amber-50 px-3 py-1 rounded-full flex-row items-center">
              <Ionicons name="ribbon-outline" size={12} color="#B45309" />
              <Text className="text-amber-800 text-xs font-semibold ml-1.5">
                Target: {formattedExam}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {/* Edit Registration Profile Button */}
      {onEditPress && (
        <TouchableOpacity
          onPress={onEditPress}
          className="mt-3.5 bg-primary/10 border border-primary/20 py-2.5 rounded-xl flex-row items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="create-outline" size={16} color="#B92124" />
          <Text className="text-primary text-sm font-semibold ml-2">
            Edit Registration Profile
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default StudentProfileInfo;
