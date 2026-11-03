import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { fetchData } from "@/services/apiClient";
import {
  approveEnrollmentRequest,
  EnrollmentRequest,
  rejectEnrollmentRequest,
} from "@/services/enrollmentService";

type Filter = "pending" | "approved" | "paid" | "rejected";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "paid", label: "Enrolled" },
  { key: "rejected", label: "Declined" },
];

export default function InstituteRequests() {
  const [filter, setFilter] = useState<Filter>("pending");
  const [items, setItems] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<EnrollmentRequest | null>(null);
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetchData<any>(`/institute/enrollment-requests?status=${filter}`);
      setItems(res.data ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load();
    }, [load])
  );

  const approve = async (r: EnrollmentRequest) => {
    setBusyId(r.id);
    try {
      await approveEnrollmentRequest(r.id);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Please try again.");
    }
    setBusyId(null);
    void load();
  };

  const confirmReject = async () => {
    if (!rejecting) return;
    const target = rejecting;
    setRejecting(null);
    setBusyId(target.id);
    try {
      await rejectEnrollmentRequest(target.id, reason);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Please try again.");
    }
    setReason("");
    setBusyId(null);
    void load();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: "#303841", padding: 20, paddingTop: 56 }}>
        Enrollment Requests
      </Text>

      <View style={{ flexDirection: "row", paddingHorizontal: 20, gap: 8, marginBottom: 12 }}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: filter === f.key ? "#B92124" : "#e2e8f0",
            }}
          >
            <Text style={{ color: filter === f.key ? "#fff" : "#475569", fontSize: 13, fontWeight: "600" }}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#B92124" style={{ marginTop: 40 }} />
      ) : (
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
              Nothing here.
            </Text>
          }
          renderItem={({ item: r }) => (
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#303841" }}>
                {r.student?.name ?? "Student"}
              </Text>
              <Text style={{ color: "#64748b", marginTop: 2 }}>
                {r.subject_name}
                {r.student?.education_level ? ` · ${r.student.education_level}` : ""}
              </Text>
              {r.student?.city ? (
                <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>{r.student.city}</Text>
              ) : null}
              {r.student_note ? (
                <Text style={{ color: "#475569", marginTop: 8, fontStyle: "italic" }}>
                  “{r.student_note}”
                </Text>
              ) : null}
              {r.status === "rejected" && r.reject_reason ? (
                <Text style={{ color: "#B92124", marginTop: 8, fontSize: 13 }}>
                  Reason: {r.reject_reason}
                </Text>
              ) : null}

              {r.status === "pending" ? (
                <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
                  <TouchableOpacity
                    disabled={busyId === r.id}
                    onPress={() => approve(r)}
                    style={{ flex: 1, backgroundColor: "#16a34a", borderRadius: 999, paddingVertical: 12, alignItems: "center" }}
                  >
                    {busyId === r.id ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "600" }}>Approve</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={busyId === r.id}
                    onPress={() => setRejecting(r)}
                    style={{ flex: 1, borderWidth: 1.5, borderColor: "#B92124", borderRadius: 999, paddingVertical: 12, alignItems: "center" }}
                  >
                    <Text style={{ color: "#B92124", fontWeight: "600" }}>Reject</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {r.status === "approved" ? (
                <Text style={{ color: "#1d4ed8", marginTop: 10, fontSize: 13 }}>
                  Waiting for the student to pay
                </Text>
              ) : null}
            </View>
          )}
        />
      )}

      <Modal visible={!!rejecting} transparent animationType="fade" onRequestClose={() => setRejecting(null)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#303841" }}>Reject request</Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Reason (optional)"
              placeholderTextColor="#94a3b8"
              multiline
              maxLength={500}
              style={{ marginTop: 12, minHeight: 70, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 12, padding: 12, textAlignVertical: "top" }}
            />
            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={() => setRejecting(null)} style={{ flex: 1, alignItems: "center", paddingVertical: 12 }}>
                <Text style={{ color: "#64748b", fontWeight: "600" }}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmReject} style={{ flex: 1, backgroundColor: "#B92124", borderRadius: 999, alignItems: "center", paddingVertical: 12 }}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
