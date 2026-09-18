import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/images/splash-logo.png";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  center: any;
  onPress?: () => void;
}

const getBooleanValue = (value: boolean | string | undefined) =>
  value === true || value === "true";

export default function CoachingCard({ center, onPress }: Props) {
  const isVerified = getBooleanValue(center?.isVerified);

  // Subjects extraction (supports backend 'subject' relation array or 'subjects' array)
  const subjectsList = Array.isArray(center?.subject) && center.subject.length > 0
    ? center.subject
    : Array.isArray(center?.subjects) && center.subjects.length > 0
    ? center.subjects
    : [];

  // Fee extraction from backend subjects relation
  const rawFee =
    center?.subject?.[0]?.monthly_fee ??
    center?.subjects?.[0]?.monthly_fee ??
    null;

  let feeText = "Contact for Fee";
  if (rawFee !== null && rawFee !== undefined) {
    const parsed = parseFloat(String(rawFee));
    if (!isNaN(parsed) && parsed > 0) {
      feeText = `₹ ${Math.ceil(parsed).toLocaleString("en-IN")}/month`;
    }
  } else if (center?.price) {
    feeText = String(center.price);
  }

  // Location / Contact mappings from backend fields
  const contactPhone = center?.phone || center?.mobile || null;
  const addressText = center?.full_address || center?.address || center?.city || null;
  const ratingText = center?.rating ? String(center.rating) : "4.8";
  const reviewsText =
    center?.reviews !== null && center?.reviews !== undefined && center?.reviews !== ""
      ? `(${center.reviews} reviews)`
      : "(Verified)";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100"
    >
      <View className="flex-row">
        <Image
          source={center?.image || logo}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />

        <View className="ml-3 flex-1">
          {/* Institute Name & Verified Badge */}
          <View className="flex-row items-center justify-between">
            <Text
              className="font-bold text-base text-secondary flex-1 pr-2"
              numberOfLines={1}
            >
              {center?.name || "Coaching Center"}
            </Text>
            {isVerified && (
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            )}
          </View>

          {/* Subjects Badges */}
          <View className="flex-row flex-wrap mt-1">
            {subjectsList.length > 0 ? (
              subjectsList.slice(0, 3).map((s: any, i: number) => {
                const subName = typeof s === "string" ? s : (s?.subject_name || s?.name || "Subject");
                return (
                  <View
                    key={i}
                    className="bg-gray-100 px-2 py-0.5 rounded-full mr-2 mb-1"
                  >
                    <Text className="text-xs text-tertiary">{subName}</Text>
                  </View>
                );
              })
            ) : center?.service ? (
              <View className="bg-gray-100 px-2 py-0.5 rounded-full mr-2 mb-1">
                <Text className="text-xs text-tertiary">{center.service}</Text>
              </View>
            ) : null}
          </View>

          {/* Institute Details */}
          <View className="mt-2">
            {/* Rating & Reviews */}
            <View className="flex-row items-center">
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text className="text-xs font-semibold text-secondary ml-1">
                {ratingText}
              </Text>
              <Text className="text-xs text-tertiary ml-2">
                {reviewsText}
              </Text>
            </View>

            {/* Phone Number */}
            {contactPhone && (
              <View className="flex-row items-center mt-1.5">
                <Entypo name="phone" size={12} color="#64748b" />
                <Text className="text-xs text-tertiary ml-1.5">
                  {contactPhone}
                </Text>
              </View>
            )}

            {/* Address */}
            {addressText && (
              <View className="flex-row items-center mt-1.5">
                <Ionicons name="location-outline" size={12} color="#64748b" />
                <Text className="text-xs text-tertiary ml-1.5 flex-1" numberOfLines={1}>
                  {addressText}
                </Text>
              </View>
            )}

            {/* Monthly Fee & Action */}
            <View className="flex-row items-center justify-between mt-2 pt-1 border-t border-gray-50">
              <Text className="text-base font-bold text-primary">
                {feeText}
              </Text>
              <View className="bg-primary/10 px-2.5 py-1 rounded-full">
                <Text className="text-primary text-xs font-semibold">
                  View Details
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
