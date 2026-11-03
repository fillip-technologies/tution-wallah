import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import {
  cancelEnrollmentRequest,
  EnrollmentRequest,
  EnrollmentStatus,
  getMyEnrollmentRequests,
} from "@/services/enrollmentService";
import PaymentBottomSheet from "@/components/ui/PaymentBottomSheet";

const STATUS_STYLE: Record<EnrollmentStatus, { label: string; bg: string; fg: string }> = {
  pending: { label: "Awaiting approval", bg: "#fef9c3", fg: "#92400e" },
  approved: { label: "Approved – pay now", bg: "#dbeafe", fg: "#1d4ed8" },
  paid: { label: "Enrolled", bg: "#dcfce7", fg: "#166534" },
  rejected: { label: "Declined", bg: "#fee2e2", fg: "#B92124" },
  cancelled: { label: "Cancelled", bg: "#f1f5f9", fg: "#64748b" },
  expired: { label: "Approval expired", bg: "#f1f5f9", fg: "#64748b" },
};

export default function MyRequests() {
  const router = useRouter();
  const [items, setItems] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [payFor, setPayFor] = useState<EnrollmentRequest | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await getMyEnrollmentRequests();
      setItems(res.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  const cancel = (r: EnrollmentRequest) =>
    Alert.alert("Cancel request?", "Your request will be withdrawn.", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel Request",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelEnrollmentRequest(r.id);
          } catch (e: any) {
            Alert.alert("Error", e?.response?.data?.message || "Please try again.");
          }
          void load();
        },
      },
    ]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#B92124" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#303841", padding: 20, paddingTop: 56 }}>
        My Requests
      </Text>
      <FlatList
        data={items}
        keyExtractor={(r) => String(r.id)}
        contentContainerStyle={{ padding: 20, paddingTop: 0, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void load();
            }}
          />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: "#94a3b8", marginTop: 60 }}>
            No enrollment requests yet.
          </Text>
        }
        renderItem={({ item: r }) => {
          const st = STATUS_STYLE[r.status];
          return (
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#303841" }}>
                {r.institute_name ?? "Institute"}
              </Text>
              <Text style={{ color: "#64748b", marginTop: 2 }}>{r.subject_name}</Text>
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: st.bg,
                  borderRadius: 999,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  marginTop: 10,
                }}
              >
                <Text style={{ color: st.fg, fontSize: 12, fontWeight: "600" }}>{st.label}</Text>
              </View>
              {r.status === "rejected" && r.reject_reason ? (
                <Text style={{ color: "#B92124", marginTop: 8, fontSize: 13 }}>
                  Reason: {r.reject_reason}
                </Text>
              ) : null}

              {r.status === "approved" ? (
                <TouchableOpacity
                  onPress={() => setPayFor(r)}
                  style={{
                    marginTop: 12,
                    backgroundColor: "#B92124",
                    borderRadius: 999,
                    paddingVertical: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "600" }}>
                    Pay ₹{Math.ceil(r.amount ?? 0)} & Enroll
                  </Text>
                </TouchableOpacity>
              ) : null}
              {r.status === "pending" ? (
                <TouchableOpacity onPress={() => cancel(r)} style={{ marginTop: 10 }}>
                  <Text style={{ color: "#64748b" }}>Cancel request</Text>
                </TouchableOpacity>
              ) : null}
              {r.status === "expired" || r.status === "rejected" || r.status === "cancelled" ? (
                <TouchableOpacity
                  onPress={() => router.push(`/course/${r.institute_id}`)}
                  style={{ marginTop: 10 }}
                >
                  <Text style={{ color: "#B92124", fontWeight: "600" }}>Request again</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        }}
      />

      {payFor ? (
        <PaymentBottomSheet
          visible
          onClose={() => setPayFor(null)}
          enrollmentRequestId={payFor.id}
          courseId={String(payFor.subject_id)}
          courseName={`${payFor.institute_name ?? ""} — ${payFor.subject_name ?? ""}`}
          coursePrice={Math.ceil(payFor.amount ?? 0)}
          currency="INR"
        />
      ) : null}
    </View>
  );
}
