import logo from "@/assets/images/tutionwala.png";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function UserFlow() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-8">
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-lg text-secondary mb-2">HEY THERE</Text>
              <Text className="text-3xl font-semibold text-primary">
                CHOOSE AN ACCOUNT
              </Text>
              <Image
                source={logo}
                className="w-2/5 h-1/5 mt-5"
                resizeMode="contain"
              />
            </View>

            <View className="flex-1 justify-start mt-8">
              <View className="mb-12">
                <Text className=" font-semibold text-primary text-center mb-2">
                  CHOOSE YOUR ROLE
                </Text>
                <Text className="text-base text-secondary text-center">
                  Help us personalize your experience by selecting your role
                  below.
                </Text>
              </View>

              <TouchableOpacity
                className="bg-primary py-4 px-4 rounded-xl shadow-sm mb-8"
                onPress={() => router.push("/student/login")}
              >
                <Text className="text-white text-center text-lg font-medium">
                  I’m a Student
                </Text>
                <Text className="text-white/80 text-center text-sm mt-1">
                  Explore institutions, apply and track your progress
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-100 py-4 px-4 rounded-xl border border-gray-300"
                onPress={() => router.push("/institute/login")}
              >
                <Text className="text-primary text-center text-lg font-medium">
                  I’m an Institute
                </Text>
                <Text className="text-gray-600 text-center text-sm mt-1">
                  Create and manage your coaching or training center
                </Text>
              </TouchableOpacity>
            </View>

            <View className="mb-12">
              <TouchableOpacity
                className="flex-row items-center justify-center mb-2"
                onPress={() => router.push("/others/contact")}
              // onPress={() => router.push("/(students)")}
              // onPress={() => router.push("/guest")}
              >
                <Text className="font-semibold text-primary mr-1 text-sm">
                  {/* Continue as a guest */}
                  CONTINUE AS A GUEST
                </Text>
                <ArrowRight size={17} color="#64748b" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
