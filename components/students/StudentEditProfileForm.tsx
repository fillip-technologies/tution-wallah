import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import Toast from "react-native-toast-message";
import RegisterInput from "@/components/ui/RegisterInput";
import Dropdown from "@/components/ui/Dropdown";
import { Button } from "../ui";
import { usePostApiData } from "@/hooks";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import {
  classes,
  exams,
  subjects as studentSubjects,
} from "@/constants/student/index";

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  education_level: string;
  subjects: string;
  target_exam: string;
  city: string;
  full_address: string;
  adhar_number: string;
}

interface StudentEditProfileFormProps {
  user: {
    id?: number | string;
    name?: string;
    email?: string;
    phone?: string;
    education_level?: string;
    subjects?: string;
    target_exam?: string;
    city?: string;
    full_address?: string;
    adhar_number?: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const StudentEditProfileForm: React.FC<StudentEditProfileFormProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const methods = useForm<StudentFormData>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      education_level: user.education_level || "",
      subjects: user.subjects || "",
      target_exam: user.target_exam || "",
      city: user.city || "",
      full_address: user.full_address || "",
      adhar_number: user.adhar_number || "",
    },
  });

  const { studentId, studentToken, instituteId, instituteToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const { post, loading } = usePostApiData<any, any>();

  const onSubmit = async (data: StudentFormData) => {
    try {
      let response: any;
      const targetStudentId = studentId || user.id;

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        education_level: data.education_level.trim(),
        subjects: data.subjects.trim(),
        target_exam: data.target_exam.trim(),
        city: data.city.trim(),
        full_address: data.full_address.trim(),
        adhar_number: data.adhar_number.trim(),
      };

      if (targetStudentId && studentToken) {
        response = await post(
          `/student/edit_std_profile/${targetStudentId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${studentToken}` },
          },
        );
      } else if (instituteId && instituteToken) {
        response = await post(
          `/institute/edit_institute_profile/${instituteId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${instituteToken}` },
          },
        );
      }

      if (response?.status || response?.success) {
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your registration details have been updated successfully!",
          position: "top",
          visibilityTime: 2500,
          autoHide: true,
        });
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        const errorMsg =
          response?.message ||
          response?.error ||
          "Failed to update profile. Please try again.";
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: typeof errorMsg === "string" ? errorMsg : "Validation Error",
          position: "top",
          visibilityTime: 3000,
          autoHide: true,
        });
      }
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message || "Something went wrong while updating profile.",
        position: "top",
      });
    }
  };

  return (
    <View className="bg-white rounded-t-2xl">
      {/* Header */}
      <View className="flex-row justify-between items-center pb-4 border-b border-gray-100 mb-4">
        <View>
          <Text className="text-xl font-bold text-secondary">
            Edit Registration Details
          </Text>
          <Text className="text-xs text-tertiary">
            Update your profile & contact information
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="close" size={20} color="#303841" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 460 }}
      >
        <FormProvider {...methods}>
          {/* Personal Info */}
          <Text className="text-xs font-bold text-tertiary uppercase mb-2">
            Personal Information
          </Text>

          <RegisterInput
            name="name"
            placeholder="Full Name"
            rules={{ required: "Full Name is required" }}
          />

          <RegisterInput
            name="email"
            placeholder="Email Address"
            autoCapitalize="none"
            keyboardType="email-address"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />

          <RegisterInput
            name="phone"
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
            rules={{
              required: "Mobile Number is required",
              validate: (value: string) =>
                !value ||
                /^[0-9]{10}$/.test(value) ||
                "Mobile number must be 10 digits",
            }}
          />

          <RegisterInput
            name="adhar_number"
            placeholder="Aadhaar Number"
            keyboardType="number-pad"
            maxLength={12}
            rules={{
              validate: (value: string) =>
                !value ||
                /^\d{12}$/.test(value) ||
                "Aadhaar number must be 12 digits",
            }}
          />

          {/* Academic Info */}
          <Text className="text-xs font-bold text-tertiary uppercase mt-2 mb-2">
            Academic Details
          </Text>

          <Dropdown
            name="education_level"
            items={classes}
            label="Select Your Class"
          />

          <Dropdown
            name="subjects"
            items={studentSubjects}
            label="Select Your Subject"
          />

          <Dropdown
            name="target_exam"
            items={exams}
            label="Target Exam (if any)"
          />

          {/* Location Info */}
          <Text className="text-xs font-bold text-tertiary uppercase mt-2 mb-2">
            Location Details
          </Text>

          <RegisterInput name="city" placeholder="City" />

          <RegisterInput
            name="full_address"
            placeholder="Full Address"
            multiline
          />

          <View className="mt-2 mb-6">
            {loading ? (
              <View className="py-3 items-center justify-center bg-primary/80 rounded-lg">
                <ActivityIndicator color="#ffffff" />
              </View>
            ) : (
              <Button
                title="SAVE CHANGES"
                onPress={methods.handleSubmit(onSubmit)}
              />
            )}
          </View>
        </FormProvider>
      </ScrollView>
    </View>
  );
};

export default StudentEditProfileForm;
