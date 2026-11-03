import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Controller, useFormContext } from "react-hook-form";

interface PasswordInputProps {
  name: string;
  placeholder: string;
  rules?: any;
  validateMatchWith?: string;
}

export default function RegisterPasswordInput({
  name,
  placeholder,
  rules = {},
  validateMatchWith,
}: PasswordInputProps) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const compareValue = validateMatchWith ? watch(validateMatchWith) : null;

  return (
    <View className="mb-4">
      <Controller
        control={control}
        name={name}
        rules={{
          ...rules,
          validate: validateMatchWith
            ? (val: string) => val === compareValue || "Passwords do not match"
            : undefined,
        }}
        render={({ field: { onChange, value } }) => (
          <View className="w-full border border-bordercolor flex-row items-center px-3 py-1 rounded-lg">
            <TextInput
              className="flex-1 text-[#1c1c1c] text-lg"
              placeholder={placeholder}
              placeholderTextColor="#9e9e9e"
              secureTextEntry={!showPassword}
              value={value}
              onChangeText={onChange}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={22} color="#9e9e9e" />
              ) : (
                <Eye size={22} color="#9e9e9e" />
              )}
            </TouchableOpacity>
          </View>
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
