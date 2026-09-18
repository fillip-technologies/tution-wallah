import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { faqs, examTips, classnumber } from "@/constants/student/index";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { NeedHelp } from "@/components/ui";
import { ExamTipsCarousel, Faq } from "@/components";
import WelcomeBanner from "@/components/ui/WelcomeBanner";
import LabeledPickerCard from "@/components/ui/LabeledPickerCard";
import DownloadModal from "@/components/ui/DownloadModal";
import { useGetApiData, useDownloadPDF } from "@/hooks";

export default function SubjectSyllabusScreen() {
  const [selectedClass, setSelectedClass] = useState("");
  const [userData, setUserData] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const { id } = useLocalSearchParams();

  const subjectMap: Record<number, string> = {
    1: "Maths",
    2: "Science",
    3: "Social Studies",
    4: "Hindi",
    5: "English",
    6: "Physics",
    7: "Chemistry",
    8: "Biology",
  };

  const subjectName = subjectMap[Number(id)] || "Maths";

  const { data } = useGetApiData<any>(
    selectedClass ? `/student/getsyllabus/${subjectName}/${selectedClass}` : ""
  );

  useEffect(() => {
    if (data) {
      setUserData(data);
      if (data?.syllabus?.[0]?.file_url) {
        setShowDownloadButton(true);
      } else {
        setShowDownloadButton(false);
      }
    } else {
      setUserData(null);
      setShowDownloadButton(false);
    }
  }, [data]);

  useEffect(() => {
    setUserData(null);
    setShowDownloadButton(false);
  }, [selectedClass, subjectName]);

  const { downloadAndSharePDF } = useDownloadPDF();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-secondary py-5 px-6 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold font-sans uppercase">
            {subjectName} Syllabus Hub
          </Text>
          <Feather name="book-open" size={24} color="white" />
        </View>
      </View>
      <View className="p-5">
        <WelcomeBanner
          title="Welcome Learners 👋"
          subTitle="Select your class to download the latest official CBSE syllabus."
        />
        <View className="mt-8">
          <LabeledPickerCard
            label="Select Your Class"
            selectedValue={selectedClass}
            onValueChange={(value) => {
              setSelectedClass(value);
              setModalVisible(true);
            }}
            options={classnumber}
          />
        </View>

        {selectedClass && !userData?.syllabus?.length && (
          <View className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
            <Text className="text-red-600 font-semibold">
              No syllabus found for {subjectName}, Class {selectedClass}.
            </Text>
          </View>
        )}

        <DownloadModal
          isVisible={modalVisible}
          showDownloadButton={showDownloadButton}
          onClose={() => setModalVisible(false)}
          title={`Class ${selectedClass}`}
          description={
            userData?.syllabus?.length
              ? "The official syllabus document is ready for download. Get the latest curriculum to plan your studies effectively."
              : "No syllabus available for this class at the moment. Please check back later."
          }
          onDownload={() => {
            if (userData?.syllabus?.[0]?.file_url) {
              downloadAndSharePDF(userData.syllabus[0].file_url);
            }
          }}
        />

        <ExamTipsCarousel tips={examTips} heading={"Exam Preparation Tips"} />
        <Faq faqs={faqs} title={"Frequently Asked Questions"} />
        <NeedHelp />
      </View>
    </ScrollView>
  );
}
