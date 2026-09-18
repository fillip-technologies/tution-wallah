import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import KeyboardWrapper from "@/components/layout/KeyboardWrapper";
import { RegisterInput, Button } from "@/components/ui/index";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setSubjects } from "@/store/registrationSlice";
import { usePostApiData, useGetApiData } from "@/hooks/index";
import { RootState } from "@/store";

export default function SubjectRegistration() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { post } = usePostApiData<any, any>();

  const { instituteId, instituteToken } = useSelector(
    (state: RootState) => state.auth
  );

    const { data: initialSubject } = useGetApiData<any>(
    `/institute/edit/${instituteId}/subject`
  );

  console.log("The Initial Subject", initialSubject);

  const methods = useForm({
    defaultValues: {
      subjects: [{ subject: "", monthlyFee: "", yearlyFee: "" }],
    },
    mode: "onChange",
  });

  const { control, handleSubmit, reset } = methods;
  const { fields, append, replace } = useFieldArray({
    control,
    name: "subjects",
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (initialSubject?.data?.length) {
      const mappedSubjects = initialSubject.data.map((item: any) => ({
        id: item.id,
        subject: item.subject_name,
        monthlyFee: item.monthly_fee,
        yearlyFee: item.yearly_fee,
      }));

      reset({ subjects: mappedSubjects });
      replace(mappedSubjects);
      setIsEdit(true);
    }
  }, [initialSubject, reset, replace]);

  const addSubjectRow = () => {
    append({ subject: "", monthlyFee: "", yearlyFee: "" });
  };

const onSubmit = async (values: any) => {
  console.log("inside the onsubmit");
  try {
    for (const subject of values.subjects) {
      const payload: any = {
        subject_name: subject.subject,
        monthly_fee: subject.monthlyFee,
        yearly_fee: subject.yearlyFee,
      };

      if (subject.id) {
        
        console.log("Updating subject:", subject.id, payload);
        await post(
          `/institute/update/${subject.id}/subject/${instituteId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${instituteToken}` },
          }
        );
      } else {
        
        console.log("Adding new subject:", payload);
        await post("/institute/add/subject", {
          ...payload,
          institute_id: instituteId,
        }, {
          headers: { Authorization: `Bearer ${instituteToken}` },
        });
      }
    }

    Alert.alert("Success!", "Subjects saved successfully");
    dispatch(setSubjects(values.subjects));
    router.back();
  } catch (err: any) {
    Alert.alert("Error", err.message || "Something went wrong");
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
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
                    message: "Only numbers are allowed",
                  },
                }}
              />
              <RegisterInput
                name={`subjects[${index}].yearlyFee`}
                placeholder="Yearly Fee"
                keyboardType="numeric"
                rules={{
                  pattern: {
                    value: /^[0-9]+(\.[0-9]{1,2})?$/,
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

          <Button
            title={isEdit ? "UPDATE SUBJECTS" : "SUBMIT SUBJECTS"}
            onPress={handleSubmit(
              (values) => {
                console.log("✅ onSubmit called with:", values);
                onSubmit(values);
              },
              (errors) => {
                console.log("❌ Validation errors:", errors);
                Alert.alert("Validation failed", JSON.stringify(errors));
              }
            )}
          />
          {/* <Button
            title={isEdit ? "UPDATE SUBJECTS" : "SUBMIT SUBJECTS"}
            onPress={handleSubmit(onSubmit)}
          /> */}
        </ScrollView>
      </FormProvider>
    </KeyboardWrapper>
  );
}
