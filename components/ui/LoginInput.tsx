import React from "react";
import { TextInput, View, Text } from "react-native";
import { Controller, useFormContext } from "react-hook-form";

interface InputProps {
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  rules?: any;
}

export default function LoginInput({
  name,
  placeholder,
  secureTextEntry = false,
  rules = {},
}: InputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="w-full border border-bordercolor text-secondary p-4 text-lg rounded-lg"
            placeholderTextColor="#9e9e9e"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
          />
        )}
      />
      {errors[name] && (
        <Text style={{ color: "#DC143C", marginTop: 4, marginLeft: 5 }}>
          {String(errors[name]?.message || `Required Field`)}
        </Text>
      )}
    </View>
  );
}
