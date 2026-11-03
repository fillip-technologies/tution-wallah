import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  children: React.ReactNode;
  scrollContentContainerStyle?: object;
  extraScrollHeight?: number;
};

export default function KeyboardWrapper({
  children,
  scrollContentContainerStyle,
  extraScrollHeight,
}: Props) {
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          contentContainerStyle={[{ flexGrow: 1 }, scrollContentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
          extraScrollHeight={extraScrollHeight ?? 30}
        >
          {children}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
