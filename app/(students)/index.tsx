import Categories from "@/components/shared/Categories";
import EducationalServices from "@/components/shared/EducationalServices";
import Header from "@/components/shared/Header";
import SpecialOffers from "@/components/shared/SpecialOffers";
import CoachingCardItem from "@/components/students/CoachingCardItem";
import { useGetApiData } from "@/hooks";
import { RootState } from "@/store";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import ServiceFilter, { matchesService, ServiceFilterValue } from "@/components/ui/ServiceFilter";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";

interface CoachingCenter {
  id: number;
  name: string;
  subjects: string[];
  rating: number;
  distance: string;
  image: any;
  price: string;
  reviews: number;
  isVerified: boolean;
}

const popularCenters: CoachingCenter[] = [
  {
    id: 1,
    name: "Excel Academy",
    subjects: ["JEE", "NEET", "Foundation"],
    rating: 4.8,
    distance: "1.2 km",
    image: require("@/assets/images/splash-logo.png"),
    price: "₹8,000/month",
    reviews: 245,
    isVerified: true,
  },
  {
    id: 2,
    name: "Scholar's Point",
    subjects: ["CBSE", "ICSE", "State Board"],
    rating: 4.5,
    distance: "0.8 km",
    image: require("@/assets/images/splash-logo.png"),
    price: "₹6,500/month",
    reviews: 189,
    isVerified: true,
  },
  {
    id: 3,
    name: "Bright Future Institute",
    subjects: ["Competitive", "Banking", "SSC"],
    rating: 4.6,
    distance: "2.1 km",
    image: require("@/assets/images/splash-logo.png"),
    price: "₹5,000/month",
    reviews: 156,
    isVerified: false,
  },
];

interface Category {
  id: number;
  name: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}

const categories: Category[] = [
  { id: 1, name: "Maths", icon: "calculator", color: "#3B82F6" },
  { id: 2, name: "Science", icon: "flask", color: "#10B981" },
  { id: 3, name: "Social Studies", icon: "globe", color: "#F59E0B" },
  { id: 4, name: "Hindi", icon: "language", color: "#EF4444" },
  { id: 5, name: "English", icon: "book", color: "#8B5CF6" },
  { id: 6, name: "Physics", icon: "cogs", color: "#0EA5E9" },
  { id: 7, name: "Chemistry", icon: "flask", color: "#EC4899" },
  { id: 8, name: "Biology", icon: "leaf", color: "#22C55E" },
  { id: 9, name: "All", icon: "folder", color: "#EC4899" },
];

interface Exams {
  id: number;
  name: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}
const examsUnder12th: Exams[] = [
  {
    id: 1,
    name: "CBSE Board Exam",
    icon: "graduation-cap",
    color: "#3B82F6",
  },
  { id: 2, name: "ICSE Board Exam", icon: "university", color: "#10B981" },
  { id: 3, name: "Bihar Board Exam", icon: "clipboard", color: "#F59E0B" },
  { id: 4, name: "JEE", icon: "calculator", color: "#EF4444" },
  { id: 5, name: "NEET", icon: "heartbeat", color: "#8B5CF6" },
  { id: 6, name: "Olympiads", icon: "trophy", color: "#0EA5E9" },
  // { id: 7, name: "NTSE", icon: "star", color: "#EC4899" },
  // { id: 8, name: "KVPY", icon: "flask", color: "#22C55E" },
  // { id: 9, name: "Commerce Exams", icon: "line-chart", color: "#64748B" },
  // { id: 10, name: "Humanities Exams", icon: "book", color: "#F43F5E" },
  // { id: 11, name: "Language Exams", icon: "language", color: "#06B6D4" },
  // { id: 12, name: "Other Competitive", icon: "folder", color: "#A3A3A3" },
];
const studentsServiceQuestions = [
  {
    id: 1,
    title: "Register as a Student",
    desc: "Fill out a simple registration form to help us understand your needs and match you with the most suitable coaching options.",
  },
  {
    id: 2,
    title: "Personalized Guidance",
    desc: "Receive a call from our team to discuss available coaching programs and choose the one that best fits your goals.",
  },
  {
    id: 3,
    title: "Start Your Classes",
    desc: "Complete your enrollment by paying the fee, and begin learning with expert instructors right away.",
  },
];

