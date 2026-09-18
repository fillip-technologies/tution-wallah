import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setStudentToken, setInstituteToken } from "@/store/authSlice";
import { useRouter, Stack } from "expo-router";

export default function AuthLoader() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth");
        if (stored) {
          const { role, token } = JSON.parse(stored);
          if (role === "student" && token) {
            dispatch(setStudentToken(token));
            router.replace("/(students)");
          } else if (role === "institute" && token) {
            dispatch(setInstituteToken(token));
            router.replace("/(institute)");
          }
        }
      } catch (err) {
        console.warn("Failed to load auth from storage:", err);
      }
    };
    loadAuth();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
