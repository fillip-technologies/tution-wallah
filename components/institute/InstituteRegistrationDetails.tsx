import React from "react";
import { View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InstituteProfileUser } from "./InstituteProfileInfo";

interface InstituteRegistrationDetailsProps {
  user: InstituteProfileUser;
  onEditPress?: () => void;
  onEditSubjectsPress?: () => void;
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

export const InstituteRegistrationDetails: React.FC<InstituteRegistrationDetailsProps> = ({
  user,
  onEditPress,
  onEditSubjectsPress,
}) => {
  const isVerified =
    user.isVerified === true ||
    user.isVerified === "true" ||
    user.isVerified === "1";

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

  const subjects = Array.isArray(user.subject) ? user.subject : [];

  return (
    <View className="px-5 pb-8 space-y-4">
      {/* ── CARD 1: ACADEMIC & SERVICE OFFERINGS ── */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-2 h-4 bg-primary rounded-full mr-2" />
            <Text className="text-sm font-bold text-secondary tracking-wide uppercase">
              Institute & Academic Offerings
            </Text>
          </View>
          {onEditSubjectsPress && (
            <TouchableOpacity onPress={onEditSubjectsPress} activeOpacity={0.7}>
              <Text className="text-primary text-xs font-semibold">
                Manage
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <DetailRow
          icon="business-outline"
          label="Institute Name"
          value={user.name || "Not specified"}
          iconBg="#fef2f2"
          iconColor="#B92124"
        />

        <DetailRow
          icon="school-outline"
          label="Service Type"
          value={user.service || "Coaching Center"}
          iconBg="#eff6ff"
          iconColor="#3b82f6"
        />

        <DetailRow
          icon="star-outline"
          label="Rating & Reviews"
          value={`${user.rating ? `${user.rating} ★` : "4.8 ★"} • ${user.reviews ? `${user.reviews} reviews` : "Verified Institute"}`}
          iconBg="#fefce8"
          iconColor="#ca8a04"
          isLast={subjects.length === 0}
        />

        {/* Offered Subjects List */}
        {subjects.length > 0 && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                Registered Subjects ({subjects.length})
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
              {subjects.map((sub) => (
                <View
                  key={sub.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-[140px]"
                >
                  <Text className="text-xs font-bold text-secondary">
                    {sub.subject_name}
                  </Text>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-[11px] font-semibold text-primary">
                      ₹{Math.ceil(parseFloat(sub.monthly_fee) || 0).toLocaleString("en-IN")}/mo
                    </Text>
                    {sub.yearly_fee && parseFloat(sub.yearly_fee) > 0 ? (
                      <Text className="text-[10px] text-gray-500">
                        ₹{Math.ceil(parseFloat(sub.yearly_fee) || 0).toLocaleString("en-IN")}/yr
                      </Text>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* ── CARD 2: CONTACT & LOCATION DETAILS ── */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4">
        <View className="flex-row items-center mb-2">
          <View className="w-2 h-4 bg-primary rounded-full mr-2" />
          <Text className="text-sm font-bold text-secondary tracking-wide uppercase">
            Contact & Location Details
          </Text>
        </View>

        <DetailRow
          icon="call-outline"
          label="Mobile / Phone Number"
          value={user.phone || "Not specified"}
          iconBg="#ecfdf5"
          iconColor="#10b981"
          rightAction={
            user.phone ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${user.phone}`)}
                className="bg-green-50 px-3 py-1.5 rounded-full border border-green-200 flex-row items-center"
              >
                <Ionicons name="call" size={12} color="#10b981" />
                <Text className="text-green-700 text-xs font-semibold ml-1">
                  Call
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />

        <DetailRow
          icon="mail-outline"
          label="Email Address"
          value={user.email || "Not specified"}
          iconBg="#f5f3ff"
          iconColor="#8b5cf6"
          rightAction={
            user.email ? (
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${user.email}`)}
                className="bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200 flex-row items-center"
              >
                <Ionicons name="mail" size={12} color="#8b5cf6" />
                <Text className="text-purple-700 text-xs font-semibold ml-1">
                  Email
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />

        <DetailRow
          icon="location-outline"
          label="Full Street Address"
          value={user.full_address || "Not specified"}
          iconBg="#fff7ed"
          iconColor="#ea580c"
        />

        <DetailRow
          icon="navigate-outline"
          label="City & Pincode"
          value={
            user.city
              ? `${user.city}${user.pincode ? ` - ${user.pincode}` : ""}`
              : "Not specified"
          }
          iconBg="#f0fdf4"
          iconColor="#16a34a"
        />

        <DetailRow
          icon="map-outline"
          label="State"
          value={user.state || "Bihar"}
          iconBg="#f8fafc"
          iconColor="#64748b"
          isLast={true}
        />
      </View>

      {/* ── CARD 3: ACCOUNT & VERIFICATION ── */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4">
        <View className="flex-row items-center mb-2">
          <View className="w-2 h-4 bg-primary rounded-full mr-2" />
          <Text className="text-sm font-bold text-secondary tracking-wide uppercase">
            Account & Verification
          </Text>
        </View>

        <DetailRow
          icon="id-card-outline"
          label="Institute ID"
          value={user.id ? `#${user.id}` : "N/A"}
          iconBg="#f1f5f9"
          iconColor="#475569"
        />

        <DetailRow
          icon="shield-checkmark-outline"
          label="Verification Status"
          value={isVerified ? "Verified Partner Institute" : "Under Review / Active"}
          iconBg={isVerified ? "#ecfdf5" : "#fffbeb"}
          iconColor={isVerified ? "#10b981" : "#d97706"}
          rightAction={
            <View
              className={`px-3 py-1 rounded-full border ${
                isVerified
                  ? "bg-green-50 border-green-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isVerified ? "text-green-700" : "text-amber-700"
                }`}
              >
                {isVerified ? "VERIFIED" : "PENDING"}
              </Text>
            </View>
          }
        />

        <DetailRow
          icon="calendar-outline"
          label="Member Since"
          value={formatDate(user.created_at)}
          iconBg="#eff6ff"
          iconColor="#2563eb"
          isLast={true}
        />
      </View>
    </View>
  );
};

export default InstituteRegistrationDetails;
