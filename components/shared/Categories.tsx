import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface Props {
  categories: {
    id: number;
    name: string;
    icon: string;
    color: string;
    count?: number;
  }[];
  title: string;
  route?: string;
}

export default function Categories({ categories, title, route }: Props) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  const displayed = showAll ? categories : categories.slice(0, 3);

  return (
    <View className="mt-6 px-5">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold text-secondary font-serif">
          {title}
        </Text>
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text className="text-primary font-bold text-sm">
            {showAll ? "Show Less" : "View All"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap justify-between ">
        {displayed.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            className="bg-white  py-6 px-4 rounded-2xl items-center shadow-sm border border-gray-100 mb-4"
            style={{ width: (width - 50) / 3 }}
            onPress={() => {
              if (route === "exam") {
                router.push({
                  pathname: "/exam/[id]",
                  params: {
                    id: cat.id,
                  },
                });
              } else if (route === "subject") {
                router.push({
                  pathname: "/subject/[id]",
                  params: {
                    id: cat.id,
                  },
                });
              } else if (route === "login") {
                router.push({
                  pathname: "/userflow",
                });
              }
            }}
          >
            <View
              className="w-12 h-12 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${cat.color}15` }}
            >
              <FontAwesome name={cat.icon as any} size={20} color={cat.color} />
            </View>
            {cat.count && (
              <Text className="text-xs font-bold text-primary">
                {cat.count}
              </Text>
            )}
            <Text className="text-xs text-center font-medium text-secondary leading-4">
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
