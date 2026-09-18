import { FontAwesome } from "@expo/vector-icons";

export interface Subject {
  id: number;
  name: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  count: number;
}
