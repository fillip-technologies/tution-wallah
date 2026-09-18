import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import Toast from "react-native-toast-message";
import RegisterInput from "@/components/ui/RegisterInput";
import { Button } from "../ui";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { usePostApiData } from "@/hooks";

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    service: string;
  };
  onClose: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onClose }) => {
  const { instituteId, instituteToken } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("The Institute token", instituteId);
  const methods = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      service: user.service,
    },
  });

  const { post } = usePostApiData<any, any>();

  const handleLogin = async () => {
    try {
      const response: any = await post(
        `/institute/edit/profile/${instituteId}`,
        methods.getValues(),
        {
          headers: { Authorization: `Bearer ${instituteToken}` },
        }
      );
      console.log("Login Response:", response);

      if (response?.status) {
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your changes have been saved successfully!",
          position: "top",
          visibilityTime: 2500,
          autoHide: true,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: "Something went wrong. Please try again.",
          position: "top",
          visibilityTime: 2500,
          autoHide: true,
        });
      }
      onClose();
    } catch (err) {
      Alert.alert("Error", "Something went wrong during login.");
      console.error("Login error:", err);
    }
  };
  // const onSubmit = (data: any) => {
  //   console.log("Updated Profile Data:", data);

  //   Toast.show({
  //     type: "success",
  //     text1: "Profile Updated",
  //     text2: "Your changes have been saved successfully!",
  //     position: "top",
  //     visibilityTime: 2500,
  //     autoHide: true,
  //   });

  //   onClose();
  // };

  return (
    <View className="bg-white rounded-t-2xl">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-secondary">Edit Profile</Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-2xl text-secondary">✕</Text>
        </TouchableOpacity>
      </View>

      <FormProvider {...methods}>
        <RegisterInput
          name="name"
          placeholder="Full Name"
          rules={{ required: "Full Name is required" }}
        />

        <RegisterInput
          name="email"
          placeholder="Email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
        />

        <RegisterInput
          name="service"
          placeholder="Service"
          rules={{ required: "Service is required" }}
        />

        <Button
          title="SAVE CHANGES"
          onPress={methods.handleSubmit(handleLogin)}
        />
      </FormProvider>
    </View>
  );
};

export default EditProfileForm;
