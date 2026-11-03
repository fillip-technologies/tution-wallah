import React from "react";
import { TextInput, View, Text, TextInputProps } from "react-native";
import { Controller, useFormContext } from "react-hook-form";

interface InputProps extends TextInputProps {
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  rules?: any;
}

const getFieldError = (errors: Record<string, any>, name: string) => {
  const normalizedName = name.replace(/\[(\d+)\]/g, ".$1");

  return normalizedName
    .split(".")
    .filter(Boolean)
    .reduce<any>((current, key) => current?.[key], errors);
};

export default function RegisterInput({
  name,
  placeholder,
  secureTextEntry = false,
  rules = {},
  ...rest
}: InputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const fieldError = getFieldError(errors, name);

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
            value={value == null ? "" : String(value)}
            onBlur={onBlur}
            onChangeText={onChange}
            {...rest}
          />
        )}
      />
      {fieldError && (
        <Text style={{ color: "#DC143C", marginTop: 4, marginLeft: 5 }}>
          {String(fieldError.message || "Required Field")}
        </Text>
      )}
    </View>
  );
}
