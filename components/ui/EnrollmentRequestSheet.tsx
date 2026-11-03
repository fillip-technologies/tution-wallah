import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  courseName: string;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function EnrollmentRequestSheet({
  visible,
  courseName,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const [note, setNote] = useState("");

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.55)" }}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 20,
            paddingBottom: 32,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#303841" }}>
            Request to Enroll
          </Text>
          <Text style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>
            {courseName}
          </Text>
          <Text style={{ fontSize: 13, color: "#64748b", marginTop: 12 }}>
            The institute will review your request. Once approved, you can pay
            and complete your enrollment.
          </Text>

          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a note for the institute (optional)"
            placeholderTextColor="#94a3b8"
            multiline
            maxLength={500}
            style={{
              marginTop: 16,
              minHeight: 80,
              borderWidth: 1,
              borderColor: "#e2e8f0",
              borderRadius: 12,
              padding: 12,
              textAlignVertical: "top",
              color: "#303841",
            }}
          />

          <TouchableOpacity
            disabled={submitting}
            onPress={() => onSubmit(note)}
            style={{
              marginTop: 18,
              backgroundColor: "#B92124",
              borderRadius: 999,
              paddingVertical: 16,
              alignItems: "center",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "600" }}>
                Send Request
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
