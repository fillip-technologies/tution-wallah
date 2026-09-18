import "../global.css";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar as RNStatusBar } from "react-native";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/shared/toastConfig";
import { Provider } from "react-redux";
import { store } from "@/store/index";
import AuthLoader from "@/components/layout/AuthLoader";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <RNStatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
          }}
          edges={["top", "bottom"]}
        >
          <AuthLoader />
          <Toast config={toastConfig} />
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
