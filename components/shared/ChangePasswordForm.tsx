import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Toast from "react-native-toast-message";
import { useForm, FormProvider } from "react-hook-form";
import { Button, RegisterPasswordInput } from "@/components/ui/index";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { usePostApiData } from "@/hooks";

interface ChangePasswordFormProps {
  onClose: () => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose }) => {
  // const { instituteId, instituteToken } = useSelector(
  //   (state: RootState) => state.auth
  // );

  const { studentId, studentToken, instituteId, instituteToken } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("Student Id", studentId);
  console.log("Student Token", studentToken);
  console.log("Institute Id", instituteId);
  console.log("Institute Token", instituteToken);

  const { post } = usePostApiData<any, any>();

  console.log("This is the change password screen");

  const methods = useForm({
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = async () => {
    try {
      let response;
      console.log("The response during initalization", response);

      if (studentId && studentToken) {
        console.log("Inside the student route");
        response = await post(
          `/student/change_password/${studentId}`,
          methods.getValues(),
          {
            headers: { Authorization: `Bearer ${studentToken}` },
          }
        );
      } else if (instituteId && instituteToken) {
        console.log("Inside the institute route");
        response = await post(
          `/institute/forget/password/${instituteId}`,
          methods.getValues(),
          {
            headers: { Authorization: `Bearer ${instituteToken}` },
          }
        );
      }
      console.log("the response after hitting url", response);

      if (response?.status) {
        Toast.show({
          type: "success",
          text1: "Password Changed",
          text2: "Your changes have been saved successfully!",
          position: "top",
          visibilityTime: 2500,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: "Something went wrong. Please try again.",
          position: "top",
          visibilityTime: 2500,
        });
      }

      onClose();
    } catch (err) {
      Alert.alert("Error", "Something went wrong during changing password.");
      console.error("Password error:", err);
    }
  };

  // const onSubmit = async () => {
  //   try {
  //     const response: any = await post(
  //       `/institute/forget/password/${instituteId}`,
  //       methods.getValues(),
  //       {
  //         headers: { Authorization: `Bearer ${instituteToken}` },
  //       }
  //     );

  //     if (response?.status) {
  //       Toast.show({
  //         type: "success",
  //         text1: "Password Changed",
  //         text2: "Your changes have been saved successfully!",
  //         position: "top",
  //         visibilityTime: 2500,
  //         autoHide: true,
  //       });
  //     } else {
  //       Toast.show({
  //         type: "error",
  //         text1: "Update Failed",
  //         text2: "Something went wrong. Please try again.",
  //         position: "top",
  //         visibilityTime: 2500,
  //         autoHide: true,
  //       });
  //     }
  //     onClose();
  //   } catch (err) {
  //     Alert.alert("Error", "Something went wrong during changing password.");
  //     console.error("Password error:", err);
  //   }
  // };

  return (
    <View className="bg-white rounded-t-2xl">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold text-secondary">
          Change Password
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-2xl text-secondary">✕</Text>
        </TouchableOpacity>
      </View>

      <FormProvider {...methods}>
        <RegisterPasswordInput
          rules={{ required: "Old Password is required" }}
          name="old_password"
          placeholder="Enter Old Password"
        />

        <RegisterPasswordInput
          rules={{
            required: "New Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          name="password"
          placeholder="Enter New Password"
        />

        <RegisterPasswordInput
          rules={{
            required: "Confirm New Password is required",
          }}
          name="password_confirmation"
          placeholder="Confirm New Password"
          validateMatchWith="password"
        />

        <Button
          title="UPDATE PASSWORD"
          onPress={methods.handleSubmit(onSubmit)}
        />
      </FormProvider>
    </View>
  );
};

export default ChangePasswordForm;
