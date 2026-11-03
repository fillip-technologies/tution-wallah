import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  subjectname,
  faqs,
  examTips,
  classnumber,
} from "@/constants/student/index";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import DownloadModal from "@/components/ui/DownloadModal";
import { useDownloadPDF } from "@/hooks/use-downloadpdf";
import { ExamTipsCarousel, Faq } from "@/components";
import { NeedHelp } from "@/components/ui";
import LabeledPickerCard from "@/components/ui/LabeledPickerCard";
import WelcomeBanner from "@/components/ui/WelcomeBanner";
import { useGetApiData } from "@/hooks";

export default function SyllabusScreen() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState<any>();
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const { id } = useLocalSearchParams();

  const examMap: Record<number, string> = {
    1: "CBSE Board Exam",
    2: "ICSE Board Exam",
    3: "Bihar Board Exam",
    4: "JEE",
    5: "NEET",
    6: "Olympiads",
  };

  const examName = examMap[Number(id)] || "CBSE Board Exam";

  const { data } = useGetApiData<any>(
    selectedClass
      ? `/student/getexam/syllabus/${examName}/${selectedClass}/${selectedSubject}`
      : ""
  );

  useEffect(() => {
    if (data) {
      setUserData(data);
      if (data?.data?.[0]?.file_path) {
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
  }, [selectedClass, examName]);

  const { downloadAndSharePDF } = useDownloadPDF();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="bg-secondary py-5 px-6 shadow-md">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-lg font-bold font-sans uppercase">
            {examName} Syllabus Hub
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
            }}
            options={classnumber}
          />
          <LabeledPickerCard
            label="Select Your Subject"
            selectedValue={selectedSubject}
            onValueChange={(value) => {
              setSelectedSubject(value);
              setModalVisible(true);
            }}
            options={subjectname}
          />
        </View>

        {selectedClass && selectedSubject && !userData?.data?.length && (
          <View className="mt-6 bg-red-50 border border-red-200 p-4 rounded-lg">
            <Text className="text-red-600 font-semibold">
              No syllabus found for {examName}, Class {selectedClass}{" "}
              {selectedSubject}.
            </Text>
          </View>
        )}

        {selectedClass && selectedSubject && (
          <DownloadModal
            isVisible={modalVisible}
            showDownloadButton={showDownloadButton}
            onClose={() => setModalVisible(false)}
            title={`Class ${selectedClass} - ${selectedSubject}`}
            description={
              userData?.data?.length
                ? "The official syllabus document is ready for download. Get the latest curriculum to plan your studies effectively."
                : "No syllabus available for this class at the moment. Please check back later."
            }
            onDownload={() => {
              if (userData?.data?.[0]?.file_path) {
                downloadAndSharePDF(userData.data[0].file_path);
              }
            }}
            iconName="download-cloud"
          />
        )}

        <ExamTipsCarousel tips={examTips} heading={"Exam Preparation Tips"} />
        <Faq faqs={faqs} title={"Frequently Asked Questions"} />
        <NeedHelp />
      </View>
    </ScrollView>
  );
}
