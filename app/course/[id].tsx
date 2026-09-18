import logo from "@/assets/images/splash-logo.png";
import { Button } from "@/components/ui";
import PaymentBottomSheet from "@/components/ui/PaymentBottomSheet";
import { useGetApiData } from "@/hooks";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function SkeletonLine({
  width = "100%",
  height = 14,
  radius = 8,
  style = {},
}: {
  width?: string | number;
  height?: number;
  radius?: number;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "#e5e7eb",
          marginBottom: 10,
        },
        style,
      ]}
    />
  );
}

function CourseDetailSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Hero skeleton */}
      <View style={{ width: "100%", height: 288, backgroundColor: "#d1d5db" }} />
      <View style={{ padding: 24, backgroundColor: "#f3f4f6", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <SkeletonLine width="40%" height={12} />
        <SkeletonLine width="70%" height={22} />
        <SkeletonLine width="50%" height={14} />
        <SkeletonLine width="100%" height={12} />
        <SkeletonLine width="90%" height={12} />
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <SkeletonLine width={80} height={28} radius={20} style={{ marginRight: 8 }} />
          <SkeletonLine width={80} height={28} radius={20} />
        </View>
        <SkeletonLine width="50%" height={14} />
        <SkeletonLine width="60%" height={14} />
        <SkeletonLine width="40%" height={28} />
      </View>
    </View>
  );
}

// ─── Subject Picker ───────────────────────────────────────────────────────────
interface SubjectOption {
  id: number;
  subject_name: string;
  monthly_fee: string;
  yearly_fee: string;
}

