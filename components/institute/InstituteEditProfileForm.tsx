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

export interface InstituteFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  city: string;
  full_address: string;
  state: string;
  pincode: string;
}

interface InstituteEditProfileFormProps {
  user: {
    id?: number | string;
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    city?: string;
    full_address?: string;
    state?: string;
    pincode?: string;
  };
  onClose: () => void;
  onSuccess?: () => void;
}

const serviceOptions = [
  "Coaching",
  "Home Tuition",
  "Coaching Center",
  "Private Tutor",
  "Online Coaching",
  "Institute",
];

const InstituteEditProfileForm: React.FC<InstituteEditProfileFormProps> = ({
  user,
  onClose,
  onSuccess,
}) => {
  const methods = useForm<InstituteFormData>({
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      service: user.service || "Coaching",
      city: user.city || "",
      full_address: user.full_address || "",
      state: user.state || "Bihar",
      pincode: user.pincode || "",
    },
  });

  const { instituteId, instituteToken } = useSelector(
    (state: RootState) => state.auth,
  );
  const { post, loading } = usePostApiData<any, any>();

  const onSubmit = async (data: InstituteFormData) => {
    try {
      const targetId = instituteId || user.id;

      if (!targetId || !instituteToken) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Institute session not found. Please log in again.",
        });
        return;
      }

      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        service: data.service.trim(),
        city: data.city.trim(),
        full_address: data.full_address.trim(),
        state: data.state.trim(),
        pincode: data.pincode.trim(),
      };

      const response: any = await post(
        `/institute/edit/profile/${targetId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${instituteToken}` },
        },
      );

      if (response?.status) {
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Institute details saved successfully!",
          position: "top",
          visibilityTime: 2500,
          autoHide: true,
        });
        onSuccess?.();
        onClose();
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: response?.message || "Could not update profile. Please try again.",
          position: "top",
          visibilityTime: 3000,
        });
      }
    } catch (err: any) {
      console.error("Institute update error:", err);
      Toast.show({
        type: "error",
        text1: "Update Error",
        text2: err?.response?.data?.message || err?.message || "Something went wrong.",
        position: "top",
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View className="bg-white rounded-t-3xl max-h-[85vh] p-5">
      {/* Modal Header */}
      <View className="flex-row justify-between items-center pb-4 border-b border-gray-100">
        <View>
          <Text className="text-xl font-bold text-secondary">
            Edit Institute Profile
          </Text>
          <Text className="text-xs text-tertiary mt-0.5">
            Update your registered center information
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
        >
          <Ionicons name="close" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        className="mt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <FormProvider {...methods}>
          {/* Institute Name */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase">
            Institute / Center Name *
          </Text>
          <RegisterInput
            name="name"
            placeholder="e.g. Apex Coaching Institute"
            rules={{ required: "Institute Name is required" }}
          />

          {/* Email */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            Email Address *
          </Text>
          <RegisterInput
            name="email"
            placeholder="e.g. apex@example.com"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
          />

          {/* Phone */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            Phone / Contact Number *
          </Text>
          <RegisterInput
            name="phone"
            placeholder="10-digit mobile number"
            rules={{
              required: "Phone number is required",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit mobile number",
              },
            }}
          />

          {/* Service Type */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            Service Category *
          </Text>
          <Dropdown
            name="service"
            items={serviceOptions}
            label="Select Service Type"
          />

          {/* City */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            City *
          </Text>
          <RegisterInput
            name="city"
            placeholder="e.g. Patna"
            rules={{ required: "City is required" }}
          />

          {/* Street Address */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            Full Street Address
          </Text>
          <RegisterInput
            name="full_address"
            placeholder="e.g. Kankarbagh, Near Metro Pillar 42"
          />

          {/* State */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            State
          </Text>
          <RegisterInput
            name="state"
            placeholder="e.g. Bihar"
          />

          {/* Pincode */}
          <Text className="text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase mt-3">
            Pincode
          </Text>
          <RegisterInput
            name="pincode"
            placeholder="e.g. 800020"
          />

          {/* Submit Button */}
          <View className="mt-5">
            {loading ? (
              <View className="bg-primary py-3.5 rounded-xl items-center justify-center">
                <ActivityIndicator size="small" color="#ffffff" />
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

export default InstituteEditProfileForm;