export default function Index() {
  const router = useRouter();
  const [serviceFilter, setServiceFilter] = useState<ServiceFilterValue>("all");
  const { studentToken } = useSelector((state: RootState) => state.auth);

  // Only request profile when student token is present
  const { data: userProfileData, loading: profileLoading } = useGetApiData<any>(
    studentToken ? "/student/profile" : undefined
  );
  const city = userProfileData?.data?.city;

  const { data: userInstituteData, loading: instituteLoading } = useGetApiData<any>(
    city?.trim() ? `/institude/listing/${encodeURIComponent(city.trim())}` : undefined,
  );

  // Fallback if city has no institutes or city is not provided
  const hasSpecificInstitutes =
    Array.isArray(userInstituteData?.data) && userInstituteData.data.length > 0;
  const shouldFallback =
    !city?.trim() || (!instituteLoading && !hasSpecificInstitutes);

  const { data: fallbackInstituteData, loading: fallbackLoading } = useGetApiData<any>(
    shouldFallback ? "/institude/listing/Patna" : undefined
  );

  // Also fetch all institutes to get complete contact and address details
  const { data: allInstitutesData } = useGetApiData<any>("/institute/all");

  // Sort newest first by ID and merge full address/phone details
  const coachingData = React.useMemo(() => {
    const rawList = hasSpecificInstitutes
      ? userInstituteData.data
      : fallbackInstituteData?.data || [];
    if (!Array.isArray(rawList)) return [];

    const allList = Array.isArray(allInstitutesData?.data) ? allInstitutesData.data : [];
    const allMap = new Map<string, any>();
    allList.forEach((inst: any) => {
      if (inst?.id) allMap.set(String(inst.id), inst);
    });

    const merged = rawList.map((item: any) => {
      const full = allMap.get(String(item.id));
      return {
        ...full,
        ...item,
        phone: item.phone || full?.phone || "",
        full_address: item.full_address || full?.full_address || "",
        city: item.city || full?.city || "",
        pincode: item.pincode || full?.pincode || "",
        state: item.state || full?.state || "",
        subject: (Array.isArray(item.subject) && item.subject.length > 0)
          ? item.subject
          : (Array.isArray(full?.subject) ? full.subject : []),
      };
    });

    return [...merged].sort(
      (a, b) => (Number(b.id) || 0) - (Number(a.id) || 0)
    );
  }, [hasSpecificInstitutes, userInstituteData, fallbackInstituteData, allInstitutesData]);

  const isLoading =
    (profileLoading && !userProfileData) ||
    (instituteLoading && !userInstituteData && fallbackLoading);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = await AsyncStorage.getItem("auth");
        if (!stored && !studentToken) {
          router.replace("/student/login");
        }
      } catch (e) {
        console.warn("Error reading storage:", e);
      }
    };

    checkSession();
  }, [studentToken]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#fff" }}
    >
      <Header notification={false} search={true} />

      <Categories
        categories={categories}
        title="Explore Subjects"
        route="subject"
      />
      <Categories
        categories={examsUnder12th}
        title="Explore Exams"
        route="exam"
      />

      <ServiceFilter value={serviceFilter} onChange={setServiceFilter} />

      <CoachingCardItem
        centers={coachingData.filter((c: any) => matchesService(c, serviceFilter))}
        loading={isLoading}
        onCardPress={(id: number, center?: any) => {
          router.push({
            pathname: "/course/[id]",
            params: {
              id: String(id),
              phone: center?.phone || "",
              address: center?.full_address || center?.address || "",
              city: center?.city || "",
              pincode: center?.pincode || "",
              state: center?.state || "",
              name: center?.name || "",
            },
          });
        }}
      />

      <SpecialOffers
        heading="Special Offers"
        title="20% OFF"
        subtitle="On first month enrollment"
        desc="Valid till 30th June • Use code: FIRST20"
        btntext="Claim Now"
      />
      <EducationalServices services={studentsServiceQuestions} />

      <View className="h-6" />
    </ScrollView>
  );
}
