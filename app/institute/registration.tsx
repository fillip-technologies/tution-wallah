import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/index";
import { instituteType } from "@/constants/institute/index";
import { useGetApiData, useUserLocation } from "@/hooks/index";
import KeyboardWrapper from "@/components/layout/KeyboardWrapper";
import {
  RegisterInput,
  RegisterPasswordInput,
  Dropdown,
  NotificationSwitch,
} from "@/components/ui/index";
import { useDispatch } from "react-redux";
import {
  InstituteRegistrationPayload,
  setInstituteData,
} from "@/store/registrationSlice";

type InstituteRegistrationFormValues = Omit<
  InstituteRegistrationPayload,
  "term_condition"
> & {
  term_condition: boolean;
};

const formatInstituteService = (service: string) =>
  service
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");

export default function Registration() {
  const dispatch = useDispatch();
  const router = useRouter();

   const { data: termsandconditions } = useGetApiData<any>("/terms");
   console.log(termsandconditions)

  const methods = useForm<InstituteRegistrationFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      phone: "",
      city: "",
      state: "",
      full_address: "",
      pincode: "",
      service: "",
      term_condition: false,
      adhar_number: "",
      blur: "true",
      isVerified: "true",
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

  const onSubmit = (data: InstituteRegistrationFormValues) => {
    if (!data.term_condition) {
      Alert.alert(
        "Terms Required",
        "Please accept the terms and conditions to continue."
      );
      return;
    }

    const payload: InstituteRegistrationPayload = {
      ...data,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password.trim(),
      password_confirmation: data.password_confirmation.trim(),
      phone: data.phone.trim(),
      city: (data.city || userCity || "").trim(),
      state: data.state.trim(),
      full_address: data.full_address.trim(),
      pincode: data.pincode.trim(),
      service: formatInstituteService(data.service),
      term_condition: data.term_condition ? "true" : "false",
      adhar_number: data.adhar_number.trim(),
      blur: "true",
      isVerified: "true",
    };

    dispatch(setInstituteData(payload));
    router.push("/institute/subjectRegistration");
  };

  return (
    <KeyboardWrapper>
      <FormProvider {...methods}>
        <View className="bg-white p-5">
          <Text className="text-2xl font-bold text-center mb-2">
            Institute Registration
          </Text>
          <Text className="text-base text-center mb-5 text-secondary">
            By registering, you gain complete access to our platform and timely
            updates tailored to your needs.
          </Text>

          <RegisterInput
            rules={{
              required: "Institute Name Required",
            }}
            name="name"
            placeholder="Institute Name/ Owner Name"
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
          <RegisterInput name="full_address" placeholder="Full Address" />

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
          <RegisterInput
            rules={{
              required: "City Required",
            }}
            name="city"
            placeholder="City"
          />
          <RegisterInput name="state" placeholder="State" />
          <RegisterInput
            name="pincode"
            placeholder="Pincode"
            keyboardType="number-pad"
            maxLength={6}
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
            name="service"
            items={instituteType}
            label="Select Your Service Type"
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
          <Button title="GET READY" onPress={handleSubmit(onSubmit)} />
          <TouchableOpacity
            className="justify-center items-center pb-6"
            onPress={() => router.push("/institute/login")}
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
