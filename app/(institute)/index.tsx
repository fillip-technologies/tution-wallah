import React from "react";
import ClassCards from "@/components/institute/ClassCards";
import Categories from "@/components/shared/Categories";
import EducationalServices from "@/components/shared/EducationalServices";
import Header from "@/components/shared/Header";
import SpecialOffers from "@/components/shared/SpecialOffers";
import { ScrollView, View } from "react-native";
import { useGetApiData, useSortList } from "@/hooks";
import { Subject, ClassItem } from "@/types/institute";
import { instituteServiceQuestions } from "@/constants/institute";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Index: React.FC = () => {
  const { data: subjectsCountData } = useGetApiData<any>(
    "/institute/get/student/subject"
  );
  const { data: classCountData } = useGetApiData<any>(
    "/institute/get/student/class"
  );

  const stored = AsyncStorage.getItem("auth");
  console.log("The anyncstorage", stored);

  const subjectConfig: Record<string, { icon: string; color: string }> = {
    Maths: { icon: "calculator", color: "#3B82F6" },
    Science: { icon: "flask", color: "#10B981" },
    English: { icon: "book", color: "#8B5CF6" },
    "Social Studies": { icon: "globe", color: "#F59E0B" },
    Hindi: { icon: "language", color: "#EF4444" },
    Physics: { icon: "cogs", color: "#0EA5E9" },
    Chemistry: { icon: "flask", color: "#EC4899" },
    Biology: { icon: "leaf", color: "#22C55E" },
    Others: { icon: "folder", color: "#64748B" },
  };

  let subjects: Subject[] =
    subjectsCountData?.map((item: any, index: number) => {
      const name = item.subjects || "Others";
      const config = subjectConfig[name] || subjectConfig["Others"];

      return {
        id: index + 1,
        name,
        icon: config.icon,
        color: config.color,
        count: item.total_users,
      };
    }) || [];

  subjects = useSortList(subjects);

  let classes: ClassItem[] =
    classCountData?.map((item: any, index: number) => ({
      id: index + 1,
      name: item.education_level || "Others",
      count: item.total_users,
    })) || [];

  classes = useSortList(classes);

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
