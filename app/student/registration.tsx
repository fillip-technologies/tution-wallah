import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/index";
import { usePostApiData, useUserLocation } from "@/hooks/index";
import { RegistrationResponse } from "@/types/student/index";
import {
  classes,
  exams,
  subjects as studentSubjects,
} from "@/constants/student/index";
import KeyboardWrapper from "@/components/layout/KeyboardWrapper";
import {
  RegisterInput,
  RegisterPasswordInput,
  Dropdown,
  NotificationSwitch,
} from "@/components/ui/index";

type StudentRegistrationFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  full_address: string;
  education_level: string;
  target_exam: string;
  subjects: string;
  city: string;
  term_condition: boolean;
  adhar_number: string;
};

export default function StudentRegistration() {
  const router = useRouter();
  const { post } = usePostApiData<RegistrationResponse, StudentRegistrationFormData>();

  const methods = useForm<StudentRegistrationFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      full_address: "",
      education_level: "",
      target_exam: "",
      subjects: "",
      city: "",
      term_condition: false,
      adhar_number: "",
    },
  });

  const { handleSubmit, setValue, watch } = methods;

  const userCity = useUserLocation();
  const termConditionAccepted = watch("term_condition");

  useEffect(() => {
    if (userCity) {
      setValue("city", userCity);
    }
  }, [userCity, setValue]);

  const onSubmit = async (data: StudentRegistrationFormData) => {
    if (!data.term_condition) {
      Alert.alert(
        "Terms Required",
        "Please accept the terms and conditions to continue."
      );
      return;
    }

    const payload = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      full_address: data.full_address.trim(),
      education_level: data.education_level.trim(),
      target_exam: data.target_exam.trim(),
      subjects: data.subjects.trim(),
      city: data.city.trim(),
      adhar_number: data.adhar_number.trim(),
    };

    try {
      const response = await post("/student/reg", payload);

      if ((response as { error?: string })?.error) {
        console.log(response)
        Alert.alert(
          "Registration Failed",
          (response as { error?: string }).error ||
            "Something went wrong during registration."
        );
        return;
      }

      Alert.alert("Success", "Registration successful!");
      router.push("/student/login");
    } catch (err) {
      Alert.alert("Error", "Something went wrong during registration.");
    }
  };

  return (
    <KeyboardWrapper>
      <FormProvider {...methods}>
        <View className="bg-white p-5">
          <Text className="text-2xl font-bold text-center mb-2">
            Student Registration
          </Text>
          <Text className="text-base text-center mb-5 text-secondary">
            Join our platform today and enjoy a seamless, feature-rich
            experience.
          </Text>
          <RegisterInput
            rules={{
              required: "Name Required",
            }}
            name="name"
            placeholder="Full Name"
          />
          <RegisterInput
            rules={{
              required: "Email Required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            }}
            name="email"
            placeholder="Email Address"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <RegisterInput
            rules={{
              required: "Mobile Number Required",
              validate: (value: string) =>
                /^[0-9]{10}$/.test(value) ||
                "Mobile number must be of 10 Digits",
            }}
            name="phone"
            placeholder="Mobile Number"
            keyboardType="number-pad"
            maxLength={10}
          />
          <RegisterInput
            rules={{
              required: "Full Address Required",
            }}
            name="full_address"
            placeholder="Full Address"
          />
          <RegisterInput
            rules={{
              required: "City Required",
            }}
            name="city"
            placeholder="City"
          />
          <RegisterInput
            rules={{
              required: "Aadhaar Number Required",
              validate: (value: string) =>
                /^\d{12}$/.test(value) || "Aadhaar number must be 12 digits",
            }}
            name="adhar_number"
            placeholder="Aadhaar Number"
            keyboardType="number-pad"
            maxLength={12}
          />
          <RegisterPasswordInput
            rules={{
              required: "Password Required",
            }}
            name="password"
            placeholder="Password"
          />
          <RegisterPasswordInput
            rules={{
              required: "Confirm Password Required",
            }}
            name="password_confirmation"
            placeholder="Confirm Password"
            validateMatchWith="password"
          />
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
          <NotificationSwitch
            name="Accept Terms & Conditions"
            description="You must accept the terms and conditions before creating your student account."
            value={termConditionAccepted}
            onValueChange={(value) =>
              setValue("term_condition", value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
          <Button title="NEXT" onPress={handleSubmit(onSubmit)} />
          <TouchableOpacity
            className="justify-center items-center pb-6"
            onPress={() => router.push("/student/login")}
          >
            <Text className="text-secondary text-sm">
              Already have an account?{" "}
              <Text className="text-primary font-medium">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </FormProvider>
    </KeyboardWrapper>
  );
}
