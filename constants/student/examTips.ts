import { Feather } from "@expo/vector-icons";

export const examTips = [
  {
    title: "Plan Early",
    desc: "Make a schedule 2-3 months ahead.",
    icon: "calendar",
  },
  {
    title: "Revise NCERT",
    desc: "Stick to NCERT books for concepts.",
    icon: "book",
  },
  {
    title: "Solve Papers",
    desc: "Practice previous year questions.",
    icon: "edit",
  },
  {
    title: "Stay Healthy",
    desc: "Rest & eat well during prep.",
    icon: "heart",
  },
] satisfies {
  title: string;
  desc: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}[];
