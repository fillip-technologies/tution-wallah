import { SearchBar } from "@/components/ui/index";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import CoachingCard from "@/components/ui/CoachingCard";
import { useGetApiData } from "@/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Searching: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const router = useRouter();

  // ✅ Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { studentToken } = useSelector((state: RootState) => state.auth);

  // ✅ Fetch profile
  const { data: userProfileData, loading: profileLoading } =
    useGetApiData<any>(studentToken ? "/student/profile" : undefined);

  const city = userProfileData?.data?.city;

  // ✅ Fetch institutes (only when city exists)
  const { data: userInstituteData, loading: instituteLoading } =
    useGetApiData<any>(
      city?.trim() ? `/institude/listing/${encodeURIComponent(city.trim())}` : undefined
    );

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
  const coachingData = useMemo(() => {
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

  // ✅ Optimized filtering
  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim()) return coachingData;

    const q = debouncedQuery.toLowerCase();

    return coachingData.filter((item: any) => {
      const nameMatch = item?.name?.toLowerCase()?.includes(q);
      const subjectMatch =
        Array.isArray(item?.subject) &&
        item.subject.some((s: any) =>
          (s?.subject_name || s?.name || "")?.toLowerCase()?.includes(q)
        );
      const subjectsAltMatch =
        Array.isArray(item?.subjects) &&
        item.subjects.some((s: any) =>
          (typeof s === "string" ? s : s?.subject_name || s?.name || "")
            ?.toLowerCase()
            ?.includes(q)
        );
      const feeMatch =
        item?.subject?.[0]?.monthly_fee &&
        String(item.subject[0].monthly_fee).toLowerCase().includes(q);
      const addressMatch =
        item?.full_address?.toLowerCase()?.includes(q) ||
        item?.address?.toLowerCase()?.includes(q) ||
        item?.city?.toLowerCase()?.includes(q);

      return (
        nameMatch ||
        subjectMatch ||
        subjectsAltMatch ||
        feeMatch ||
        addressMatch
      );
    });
  }, [debouncedQuery, coachingData]);

  const isLoading =
    (profileLoading && !userProfileData) ||
    (instituteLoading && !userInstituteData && fallbackLoading);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "#ffffff" }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        className="px-5 pt-5 pb-6"
      >
        <View className="flex-row items-center mb-4">
          <View className="flex-1">
            <SearchBar
              onFocus={() => setIsFocused(true)}
              value={query}
              onChangeText={setQuery}
              placeholder="Search by name, subject, price..."
            />
          </View>

          {isFocused && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setDebouncedQuery("");
                setIsFocused(false);
                Keyboard.dismiss();
                router.back();
              }}
              className="py-4 px-3 border border-gray-300 rounded-md ml-2"
            >
              <Text className="text-sm text-[#64748b]">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Loading State */}
      {isLoading ? (
        <View className="mt-10 items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-gray-500">Loading...</Text>
        </View>
      ) : (
        <>
          {/* Result Count */}
          <View className="mt-6 px-5">
            <Text className="text-gray-700 font-medium">
              Showing {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""}
              {debouncedQuery ? ` for "${debouncedQuery}"` : ""}
            </Text>
          </View>

          {/* Results */}
          <View className="mt-6 px-5">
            {filteredResults.length === 0 ? (
              <Text className="text-center text-gray-500 mt-10">
                No results found
                {debouncedQuery ? ` for "${debouncedQuery}"` : ""}.
              </Text>
            ) : (
              filteredResults.map((center: any) => (
                <CoachingCard
                  key={center.id}
                  center={center}
                  onPress={() =>
                    router.push({
                      pathname: "/course/[id]",
                      params: {
                        id: String(center.id),
                        phone: center?.phone || "",
                        address: center?.full_address || center?.address || "",
                        city: center?.city || "",
                        pincode: center?.pincode || "",
                        state: center?.state || "",
                        name: center?.name || "",
                      },
                    })
                  }
                />
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default Searching;
