import Categories from "@/components/shared/Categories";
import EducationalServices from "@/components/shared/EducationalServices";
import Header from "@/components/shared/Header";
import SpecialOffers from "@/components/shared/SpecialOffers";
import React from "react";
import { ScrollView, View } from "react-native";

const GuestHome: React.FC = () => {
  const categories = [
    { id: 1, name: "Maths", icon: "calculator", color: "#3B82F6" },
    { id: 2, name: "Science", icon: "flask", color: "#10B981" },
    { id: 3, name: "English", icon: "book", color: "#8B5CF6" },
    { id: 4, name: "Social Studies", icon: "globe", color: "#F59E0B" },
  ];

  const guestQuestions = [
    {
      id: 1,
      title: "Create an Account",
      desc: "Sign up as a student or coaching institute in just a few steps.",
    },
    {
      id: 2,
      title: "Find Perfect Match",
      desc: "Discover coaching centers that match your needs or students for your institute.",
    },
    {
      id: 3,
      title: "Start Learning/Teaching",
      desc: "Connect and begin your educational journey with the right partners.",
    },
  ];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#ffffff" }}
    >
      <Header notification={false} search={false} />

      <SpecialOffers
        title="Join 1K+ of Learners"
        subtitle="Sign up to connect with the best coaching centers and tutors"
        desc="Find the Best Coaching"
        btntext="Sign Up"
      />

      <Categories
        categories={categories}
        title="Explore Subjects"
        route="login"
      />

      <EducationalServices services={guestQuestions} />

      <View className="h-6" />
    </ScrollView>
  );
};

export default GuestHome;
