import logo from "@/assets/images/tutionwala.png";
import KeyboardWrapper from "@/components/layout/KeyboardWrapper";
import { Button } from "@/components/ui/index";
import { usePostApiData } from "@/hooks/index";
import { setStudentToken } from "@/store/authSlice";
import { LoginResponse } from "@/types/student/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { post } = usePostApiData<LoginResponse, typeof formData>();

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }

    try {
      const response: any = await post("/student/log", formData);
      console.log("Login Response:", response);

      if (response?.success) {
        console.log("The token", response.token);
        dispatch(setStudentToken(response.token));
        await AsyncStorage.setItem(
          "auth",
          JSON.stringify({
            role: "student",
            token: response.token,
          })
        );
        Alert.alert("Login successful!", "", [
          { text: "OK", onPress: () => router.replace("/(students)") },
        ]);
      } else if (response?.error) {
        Alert.alert("Login Failed", response.error);
      } else {
        Alert.alert("Login Failed", "Invalid email or password.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong during login.");
      console.error("Login error:", err);
    }
  };

  return (
    <KeyboardWrapper extraScrollHeight={10}>
      <View className="flex-1 px-8">
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-lg text-secondary mb-2">DEAR STUDENT</Text>
          <Text className="text-3xl font-semibold text-primary">
            WELCOME BACK
          </Text>
          <Image
            source={logo}
            className="w-2/5 h-1/5 mt-5"
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 justify-start mt-8">
          <TextInput
            className="w-full border-b border-[#d1d1d1] text-[#1c1c1c] py-2 mb-8 text-lg"
            placeholder="EMAIL ADDRESS"
            placeholderTextColor="#9e9e9e"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <View className="w-full border-b border-[#d1d1d1] mb-12 flex-row items-center">
            <TextInput
              className="flex-1 text-[#1c1c1c] py-2 text-lg"
              placeholder="PASSWORD"
              placeholderTextColor="#9e9e9e"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={22} color="#9e9e9e" />
              ) : (
                <Eye size={22} color="#9e9e9e" />
              )}
            </TouchableOpacity>
          </View>

          <Button title="LOGIN" onPress={handleLogin} />

          <TouchableOpacity
            className="justify-center items-center pb-6"
            onPress={() => router.push("/student/registration")}
          >
            <Text className="text-secondary text-sm">
              Don’t have an account yet?{" "}
              <Text className="text-primary font-medium">Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardWrapper>
  );
}
