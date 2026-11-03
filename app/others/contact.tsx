import logo from "@/assets/images/tutionwala.png";
import KeyboardWrapper from "@/components/layout/KeyboardWrapper";
import { Button, Dropdown, RegisterInput } from "@/components/ui/index";
import { contactReason } from "@/constants/student/index";
import { usePostApiData } from "@/hooks/index";
import { InquiryResponse } from "@/types/others/index";
import { useRouter } from "expo-router";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";


export default function Login() {
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      message: "",
      subject: "",
    },
  });

  const { handleSubmit } = methods;

  const { post } = usePostApiData<InquiryResponse, any>();

  const onSubmit = async (data: any) => {
    console.log("The message data", data);
    try {
      await post("/contact/submit", data);

      Alert.alert("Message successful!", "", [
        { text: "OK", onPress: () => router.replace("/guest") },
      ]);
    } catch (err) {
      Alert.alert("Error", "Something went wrong during registration.");
    }
  };

  return (
    <KeyboardWrapper>
      <FormProvider {...methods}>
        <View className="flex-1 px-8">
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-3xl font-semibold text-primary">
              SEND US MESSAGE
            </Text>

            <View className="mt-5">
              <Text className="text-base text-center mb-5 text-secondary">
                Have questions about admissions, scholarships, or partnerships?
                Fill out the form, and our team will get back to you within 24
                hours.
              </Text>
            </View>
            <Image
              source={logo}
              className="w-2/5 h-1/5 mt-5"
              resizeMode="contain"
            />
          </View>

          <View className="flex-1 justify-start mt-8">
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
            />

            <Dropdown
              name="subject"
              items={contactReason}
              label="Select Your Institute Type"
            />

            <RegisterInput name="message" placeholder="Address" />

            <Button title="SEND MESSAGE" onPress={handleSubmit(onSubmit)} />

            <TouchableOpacity
              className="justify-center items-center pb-6"
              onPress={() => router.push("/userflow")}
            >
              <Text className="text-secondary text-sm">
                Already have an account?{" "}
                <Text className="text-primary font-medium">Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </FormProvider>
    </KeyboardWrapper>
  );
}
