import React from "react";
import { View, Modal, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomModal: React.FC<BottomModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white p-6 rounded-t-2xl">
          {title && (
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-semibold text-secondary">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close-outline" size={28} color="black" />
              </TouchableOpacity>
            </View>
          )}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default BottomModal;
