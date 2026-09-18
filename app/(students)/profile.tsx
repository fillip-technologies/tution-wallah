import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Haptics from "expo-haptics";
import { StatusBar } from "expo-status-bar";

import StudentProfileInfo from "@/components/students/StudentProfileInfo";
import StudentRegistrationDetails from "@/components/students/StudentRegistrationDetails";
import StudentEditProfileForm from "@/components/students/StudentEditProfileForm";
import ChangePasswordForm from "@/components/shared/ChangePasswordForm";
import StatsSection from "@/components/shared/StatsSection";
import BottomModal from "@/components/ui/BottomModal";

import { useGetApiData } from "@/hooks/index";
import { clearAuth, setStudentId } from "@/store/authSlice";
import { RootState } from "@/store";
import { BASE_URL } from "@/services/apiClient";

const ProfileScreen = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { studentId, studentToken } = useSelector(
    (state: RootState) => state.auth,
  );

  const {
    data: userProfileData,
    loading: profileLoading,
    refetch: refetchProfile,
  } = useGetApiData<any>(studentToken ? "/student/profile" : undefined);

  const {
    data: userStatsData,
    refetch: refetchStats,
  } = useGetApiData<any>(
    studentToken ? "/student/reports/user-status-counts" : undefined,
  );

  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth");
        if (!stored && !studentToken) {
          router.replace("/student/login");
        }
      } catch (e) {
        console.warn("Error reading storage:", e);
      }
    };
    checkSession();
  }, [studentToken]);

  useEffect(() => {
    if (userProfileData?.data?.id) {
      dispatch(setStudentId(userProfileData.data.id));
    }
  }, [userProfileData, dispatch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchProfile?.(), refetchStats?.()]);
    } catch (err) {
      console.warn("Error refreshing profile:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refetchProfile, refetchStats]);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(clearAuth());
    await AsyncStorage.removeItem("auth");
    router.replace("/student/login");
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
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
              const activeId = studentId || userProfileData?.data?.id;
              await axios.delete(`${BASE_URL}/student/delete/${activeId}`, {
                headers: {
                  Authorization: `Bearer ${studentToken}`,
                },
              });
              handleLogout();
            } catch (err) {
              Alert.alert(
                "Error",
                "Could not delete account. Please try again later.",
              );
            }
          },
        },
      ],
    );
  };

  const student = userProfileData?.data;

  // Real student registration details mapped from backend API
  const user = {
    id: student?.id,
    studentId: student?.id
      ? `#STU-${String(student.id).padStart(4, "0")}`
      : "",
    name: student?.name || "Student",
    email: student?.email || "Not provided",
    phone: student?.phone || "",
    adhar_number: student?.adhar_number || "",
    education_level: student?.education_level || "",
    subjects: student?.subjects || "",
    target_exam: student?.target_exam || "",
    city: student?.city || "",
    full_address: student?.full_address || "",
    status: student?.status || "active",
    role: student?.role || "student",
    image: student?.profile_image || student?.image,
    created_at: student?.created_at,
    term_condition: student?.term_condition,
    coursesEnrolled: userStatsData?.data?.enrolled || 0,
    ongoingCourses: userStatsData?.data?.ongoing || 0,
    completedCourses: userStatsData?.data?.completed || 0,
  };

  const stats = [
    {
      value: user.ongoingCourses,
      label: "Ongoing",
      icon: "play-circle-outline" as const,
      iconColor: "#FF7E55",
      bgColor: "#FFE4D6",
      textColor: "#A35200",
    },
    {
      value: user.coursesEnrolled,
      label: "Enrolled",
      icon: "book-outline" as const,
      iconColor: "#34A853",
      bgColor: "#E6F4EA",
      textColor: "#1B6F31",
    },
    {
      value: user.completedCourses,
      label: "Completed",
      icon: "checkmark-done-outline" as const,
      iconColor: "#4285F4",
      bgColor: "#E4E9FB",
      textColor: "#1A50A1",
    },
  ];

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView
        className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#B92124"]}
          tintColor="#B92124"
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header Section: Title, Actions & Profile Info */}
      <View className="px-6 pt-5 pb-5 bg-white">
        {/* Title Bar */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-secondary tracking-tight">
              My Profile
            </Text>
            <Text className="text-xs text-tertiary mt-0.5">
              Personal & Academic Information
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              onPress={onRefresh}
              className="w-10 h-10 rounded-full items-center justify-center bg-gray-50"
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={21} color="#303841" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSettingsVisible(true)}
              className="w-10 h-10 rounded-full items-center justify-center bg-gray-50"
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={21} color="#303841" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Indicator */}
        {profileLoading && !userProfileData ? (
          <View className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#B92124" />
            <Text className="text-tertiary text-xs mt-3 font-medium">
              Loading profile details...
            </Text>
          </View>
        ) : (
          /* Seamless Profile Info (Avatar + Name + Badges) */
          <StudentProfileInfo
            user={user}
            onEditPress={() => setEditProfileVisible(true)}
          />
        )}
      </View>

      {!profileLoading || userProfileData ? (
        <>
          {/* Learning Overview Stats */}
          <StatsSection stats={stats} />

          {/* Registration Details Cards */}
          <StudentRegistrationDetails user={user} />

          {/* Account & Security Section */}
          <View className="px-6 mt-1 mb-10">
            <Text className="text-lg font-bold text-secondary mb-3">
              Account & Security
            </Text>
            <View className="bg-gray-50/80 rounded-2xl border border-gray-100 overflow-hidden">
              <TouchableOpacity
                className="flex-row items-center justify-between p-4 border-b border-gray-200/60"
                onPress={() => setChangePasswordVisible(true)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-xl bg-blue-50 items-center justify-center mr-3">
                    <Ionicons name="key-outline" size={18} color="#1A50A1" />
                  </View>
                  <Text className="text-secondary font-semibold text-sm">
                    Change Password
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between p-4 border-b border-gray-200/60"
                onPress={() => router.push("/others/contact" as any)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-xl bg-amber-50 items-center justify-center mr-3">
                    <Ionicons
                      name="help-circle-outline"
                      size={18}
                      color="#B45309"
                    />
                  </View>
                  <Text className="text-secondary font-semibold text-sm">
                    Help & Support
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between p-4 border-b border-gray-200/60"
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-xl bg-red-50 items-center justify-center mr-3">
                    <Ionicons name="trash-outline" size={18} color="#B92124" />
                  </View>
                  <Text className="text-primary font-semibold text-sm">
                    Delete Account
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-between p-4"
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-xl bg-red-50 items-center justify-center mr-3">
                    <Ionicons name="log-out-outline" size={18} color="#B92124" />
                  </View>
                  <Text className="text-primary font-semibold text-sm">
                    Logout
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : null}

      {/* Settings Bottom Modal */}
      <BottomModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        title="Settings"
      >
        <TouchableOpacity
          className="py-3 border-b border-gray-100 flex-row items-center"
          onPress={() => {
            setSettingsVisible(false);
            setEditProfileVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={20} color="#303841" />
          <Text className="text-secondary text-base ml-3 font-medium">
            Edit Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3 border-b border-gray-100 flex-row items-center"
          onPress={() => {
            setSettingsVisible(false);
            setChangePasswordVisible(true);
          }}
        >
          <Ionicons name="key-outline" size={20} color="#303841" />
          <Text className="text-secondary text-base ml-3 font-medium">
            Change Password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3 border-b border-gray-100 flex-row items-center"
          onPress={handleDeleteAccount}
        >
          <Ionicons name="trash-outline" size={20} color="#B92124" />
          <Text className="text-primary text-base ml-3 font-medium">
            Delete Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-3 flex-row items-center"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#B92124" />
          <Text className="text-primary text-base ml-3 font-medium">
            Logout
          </Text>
        </TouchableOpacity>
      </BottomModal>

      {/* Edit Profile Bottom Modal */}
      <BottomModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
      >
        <StudentEditProfileForm
          user={user}
          onClose={() => setEditProfileVisible(false)}
          onSuccess={() => {
            refetchProfile?.();
            refetchStats?.();
          }}
        />
      </BottomModal>

      {/* Change Password Bottom Modal */}
      <BottomModal
        visible={changePasswordVisible}
        onClose={() => setChangePasswordVisible(false)}
      >
        <ChangePasswordForm onClose={() => setChangePasswordVisible(false)} />
      </BottomModal>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