function SubjectPicker({
  subjects,
  selectedId,
  onSelect,
}: {
  subjects: SubjectOption[];
  selectedId: number | null;
  onSelect: (s: SubjectOption) => void;
}) {
  if (!subjects?.length) return null;

  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "600", color: "#475569", marginBottom: 10 }}>
        Choose a Subject
      </Text>
      {subjects.map((s) => {
        const isSelected = s.id === selectedId;
        const price = parseFloat(s.monthly_fee);
        return (
          <TouchableOpacity
            key={s.id}
            onPress={() => onSelect(s)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 14,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: isSelected ? "#B92124" : "#e2e8f0",
              backgroundColor: isSelected ? "#fef2f2" : "#fff",
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: isSelected ? "#B92124" : "#cbd5e1",
                  marginRight: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: isSelected ? "#B92124" : "#1e293b",
                }}
              >
                {s.subject_name}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: isSelected ? "#B92124" : "#475569",
              }}
            >
              ₹{isNaN(price) ? "—" : Math.ceil(price).toLocaleString("en-IN")}/mo
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({
  label,
  value,
  onPress,
  isAction = false,
}: {
  label: string;
  value: string;
  onPress?: () => void;
  isAction?: boolean;
}) {
  const content = (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
      }}
    >
      <Text style={{ fontSize: 13, color: "#94a3b8", fontWeight: "600", width: 95 }}>
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginLeft: 12,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: isAction ? "#B92124" : "#1e293b",
            fontWeight: "600",
            textAlign: "right",
            flexShrink: 1,
          }}
        >
          {value}
        </Text>
        {isAction && (
          <Ionicons
            name="call"
            size={13}
            color="#B92124"
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CourseDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    phone?: string;
    address?: string;
    city?: string;
    pincode?: string;
    state?: string;
    name?: string;
  }>();
  const id = params.id;

  const [paymentVisible, setPaymentVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(null);

  const { studentToken } = useSelector((state: RootState) => state.auth);

  // 1. Fetch student profile to get city
  const { data: profileData } = useGetApiData<any>(
    studentToken ? "/student/profile" : undefined
  );
  const studentCity = profileData?.data?.city;

  // 2. All institutes list from backend (contains phone, full_address, pincode, state)
  const { data: allInstitutesData } = useGetApiData<any>("/institute/all");

  // 3. City listing (contains subjects relation)
  const { data: listingData, loading: listingLoading } = useGetApiData<any>(
    studentCity?.trim()
      ? `/institude/listing/${encodeURIComponent(studentCity.trim())}`
      : undefined
  );

  const currentInstitutes: any[] = Array.isArray(listingData?.data) ? listingData.data : [];
  const foundInCity = currentInstitutes.some(
    (inst: any) => String(inst.id) === String(id)
  );

  // 4. Fallback to fetch Patna listings if not found in current city listing
  const { data: fallbackListingData, loading: fallbackLoading } = useGetApiData<any>(
    !foundInCity ? "/institude/listing/Patna" : undefined
  );

  const allInstitutesList: any[] = Array.isArray(allInstitutesData?.data)
    ? allInstitutesData.data
    : [];
  const matchedFromAll = allInstitutesList.find(
    (inst: any) => String(inst.id) === String(id)
  );

  const allListingInstitutes: any[] = [
    ...currentInstitutes,
    ...(Array.isArray(fallbackListingData?.data) ? fallbackListingData.data : []),
  ];
  const matchedFromListing = allListingInstitutes.find(
    (inst: any) => String(inst.id) === String(id)
  );

  // Derive unified institute object by merging available sources (route params, /institute/all, and listing)
  const institute = React.useMemo(() => {
    return {
      ...matchedFromAll,
      ...matchedFromListing,
      name:
        matchedFromListing?.name ||
        matchedFromAll?.name ||
        params.name ||
        "Institute",
      phone:
        matchedFromAll?.phone ||
        matchedFromListing?.phone ||
        params.phone ||
        "",
      full_address:
        matchedFromAll?.full_address ||
        matchedFromListing?.full_address ||
        params.address ||
        "",
      city:
        matchedFromAll?.city ||
        matchedFromListing?.city ||
        params.city ||
        "",
      pincode:
        matchedFromAll?.pincode ||
        matchedFromListing?.pincode ||
        params.pincode ||
        "",
      state:
        matchedFromAll?.state ||
        matchedFromListing?.state ||
        params.state ||
        "",
      rating:
        matchedFromListing?.rating ||
        matchedFromAll?.rating ||
        "4.8",
      subject:
        (Array.isArray(matchedFromListing?.subject) && matchedFromListing.subject.length > 0)
          ? matchedFromListing.subject
          : (Array.isArray(matchedFromAll?.subject) ? matchedFromAll.subject : []),
    };
  }, [matchedFromAll, matchedFromListing, params]);

  // Format clean, complete address avoiding duplicate city/state
  const formatAddress = () => {
    const rawAddr = institute.full_address?.trim() || "";
    const city = institute.city?.trim() || "";
    const pincode = institute.pincode?.trim() || "";
    const state = institute.state?.trim() || "";

    const parts: string[] = [];
    if (rawAddr) parts.push(rawAddr);

    if (city && (!rawAddr || !rawAddr.toLowerCase().includes(city.toLowerCase()))) {
      parts.push(city);
    }

    let result = parts.join(", ");
    if (pincode) {
      result += result ? ` - ${pincode}` : pincode;
    }
    if (state && (!result || !result.toLowerCase().includes(state.toLowerCase()))) {
      result += result ? `, ${state}` : state;
    }

    return result || "Address not provided";
  };

  const instituteName = institute.name;
  const subjects: SubjectOption[] = institute.subject || [];
  const address = formatAddress();
  const mobile = institute.phone?.trim() || "Not available";
  const city_name = institute.city?.trim() || "";
  const pincode = institute.pincode?.trim() || "";
  const rating = institute.rating ? String(institute.rating) : "4.8";
  const isBlurred = false; // Never mask or blur registered institute information

  // Active subject for payment (default to first on mount)
  const activeSubject = selectedSubject ?? (subjects.length > 0 ? subjects[0] : null);
  const coursePrice = activeSubject ? parseFloat(activeSubject.monthly_fee) : 0;
  const courseName = activeSubject
    ? `${instituteName} — ${activeSubject.subject_name}`
    : instituteName;

  // Loading indicator only when we have zero information about the institute
  const isPending =
    !matchedFromAll &&
    !matchedFromListing &&
    !params.name &&
    (listingLoading || fallbackLoading);

  if (isPending) {
    return <CourseDetailSkeleton />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <View style={{ position: "relative", marginBottom: 0 }}>
          <Image
            source={logo}
            style={{ width: "100%", height: 288 }}
            resizeMode="cover"
            blurRadius={isBlurred ? 50 : 0}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.75)"]}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 160,
              justifyContent: "flex-end",
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 28,
                fontWeight: "800",
                letterSpacing: 0.3,
              }}
              numberOfLines={2}
            >
              {isBlurred ? "••••• •••••" : instituteName}
            </Text>
            {city_name ? (
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
                <Ionicons name="location-outline" size={13} color="#e2e8f0" />
                <Text style={{ color: "#e2e8f0", fontSize: 13, marginLeft: 4 }}>
                  {city_name}
                </Text>
              </View>
            ) : null}
          </LinearGradient>

          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              position: "absolute",
              top: 40,
              left: 16,
              backgroundColor: "rgba(0,0,0,0.45)",
              borderRadius: 50,
              padding: 10,
            }}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── Details Card ────────────────────────────────────────────────── */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 100,
            backgroundColor: "#f8fafc",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            marginTop: -16,
          }}
        >
          {/* Institute name & rating */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 12, color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.8 }}>
              Coaching Institute
            </Text>
            {rating !== "N/A" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={{ fontSize: 13, color: "#78350f", fontWeight: "700", marginLeft: 4 }}>
                  {rating}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: 24,
              fontWeight: "800",
              color: "#1e293b",
              marginBottom: 16,
            }}
            numberOfLines={2}
          >
            {isBlurred ? "••••• •••• ••••••••" : instituteName}
          </Text>

          {/* Contact & location info */}
          {!isBlurred && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 14,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#e2e8f0",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  marginBottom: 6,
                }}
              >
                Institute Information
              </Text>
              <InfoRow label="📍 Address" value={address} />
              <InfoRow
                label="📞 Mobile"
                value={mobile}
                onPress={
                  mobile !== "Not available"
                    ? () => Linking.openURL(`tel:${mobile}`)
                    : undefined
                }
                isAction={mobile !== "Not available"}
              />
              {city_name ? <InfoRow label="🏙️ City" value={city_name} /> : null}
              {pincode ? <InfoRow label="📮 Pincode" value={pincode} /> : null}
            </View>
          )}

          {/* Subject Picker */}
          {subjects.length > 0 ? (
            <SubjectPicker
              subjects={subjects}
              selectedId={activeSubject?.id ?? null}
              onSelect={(s) => setSelectedSubject(s)}
            />
          ) : (
            <View
              style={{
                backgroundColor: "#fef9c3",
                borderRadius: 12,
                padding: 14,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#fde047",
              }}
            >
              <Text style={{ color: "#854d0e", fontSize: 14 }}>
                No subjects available for this institute yet.
              </Text>
            </View>
          )}

          {/* Price summary */}
          {activeSubject && (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 14,
                padding: 16,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#fecaca",
              }}
            >
              <Text style={{ fontSize: 12, color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", marginBottom: 8 }}>
                Selected Plan
              </Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "#1e293b", fontWeight: "600" }}>
                  {activeSubject.subject_name}
                </Text>
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#B92124" }}>
                  ₹{isNaN(coursePrice) ? "—" : Math.ceil(coursePrice).toLocaleString("en-IN")}/month
                </Text>
              </View>
              {activeSubject.yearly_fee && parseFloat(activeSubject.yearly_fee) > 0 && (
                <Text style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
                  Yearly: ₹{Math.ceil(parseFloat(activeSubject.yearly_fee)).toLocaleString("en-IN")}
                </Text>
              )}
            </View>
          )}

          {/* Blurred CTA hint */}
          {isBlurred && (
            <View
              style={{
                backgroundColor: "#f1f5f9",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Ionicons name="lock-closed-outline" size={24} color="#64748b" />
              <Text style={{ color: "#64748b", fontSize: 14, marginTop: 8, textAlign: "center" }}>
                Contact details are hidden. Enroll to view full information.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── Sticky Enroll Button ─────────────────────────────────────────── */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <Button
          title={activeSubject ? `Enroll in ${activeSubject.subject_name}` : "Enroll Now"}
          onPress={() => setPaymentVisible(true)}
        />
      </View>

      {/* ── Payment Bottom Sheet ─────────────────────────────────────────── */}
      <PaymentBottomSheet
        visible={paymentVisible}
        onClose={() => setPaymentVisible(false)}
        courseId={id}
        courseName={courseName}
        coursePrice={isNaN(coursePrice) ? 0 : Math.ceil(coursePrice)}
        currency="INR"
      />
    </View>
  );
}
