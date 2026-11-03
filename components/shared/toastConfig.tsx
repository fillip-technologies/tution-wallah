import React from "react";
import { View, Text } from "react-native";

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View
      style={{
        height: 80,
        width: "90%",
        backgroundColor: "#34A853", 
        borderRadius: 12,
        padding: 16,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        {text1}
      </Text>
      {text2 && (
        <Text style={{ color: "#fff", fontSize: 14, marginTop: 4 }}>
          {text2}
        </Text>
      )}
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View
      style={{
        height: 80,
        width: "90%",
        backgroundColor: "#DC143C", 
        borderRadius: 12,
        padding: 16,
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
        {text1}
      </Text>
      {text2 && (
        <Text style={{ color: "#fff", fontSize: 14, marginTop: 4 }}>
          {text2}
        </Text>
      )}
    </View>
  ),
};
