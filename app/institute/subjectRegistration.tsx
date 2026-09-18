import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import KeyboardWrapper from "@/components/layout/KeyboardWrapper";
import { RegisterInput, Button } from "@/components/ui/index";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Subject,
  clearRegistration,
  setSubjects,
} from "@/store/registrationSlice";
import { usePostApiData } from "@/hooks/index";

interface SubjectField {
  subject: string;
  monthlyFee: string;
  yearlyFee: string;
}

interface SubjectRegistrationFormData {
  subjects: SubjectField[];
}

export default function SubjectRegistration() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { post } = usePostApiData<any, any>();

  const instituteData = useSelector(
    (state: RootState) => state.registration.institute
  );

  const methods = useForm<SubjectRegistrationFormData>({
    defaultValues: {
      subjects: [{ subject: "", monthlyFee: "", yearlyFee: "" }],
    },
    mode: "onChange",
  });

  const { control, handleSubmit } = methods;

  const { fields, append } = useFieldArray({
    control,
    name: "subjects",
  });

  const addSubjectRow = () => {
    append({ subject: "", monthlyFee: "", yearlyFee: "" });
  };

  const onSubmit = async (data: SubjectRegistrationFormData) => {
    if (!instituteData) {
      Alert.alert("Error", "Missing institute details. Please restart.");
      router.push("/institute/registration");
      return;
    }

    const formattedSubjects: Subject[] = data.subjects.map((subject) => ({
      subject_name: subject.subject.trim(),
      monthly_fee: Number(subject.monthlyFee),
      yearly_fee: Number(subject.yearlyFee),
    }));

    const hasInvalidSubject = formattedSubjects.some(
      (subject) =>
        !subject.subject_name ||
        Number.isNaN(subject.monthly_fee) ||
        Number.isNaN(subject.yearly_fee)
    );

    if (hasInvalidSubject) {
      Alert.alert(
        "Invalid Subjects",
        "Please enter a subject name, monthly fee, and yearly fee for every row."
      );
      return;
    }

    const payload = {
      ...instituteData,
      subjects: formattedSubjects,
    };

    try {
      const response = await post("/institute/reg", payload);
      const responseError = (response as { error?: string })?.error;
      const responseMessage =
        typeof (response as { message?: unknown })?.message === "string"
          ? (response as { message: string }).message
          : "";
      const isSuccess =
        (response as { success?: boolean })?.success === true ||
        /success/i.test(responseMessage);

      if (responseError) {
        Alert.alert("Registration Failed", responseError);
        return;
      }

      if (!isSuccess) {
        Alert.alert(
          "Registration Failed",
          responseMessage || "Registration failed while saving subjects."
        );
        return;
      }

      dispatch(setSubjects(formattedSubjects));
      Alert.alert("Success", responseMessage || "Registration successful!");
      dispatch(clearRegistration());
      router.push("/institute/login");
    } catch (error) {
      Alert.alert("Error", "Something went wrong while submitting subjects.");
    }
  };

  return (
    <KeyboardWrapper>
      <FormProvider {...methods}>
        <ScrollView className="flex-1 bg-white p-5">
          <Text className="text-2xl font-bold text-center mb-2">
            Subject Fees
          </Text>
          <Text className="text-base text-center mb-5 text-secondary">
            Enter the subjects you offer and their respective fees to get
            started the journey.
          </Text>

          {fields.map((field, index) => (
            <View
              key={field.id}
              className="bg-white p-4 mb-6 rounded-xl shadow-md"
            >
              <Text className="text-secondary font-bold text-lg font-serif mb-5">
                Subject {index + 1}
              </Text>
              <RegisterInput
                name={`subjects[${index}].subject`}
                placeholder="Subject"
                rules={{ required: "Subject is required" }}
              />
              <RegisterInput
                name={`subjects[${index}].monthlyFee`}
                placeholder="Monthly Fee"
                keyboardType="numeric"
                rules={{
                  required: "Monthly Fee is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only numbers are allowed",
                  },
                }}
              />
              <RegisterInput
                name={`subjects[${index}].yearlyFee`}
                placeholder="Yearly Fee"
                keyboardType="numeric"
                rules={{
                  required: "Yearly Fee is required",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Only numbers are allowed",
                  },
                }}
              />
            </View>
          ))}

          <TouchableOpacity
            className="flex-row items-center justify-center mb-5"
            onPress={addSubjectRow}
          >
            <View className="bg-primary p-2 rounded-full">
              <Ionicons name="add" size={20} color="#fff" />
            </View>
            <Text className="text-primary font-semibold text-lg ml-2">
              Add Another Subject
            </Text>
          </TouchableOpacity>

          <Button title="SUBMIT SUBJECTS" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
      </FormProvider>
    </KeyboardWrapper>
  );
}
