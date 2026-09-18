import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface StudentProfileUser {
  id?: number | string;
  studentId?: string;
  name?: string;
  email?: string;
  phone?: string;
  adhar_number?: string;
  education_level?: string;
  subjects?: string;
  target_exam?: string;
  city?: string;
  full_address?: string;
  role?: string;
  status?: string;
  created_at?: string;
  term_condition?: boolean | number;
}

interface StudentRegistrationDetailsProps {
  user: StudentProfileUser;
  onEditPress?: () => void;
}

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  rightAction?: React.ReactNode;
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  iconBg,
  iconColor,
  rightAction,
  isLast = false,
}) => (
  <View>
    <View className="flex-row items-center justify-between py-3.5">
      <View className="flex-row items-center flex-1 mr-2">
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3.5"
          style={{ backgroundColor: iconBg }}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">
            {label}
          </Text>
          <Text
            className="text-[14px] font-semibold text-secondary"
            numberOfLines={2}
          >
            {value}
          </Text>
        </View>
      </View>
      {rightAction ? <View className="ml-2">{rightAction}</View> : null}
    </View>
    {!isLast && <View className="h-[1px] bg-gray-100" style={{ marginLeft: 52 }} />}
  </View>
);

export const StudentRegistrationDetails: React.FC<StudentRegistrationDetailsProps> = ({
  user,
}) => {
  const [showAadhaar, setShowAadhaar] = useState(false);

  const formatText = (val?: string | null, fallback = "Not specified") => {
    if (!val || !val.trim()) return fallback;
    return val
      .split(" ")
      .map((w) => (w.length > 0 ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ");
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const getAadhaarDisplay = () => {
    const raw = (user.adhar_number || "").replace(/\s+/g, "");
    if (!raw) return "Not provided";
    if (raw.length !== 12) return raw;
    if (showAadhaar) {
      return `${raw.slice(0, 4)} ${raw.slice(4, 8)} ${raw.slice(8, 12)}`;
    }
    return `•••• •••• ${raw.slice(8, 12)}`;
  };

  return (
    <View className="mt-6">
      {/* Section Title */}
      <View className="px-6 mb-3">
        <Text className="text-lg font-bold text-secondary">
          Registration Information
        </Text>
        <Text className="text-xs text-tertiary">
          Details recorded during your student registration
        </Text>
      </View>

      {/* 1. Academic Information Card */}
      <View className="px-6 mb-4">
        <View className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center mb-1 pb-2 border-b border-gray-200/60">
            <Ionicons name="school-outline" size={17} color="#B92124" />
            <Text className="text-sm font-bold text-secondary ml-2">
              Academic Details
            </Text>
          </View>

          <DetailRow
            icon="school-outline"
            label="Class / Grade"
            value={formatText(user.education_level)}
            iconBg="#FFEBEB"
            iconColor="#B92124"
          />

          <DetailRow
            icon="book-outline"
            label="Enrolled Subject"
            value={formatText(user.subjects)}
            iconBg="#EBF5FF"
            iconColor="#2563EB"
          />

          <DetailRow
            icon="ribbon-outline"
            label="Target Exam"
            value={formatText(user.target_exam, "None / General")}
            iconBg="#FEF3C7"
            iconColor="#D97706"
            isLast
          />
        </View>
      </View>

      {/* 2. Contact & Address Card */}
      <View className="px-6 mb-4">
        <View className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center mb-1 pb-2 border-b border-gray-200/60">
            <Ionicons name="person-outline" size={17} color="#B92124" />
            <Text className="text-sm font-bold text-secondary ml-2">
              Contact & Address
            </Text>
          </View>

          <DetailRow
            icon="call-outline"
            label="Mobile Number"
            value={user.phone || "Not provided"}
            iconBg="#DCFCE7"
            iconColor="#16A34A"
          />

          <DetailRow
            icon="mail-outline"
            label="Email Address"
            value={user.email || "Not provided"}
            iconBg="#EBF5FF"
            iconColor="#2563EB"
          />

          <DetailRow
            icon="card-outline"
            label="Aadhaar Number"
            value={getAadhaarDisplay()}
            iconBg="#FFE4E6"
            iconColor="#E11D48"
            rightAction={
              user.adhar_number &&
              user.adhar_number.replace(/\s+/g, "").length === 12 ? (
                <TouchableOpacity
                  onPress={() => setShowAadhaar(!showAadhaar)}
                  className="p-2 rounded-xl bg-white border border-gray-200/60 items-center justify-center"
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showAadhaar ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#475569"
                  />
                </TouchableOpacity>
              ) : undefined
            }
          />

          <DetailRow
            icon="business-outline"
            label="City"
            value={formatText(user.city)}
            iconBg="#E0F2FE"
            iconColor="#0284C7"
          />

          <DetailRow
            icon="location-outline"
            label="Full Address"
            value={user.full_address || "Not provided"}
            iconBg="#F3E8FF"
            iconColor="#7E22CE"
            isLast
          />
        </View>
      </View>

      {/* 3. Account Details Card */}
      <View className="px-6 mb-4">
        <View className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center mb-1 pb-2 border-b border-gray-200/60">
            <Ionicons name="shield-checkmark-outline" size={17} color="#B92124" />
            <Text className="text-sm font-bold text-secondary ml-2">
              Account & Verification
            </Text>
          </View>

          <DetailRow
            icon="finger-print-outline"
            label="Student ID"
            value={
              user.studentId ||
              (user.id ? `#STU-${String(user.id).padStart(4, "0")}` : "N/A")
            }
            iconBg="#EBF5FF"
            iconColor="#2563EB"
          />

          <DetailRow
            icon="checkmark-circle-outline"
            label="Account Status"
            value={formatText(user.status, "Active")}
            iconBg="#DCFCE7"
            iconColor="#16A34A"
          />

          <DetailRow
            icon="calendar-outline"
            label="Member Since"
            value={formatDate(user.created_at)}
            iconBg="#FFF7ED"
            iconColor="#C2410C"
          />

          <DetailRow
            icon="document-text-outline"
            label="Terms & Conditions"
            value={
              user.term_condition ? "Accepted & Verified" : "Not accepted"
            }
            iconBg="#DCFCE7"
            iconColor="#16A34A"
            isLast
          />
        </View>
      </View>
    </View>
  );
};

export default StudentRegistrationDetails;
