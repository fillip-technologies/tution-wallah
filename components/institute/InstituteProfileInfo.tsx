import React from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import userlogo from "@/assets/images/user.png";

export interface InstituteProfileUser {
  id?: number | string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  full_address?: string;
  service?: string;
  isVerified?: boolean | string;
  blur?: boolean | string;
  rating?: number | string;
  reviews?: number | string;
  subject?: Array<{
    id: number;
    subject_name: string;
    monthly_fee: string;
    yearly_fee: string;
  }>;
  created_at?: string;
}

interface InstituteProfileInfoProps {
  user: InstituteProfileUser;
  onEditPress?: () => void;
}

const InstituteProfileInfo: React.FC<InstituteProfileInfoProps> = ({
  user,
  onEditPress,
}) => {
  const isVerified =
    user.isVerified === true ||
    user.isVerified === "true" ||
    user.isVerified === "1";

  const subjectsCount = Array.isArray(user.subject) ? user.subject.length : 0;

  return (
    <View className="bg-white">
      {/* Horizontal Profile Header: Avatar + Info */}
      <View className="flex-row items-center">
        {/* Clean Avatar */}
        <View className="w-20 h-20 rounded-full overflow-hidden bg-red-50 border border-red-100 items-center justify-center">
          <Image
            source={userlogo}
            className="w-16 h-16"
            resizeMode="contain"
          />
        </View>

        {/* Institute Name, Email, Phone, Status & ID */}
        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-secondary" numberOfLines={1}>
            {user.name || "Institute"}
          </Text>

          <Text className="text-tertiary text-xs mt-0.5" numberOfLines={1}>
            {user.email || "No email"}
          </Text>

          {user.phone ? (
            <Text className="text-tertiary text-xs mt-0.5 font-medium">
              {user.phone}
            </Text>
          ) : null}

          {/* Quick Status & Service Badges */}
          <View className="flex-row items-center mt-2 gap-2 flex-wrap">
            {user.id ? (
              <View className="bg-gray-100 px-2.5 py-0.5 rounded-full">
                <Text className="text-gray-700 text-[11px] font-semibold">
                  #{user.id}
                </Text>
              </View>
            ) : null}

            {user.service ? (
              <View className="bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
                <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">
                  {user.service}
                </Text>
              </View>
            ) : null}

            <View
              className={`px-2.5 py-0.5 rounded-full flex-row items-center border ${
                isVerified
                  ? "bg-green-50 border-green-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                  isVerified ? "bg-green-500" : "bg-amber-500"
                }`}
              />
              <Text
                className={`text-[10px] font-bold ${
                  isVerified ? "text-green-700" : "text-amber-700"
                }`}
              >
                {isVerified ? "VERIFIED" : "PENDING"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Location & Subjects Summary Row */}
      <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <View className="flex-row items-center flex-1 pr-2">
          {user.city ? (
            <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full mr-2">
              <Ionicons name="location-outline" size={12} color="#64748b" />
              <Text className="text-tertiary text-xs font-medium ml-1">
                {user.city}
                {user.state ? `, ${user.state}` : ""}
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center bg-gray-100 px-3 py-1 rounded-full">
            <Ionicons name="book-outline" size={12} color="#64748b" />
            <Text className="text-tertiary text-xs font-medium ml-1">
              {subjectsCount} {subjectsCount === 1 ? "Subject" : "Subjects"}
            </Text>
          </View>
        </View>

        {/* Direct Edit Button */}
        {onEditPress && (
          <TouchableOpacity
            onPress={onEditPress}
            activeOpacity={0.7}
            className="flex-row items-center bg-primary px-3.5 py-1.5 rounded-full"
          >
            <Ionicons name="pencil" size={13} color="#ffffff" />
            <Text className="text-white text-xs font-semibold ml-1.5">
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InstituteProfileInfo;
