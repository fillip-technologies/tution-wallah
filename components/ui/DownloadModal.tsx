import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { Feather } from "@expo/vector-icons";

interface DownloadModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onDownload: () => void;
  iconName?: React.ComponentProps<typeof Feather>["name"];
  showDownloadButton: boolean;
}

const DownloadModal: React.FC<DownloadModalProps> = ({
  isVisible,
  onClose,
  title,
  description,
  onDownload,
  iconName = "download-cloud",
  showDownloadButton,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={300}
    >
      <View className="bg-white rounded-2xl p-6">
        <View className="flex-row items-center mb-4">
          <View className="bg-orange-50 p-3 rounded-full">
            <Feather name={iconName} size={24} color="#FF7E55" />
          </View>
          <Text className="text-secondary text-xl font-semibold ml-3">
            {title}
          </Text>
        </View>
        <Text className="text-tertiary mb-6">{description}</Text>
        {showDownloadButton && (
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={onDownload}
              className="flex-1 bg-primary py-3 rounded-lg shadow-sm"
            >
              <Text className="text-white text-center font-bold">
                Download PDF
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default DownloadModal;
