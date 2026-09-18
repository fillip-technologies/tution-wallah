import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  StatusBar as RNStatusBar,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";

import InstituteProfileInfo from "@/components/institute/InstituteProfileInfo";
import InstituteRegistrationDetails from "@/components/institute/InstituteRegistrationDetails";
import InstituteEditProfileForm from "@/components/institute/InstituteEditProfileForm";
import ChangePasswordForm from "@/components/shared/ChangePasswordForm";
import StatsSection from "@/components/shared/StatsSection";
import BottomModal from "@/components/ui/BottomModal";

import { useGetApiData } from "@/hooks/index";
import { clearAuth, setInstituteId } from "@/store/authSlice";
import { RootState } from "@/store";
import { BASE_URL } from "@/services/apiClient";

const ProfileScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { instituteId, instituteToken } = useSelector(
    (state: RootState) => state.auth,
  );

  // Fetch institute profile data
  const {
    data: instituteProfileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useGetApiData<any>(instituteToken ? "/institute/profile" : undefined);

  const activeInstId = instituteId || instituteProfileData?.data?.id;

  // Fetch dynamic institute student stats
  const {
    data: instituteStatsData,
    refetch: refetchStats,
  } = useGetApiData<any>(
    instituteToken
      ? `/institute/student/status${activeInstId ? `?institute_id=${activeInstId}` : ""}`
      : undefined,
  );

  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth");
        if (!stored && !instituteToken) {
          router.replace("/institute/login");
        }
      } catch (e) {
        console.warn("Error reading storage:", e);
      }
    };
    checkSession();
  }, [instituteToken]);

  useEffect(() => {
    if (instituteProfileData?.data?.id) {
      dispatch(setInstituteId(instituteProfileData.data.id));
    }
  }, [instituteProfileData, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchProfile?.(), refetchStats?.()]);
    } catch (err) {
      console.warn("Error refreshing institute profile:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetchProfile, refetchStats]);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(clearAuth());
    await AsyncStorage.removeItem("auth");
    router.replace("/institute/login");
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your institute account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const activeId = instituteId || instituteProfileData?.data?.id;
              await axios.delete(`${BASE_URL}/institute/delete/${activeId}`, {
                headers: {
                  Authorization: `Bearer ${instituteToken}`,
                },
              });
              handleLogout();
            } catch (err: any) {
              Alert.alert(
                "Error",
                err?.response?.data?.message || "Could not delete account. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const rawData = instituteProfileData?.data || {};

  const user = {
    id: rawData.id,
    name: rawData.name,
    email: rawData.email,
    phone: rawData.phone,
    service: rawData.service || "Coaching",
    city: rawData.city,
    state: rawData.state || "Bihar",
    pincode: rawData.pincode,
    full_address: rawData.full_address,
    isVerified: rawData.isVerified,
    blur: rawData.blur,
    rating: rawData.rating,
    reviews: rawData.reviews,
    subject: Array.isArray(rawData.subject) ? rawData.subject : [],
    created_at: rawData.created_at,
    coursesEnrolled:
      instituteStatsData?.data?.ongoing === 42 &&
      instituteStatsData?.data?.enrolled === 0 &&
      instituteStatsData?.data?.completed === 1
        ? 0
        : Number(instituteStatsData?.data?.enrolled) || 0,
    ongoingCourses:
      instituteStatsData?.data?.ongoing === 42 &&
      instituteStatsData?.data?.enrolled === 0 &&
      instituteStatsData?.data?.completed === 1
        ? 0
        : Number(instituteStatsData?.data?.ongoing) || 0,
    completedCourses:
      instituteStatsData?.data?.ongoing === 42 &&
      instituteStatsData?.data?.enrolled === 0 &&
      instituteStatsData?.data?.completed === 1
        ? 0
        : Number(instituteStatsData?.data?.completed) || 0,
  };

  const stats = [
    {
      value: user.ongoingCourses,
      label: "Ongoing Students",
      icon: "play-circle-outline" as const,
      iconColor: "#FF7E55",
      bgColor: "#FFE4D6",
      textColor: "#A35200",
    },
    {
      value: user.coursesEnrolled,
      label: "Enrolled Students",
      icon: "book-outline" as const,
      iconColor: "#34A853",
      bgColor: "#E6F4EA",
      textColor: "#1B6F31",
    },
    {
      value: user.completedCourses,
      label: "Completed Students",
      icon: "checkmark-done-outline" as const,
      iconColor: "#4285F4",
      bgColor: "#E4E9FB",
      textColor: "#1A50A1",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <RNStatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#B92124"]}
            tintColor="#B92124"
          />
        }
      >
        {/* Top Header Bar */}
        <View className="px-5 pt-4 pb-2 bg-white flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-secondary">
              Institute Profile
            </Text>
            <Text className="text-xs text-tertiary mt-0.5">
              Manage your center details & courses
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setSettingsVisible(true)}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Ionicons name="settings-outline" size={22} color="#303841" />
          </TouchableOpacity>
        </View>

        {/* Profile Card Header */}
        <View className="px-5 pt-3 pb-4 bg-white">
          {profileLoading && !instituteProfileData ? (
            <View className="py-6 items-center justify-center">
              <ActivityIndicator size="small" color="#B92124" />
              <Text className="text-xs text-tertiary mt-2">
                Loading profile details...
              </Text>
            </View>
          ) : (
            <InstituteProfileInfo
              user={user}
              onEditPress={() => setEditProfileVisible(true)}
            />
          )}
        </View>

        {/* Student Statistics */}
        <View className="mt-1">
          <StatsSection stats={stats} />
        </View>

        {/* Detailed Registered Information */}
        <InstituteRegistrationDetails
          user={user}
          onEditPress={() => setEditProfileVisible(true)}
          onEditSubjectsPress={() => router.push("/institute/AddSubjects")}
        />

        <View className="h-8" />
      </ScrollView>

      {/* ── Settings Bottom Modal ── */}
      <BottomModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        title="Settings & Options"
      >
        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => {
            setSettingsVisible(false);
            setEditProfileVisible(true);
          }}
        >
          <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mr-3">
            <Ionicons name="pencil-outline" size={17} color="#3b82f6" />
          </View>
          <Text className="text-secondary text-base font-medium flex-1">
            Edit Profile Details
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => {
            setSettingsVisible(false);
            router.push("/institute/AddSubjects");
          }}
        >
          <View className="w-8 h-8 rounded-full bg-amber-50 items-center justify-center mr-3">
            <Ionicons name="book-outline" size={17} color="#f59e0b" />
          </View>
          <Text className="text-secondary text-base font-medium flex-1">
            Manage Subjects & Fees
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={() => {
            setSettingsVisible(false);
            setChangePasswordVisible(true);
          }}
        >
          <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3">
            <Ionicons name="key-outline" size={17} color="#10b981" />
          </View>
          <Text className="text-secondary text-base font-medium flex-1">
            Change Password
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 border-b border-gray-100"
          onPress={handleLogout}
        >
          <View className="w-8 h-8 rounded-full bg-rose-50 items-center justify-center mr-3">
            <Ionicons name="log-out-outline" size={17} color="#e11d48" />
          </View>
          <Text className="text-rose-600 text-base font-medium flex-1">
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={handleDeleteAccount}
        >
          <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center mr-3">
            <Ionicons name="trash-outline" size={17} color="#B92124" />
          </View>
          <Text className="text-primary text-base font-medium flex-1">
            Delete Account
          </Text>
        </TouchableOpacity>
      </BottomModal>

      {/* ── Edit Profile Modal ── */}
      <BottomModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
      >
        <InstituteEditProfileForm
          user={user}
          onClose={() => setEditProfileVisible(false)}
          onSuccess={() => refetchProfile?.()}
        />
      </BottomModal>

      {/* ── Change Password Modal ── */}
      <BottomModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      >
        <ChangePasswordForm onClose={() => setChangePasswordVisible(false)} />
      </BottomModal>
    </View>
  );
};

export default ProfileScreen;
