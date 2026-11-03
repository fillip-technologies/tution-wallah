import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { faqs } from "@/constants/student/index";

const Faq = ({ faqs, title }: any) => {
  return (
    <View className="mt-8 mb-6">
      <Text className="text-secondary text-lg font-serif font-bold mb-4">
        {title}
      </Text>

      {faqs.map((faq: { question: string; answer: string }, index: number) => (
        <TouchableOpacity
          key={index}
          className="bg-white px-4 py-2 rounded-xl shadow-lg"
          activeOpacity={0.9}
        >
          <Text className="text-gray-900 font-semibold">
            {faq.question}
          </Text>
          <Text className="text-gray-600">{faq.answer}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Faq;
