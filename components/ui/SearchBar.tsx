import React from "react";
import {
  TextInput,
  TextInputProps,
  View,
  TouchableOpacity,
} from "react-native";
import { Search } from "lucide-react-native";

interface SearchBarProps extends TextInputProps {
  onSubmit?: () => void;
  className?: string;
  inputClassName?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onSubmit,
  className = "",
  inputClassName = "",
  ...rest
}) => {
  return (
    <View
      className={`flex-row items-center rounded-md px-3 border border-tertiary${className}`}
    >
      <TouchableOpacity className="mr-2" onPress={onSubmit}>
        <Search size={24} color="#9CA3AF" />
      </TouchableOpacity>
      <TextInput
        className={`flex-1 py-4 ${inputClassName}`}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        {...rest}
      />
    </View>
  );
};

export default SearchBar;
