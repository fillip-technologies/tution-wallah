import ClassCards from "@/components/institute/ClassCards";
import Categories from "@/components/shared/Categories";
import EducationalServices from "@/components/shared/EducationalServices";
import Header from "@/components/shared/Header";
import SpecialOffers from "@/components/shared/SpecialOffers";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";

interface Subject {
  id: number;
  name: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  count: number;
}

const Index: React.FC = () => {
  const instituteServiceQuestions = [
    {
      id: 1,
      title: "Register as a Coaching or Individual",
      desc: "Fill out a simple registration form to showcase what you teach, and we will connect you with the most relevant students.",
    },
    {
      id: 2,
      title: "Get Student Leads",
      desc: "Our team will share verified student inquiries matching your subjects, so you can focus on teaching instead of searching for students.",
    },
    {
      id: 3,
      title: "Grow Your Coaching",
      desc: "Start enrolling students, manage batches, and expand your coaching with our platform’s support.",
    },
  ];
  const subjects: Subject[] = [
    { id: 1, name: "Maths", icon: "calculator", color: "#3B82F6", count: 340 },
    { id: 2, name: "Science", icon: "flask", color: "#10B981", count: 290 },
    { id: 3, name: "English", icon: "book", color: "#8B5CF6", count: 210 },
    {
      id: 4,
      name: "Social Studies",
      icon: "globe",
      color: "#F59E0B",
      count: 180,
    },
    { id: 5, name: "Hindi", icon: "language", color: "#EF4444", count: 150 },
    { id: 6, name: "Physics", icon: "cogs", color: "#0EA5E9", count: 170 },
    { id: 7, name: "Chemistry", icon: "flask", color: "#EC4899", count: 160 },
    { id: 8, name: "Biology", icon: "leaf", color: "#22C55E", count: 155 },
    { id: 9, name: "Others", icon: "folder", color: "#64748B", count: 90 },
  ];

  const classes = [
    { id: 1, name: "Class 6", count: 120 },
    { id: 2, name: "Class 7", count: 95 },
    { id: 3, name: "Class 8", count: 140 },
    { id: 4, name: "Class 9", count: 180 },
    { id: 5, name: "Class 10", count: 210 },
    { id: 6, name: "Class 11", count: 160 },
    { id: 7, name: "Class 12", count: 200 },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#ffffff" }}
    >
      <Header notification={false} search={false} />

      <Categories categories={subjects} title="Students By Subjects" />

      <ClassCards classes={classes} />

      <SpecialOffers
        heading="Special Offers"
        title="Free Listing"
        subtitle="Get your coaching featured on our platform absolutely free."
        desc="No Hidden Charges"
        btntext="Start Free"
      />

      <EducationalServices services={instituteServiceQuestions} />

      <View className="h-6" />
    </ScrollView>
  );
};

export default Index;
