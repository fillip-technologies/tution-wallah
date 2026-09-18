import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { createRazorpayOrder } from "@/services/paymentService";

// ─── Props ────────────────────────────────────────────────────────────────────

interface PaymentBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  courseId: string | string[];
  courseName: string;
  coursePrice: number;   // price in ₹ (rupees)
  currency?: string;
}

// ─── Payment Option Item ──────────────────────────────────────────────────────

interface PaymentOptionProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
}

function PaymentOption({
  label,
  sublabel,
  icon,
  selected,
  onSelect,
  badge,
}: PaymentOptionProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: selected ? "#B92124" : "#e5e7eb",
        backgroundColor: selected ? "#fef2f2" : "#fff",
        marginBottom: 12,
      }}
    >
      {/* Icon box */}
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: selected ? "#B92124" : "#f3f4f6",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </View>

      {/* Text */}
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: selected ? "#B92124" : "#303841",
          }}
        >
          {label}
        </Text>
        <Text style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
          {sublabel}
        </Text>
      </View>

      {/* Badge */}
      {badge && (
        <View
          style={{
            backgroundColor: "#16a34a",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 20,
            marginRight: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
            {badge}
          </Text>
        </View>
      )}

      {/* Radio circle */}
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: selected ? "#B92124" : "#d1d5db",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {selected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#B92124",
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PaymentBottomSheet({
  visible,
  onClose,
  courseId,
  courseName,
  coursePrice,
  currency = "INR",
}: PaymentBottomSheetProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"razorpay" | null>(
    "razorpay"
  );
  const [loading, setLoading] = useState(false);

  const amountInPaise = coursePrice * 100;

  const handlePayNow = async () => {
    if (!selectedMethod) {
      Alert.alert("Select Payment Method", "Please select a payment method to continue.");
      return;
    }

    setLoading(true);
    try {
      const response = await createRazorpayOrder({
        amount: amountInPaise,
        currency,
        course_id: courseId,
        receipt: `receipt_${Date.now()}`,
      });

      // 🔍 STEP A — Full backend response
      console.log("=== [ORDER] Backend raw response ===");
      console.log(JSON.stringify(response, null, 2));

      // 🔍 STEP B — What orderId will be passed to WebView?
      console.log("=== [ORDER] orderId passed to WebView :", response.data?.order_id);
      console.log("=== [ORDER] key    passed to WebView :", response.data?.key);
      console.log("=== [ORDER] amount passed to WebView :", response.data?.amount);

      if (response.success && response.data?.key) {
        onClose();
        router.push({
          pathname: "/payment/razorpay",
          params: {
            orderId: response.data.order_id ?? "",
            amount: String(response.data.amount),
            currency: response.data.currency,
            razorpayKey: response.data.key,
            courseId: String(courseId),
            courseName,
          },
        });
      } else {
        Alert.alert("Order Failed", "Could not create payment order. Please try again.");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.55)",
        }}
      >
        {/* Dismiss tap outside */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 32,
          }}
        >
          {/* Handle */}
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 10,
              backgroundColor: "#e5e7eb",
              alignSelf: "center",
              marginBottom: 20,
            }}
          />

          {/* Header row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#303841" }}>
              Complete Payment
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: 50,
                padding: 6,
              }}
            >
              <Ionicons name="close" size={20} color="#303841" />
            </TouchableOpacity>
          </View>

          {/* Order Summary Card */}
          <View
            style={{
              backgroundColor: "#fef2f2",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "#fecaca",
            }}
          >
            <Text style={{ fontSize: 12, color: "#64748b", fontWeight: "600", marginBottom: 4 }}>
              COURSE ENROLLMENT
            </Text>
            <Text
              style={{ fontSize: 16, fontWeight: "700", color: "#303841", marginBottom: 2 }}
              numberOfLines={1}
            >
              {courseName}
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
              <Text style={{ fontSize: 13, color: "#64748b" }}>Amount to Pay</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#B92124" }}>
                ₹{coursePrice.toLocaleString("en-IN")}/month
              </Text>
            </View>
          </View>

          {/* Section Label */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#64748b",
              marginBottom: 12,
              letterSpacing: 0.5,
            }}
          >
            SELECT PAYMENT METHOD
          </Text>

          {/* Razorpay Option */}
          <PaymentOption
            label="Razorpay"
            sublabel="Cards, UPI, NetBanking, Wallets & more"
            icon={
              <Ionicons
                name="card-outline"
                size={22}
                color={selectedMethod === "razorpay" ? "#fff" : "#B92124"}
              />
            }
            selected={selectedMethod === "razorpay"}
            onSelect={() => setSelectedMethod("razorpay")}
            badge="SECURE"
          />

          {/* Secure payment note */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 4,
              marginBottom: 20,
            }}
          >
            <Ionicons name="shield-checkmark-outline" size={14} color="#16a34a" />
            <Text style={{ fontSize: 12, color: "#64748b", marginLeft: 5 }}>
              100% secure payment powered by Razorpay
            </Text>
          </View>

          {/* Pay Now Button */}
          <TouchableOpacity
            onPress={handlePayNow}
            disabled={loading || !selectedMethod}
            activeOpacity={0.85}
            style={{
              backgroundColor:
                loading || !selectedMethod ? "#f1f5f9" : "#B92124",
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: "#B92124",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: loading ? 0 : 0.3,
              shadowRadius: 8,
              elevation: loading ? 0 : 4,
            }}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#B92124" size="small" />
                <Text style={{ color: "#B92124", fontWeight: "700", fontSize: 16, marginLeft: 10 }}>
                  Creating Order...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed" size={16} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16, marginLeft: 8 }}>
                  Pay ₹{coursePrice.toLocaleString("en-IN")} Now
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
