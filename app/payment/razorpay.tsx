import { verifyRazorpayPayment } from "@/services/paymentService";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

// ─── Mock mode flag ─ false = real Razorpay checkout opens ──────────────────
const IS_MOCK_MODE = false;

// ─── Build the MOCK simulation HTML (no real Razorpay needed) ─────────────────

function buildMockHTML({
  amount,
  courseName,
}: {
  amount: number;
  courseName: string;
}): string {
  const amountRupees = (amount / 100).toLocaleString("en-IN");
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payment Simulation</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    /* ── Top badge ── */
    .test-badge {
      background: #fef9c3;
      border: 1.5px solid #fde047;
      color: #92400e;
      font-size: 11px;
      font-weight: 800;
      padding: 5px 14px;
      border-radius: 50px;
      letter-spacing: 1px;
      margin-bottom: 20px;
    }

    /* ── Card ── */
    .card {
      background: #fff;
      border-radius: 24px;
      padding: 28px 22px;
      width: 100%;
      max-width: 370px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }

    /* ── Razorpay header ── */
    .rzp-header {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }
    .rzp-icon {
      width: 44px; height: 44px;
      background: #072654;
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-size: 22px;
      margin-right: 12px;
    }
    .rzp-name { font-size: 17px; font-weight: 800; color: #072654; }
    .rzp-sub  { font-size: 11px; color: #64748b; margin-top: 2px; }

    /* ── Amount box ── */
    .amount-box {
      background: linear-gradient(135deg, #B92124, #8B1518);
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 22px;
      text-align: center;
    }
    .amount-label { color: rgba(255,255,255,0.75); font-size: 12px; font-weight: 600; margin-bottom: 4px; }
    .amount-value { color: #fff; font-size: 34px; font-weight: 900; letter-spacing: -0.5px; }
    .amount-sub   { color: rgba(255,255,255,0.7); font-size: 11px; margin-top: 4px; }

    /* ── Course info ── */
    .course-row {
      background: #f8fafc;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 20px;
    }
    .course-label { font-size: 11px; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
    .course-name  { font-size: 14px; font-weight: 700; color: #303841; }

    /* ── UPI input sim ── */
    .upi-section { margin-bottom: 20px; }
    .input-label { font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 6px; }
    .input-box {
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 14px;
      color: #303841;
      width: 100%;
      background: #f8fafc;
    }
    .input-box:focus { outline: none; border-color: #B92124; }

    /* ── Buttons ── */
    .btn-success {
      width: 100%;
      background: #B92124;
      color: #fff;
      border: none;
      border-radius: 14px;
      padding: 16px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-fail {
      width: 100%;
      background: transparent;
      color: #64748b;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 10px;
    }
    .btn-cancel {
      width: 100%;
      background: transparent;
      color: #94a3b8;
      border: none;
      padding: 10px;
      font-size: 13px;
      cursor: pointer;
    }

    /* ── Spinner ── */
    .spinner {
      display: none;
      width: 20px; height: 20px;
      border: 3px solid rgba(255,255,255,0.3);
      border-top: 3px solid #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Methods row ── */
    .methods {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .method-chip {
      flex: 1;
      text-align: center;
      background: #f1f5f9;
      border-radius: 10px;
      padding: 8px 4px;
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .method-chip.active {
      background: #fef2f2;
      color: #B92124;
      border: 1.5px solid #fecaca;
    }

    /* ── Secure footer ── */
    .secure-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      margin-top: 12px;
    }
    .secure-text { font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>

  <div class="test-badge">🧪 TEST MODE — No real money charged</div>

  <div class="card">
    <!-- Razorpay branding -->
    <div class="rzp-header">
      <div class="rzp-icon">💳</div>
      <div>
        <div class="rzp-name">Razorpay Checkout</div>
        <div class="rzp-sub">Secure Payment Gateway</div>
      </div>
    </div>

    <!-- Amount -->
    <div class="amount-box">
      <div class="amount-label">TOTAL AMOUNT</div>
      <div class="amount-value">₹${amountRupees}</div>
      <div class="amount-sub">For: ${courseName}</div>
    </div>

    <!-- Payment methods sim -->
    <div class="methods">
      <div class="method-chip active">UPI</div>
      <div class="method-chip">Cards</div>
      <div class="method-chip">NetBanking</div>
      <div class="method-chip">Wallets</div>
    </div>

    <!-- UPI Input simulation -->
    <div class="upi-section">
      <div class="input-label">UPI ID</div>
      <input class="input-box" type="text" placeholder="yourname@upi" value="test@razorpay" />
    </div>

    <!-- Simulate Success -->
    <button class="btn-success" id="payBtn" onclick="simulateSuccess()">
      <span id="btnText">✅ &nbsp; Simulate Payment Success</span>
      <div class="spinner" id="spinner"></div>
    </button>

    <!-- Simulate Failure -->
    <button class="btn-fail" onclick="simulateFailure()">
      ❌ &nbsp; Simulate Payment Failure
    </button>

    <!-- Cancel -->
    <button class="btn-cancel" onclick="cancelPayment()">
      Cancel & Go Back
    </button>

    <div class="secure-row">
      <span>🔒</span>
      <span class="secure-text">256-bit SSL encrypted &nbsp;|&nbsp; Powered by Razorpay</span>
    </div>
  </div>

  <script>
    function showSpinner() {
      document.getElementById('btnText').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('payBtn').disabled = true;
    }

    function simulateSuccess() {
      showSpinner();
      // Simulate a short processing delay
      setTimeout(function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "PAYMENT_SUCCESS",
          razorpay_order_id: "order_MOCK_${Date.now()}",
          razorpay_payment_id: "pay_MOCK_" + Math.random().toString(36).substr(2, 14).toUpperCase(),
          razorpay_signature: "mock_signature_" + Math.random().toString(36).substr(2, 20)
        }));
      }, 1500);
    }

    function simulateFailure() {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "PAYMENT_FAILED",
        error: "Payment declined by bank. Please try another method."
      }));
    }

    function cancelPayment() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "PAYMENT_CANCELLED" }));
    }
  </script>
</body>
</html>
  `;
}

// ─── Build the REAL Razorpay HTML checkout page ───────────────────────────────

function buildRazorpayHTML({
  key,
  orderId,
  amount,
  currency,
  courseName,
}: {
  key: string;
  orderId: string;
  amount: number;
  currency: string;
  courseName: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Razorpay Checkout</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #B92124 0%, #8B1518 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: white;
      border-radius: 20px;
      padding: 32px 24px;
      width: 88%;
      max-width: 360px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      text-align: center;
    }
    h2 { color: #303841; font-size: 20px; font-weight: 800; margin-bottom: 6px; }
    .amount-box {
      background: #fef2f2; border: 1.5px solid #fecaca;
      border-radius: 12px; padding: 16px; margin: 20px 0;
    }
    .amount-label { color: #64748b; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
    .amount-value { color: #B92124; font-size: 30px; font-weight: 800; }
    .pay-btn {
      background: #B92124; color: white; border: none;
      border-radius: 14px; padding: 16px; width: 100%;
      font-size: 16px; font-weight: 800; cursor: pointer; margin-bottom: 12px;
    }
    .cancel-btn {
      background: transparent; color: #64748b;
      border: 1.5px solid #e5e7eb; border-radius: 14px;
      padding: 14px; width: 100%; font-size: 14px; cursor: pointer;
    }
    .spinner {
      display: none; width: 22px; height: 22px;
      border: 3px solid rgba(255,255,255,0.4);
      border-top: 3px solid #fff; border-radius: 50%;
      animation: spin 0.8s linear infinite; margin: 0 auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <h2>Secure Payment</h2>
    <p style="color:#64748b;font-size:14px;margin-top:4px">${courseName}</p>
    <div class="amount-box">
      <p class="amount-label">TOTAL AMOUNT</p>
      <p class="amount-value">₹${(amount / 100).toLocaleString("en-IN")}</p>
    </div>
    <button class="pay-btn" id="payBtn" onclick="openRazorpay()">
      <span id="btnText">🔒 &nbsp; Pay Now</span>
      <div class="spinner" id="spinner"></div>
    </button>
    <button class="cancel-btn" onclick="cancelPayment()">Cancel</button>
  </div>

  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    function openRazorpay() {
      document.getElementById('btnText').style.display = 'none';
      document.getElementById('spinner').style.display = 'block';
      document.getElementById('payBtn').disabled = true;

      var options = {
        key: "${key}",
        amount: ${amount},
        currency: "${currency}",
        name: "Tution Walah",
        description: "${courseName}",
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        // Show card + UPI collect (UPI collect = enter UPI ID, confirm on phone)
        // UPI Intent (GPay/PhonePe app deep-links) cannot work in WebView.
        config: {
          display: {
            blocks: {
              card: {
                name: "Pay using Card",
                instruments: [{ method: "card" }]
              },
              upi: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi", flow: "collect" }
                ]
              }
            },
            sequence: ["block.upi", "block.card"],
            preferences: { show_default_blocks: false }
          }
        },
        theme: { color: "#B92124" },
        modal: {
          ondismiss: function() {
            document.getElementById('btnText').style.display = 'block';
            document.getElementById('spinner').style.display = 'none';
            document.getElementById('payBtn').disabled = false;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: "PAYMENT_CANCELLED" }));
          }
        },
        handler: function(response) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "PAYMENT_SUCCESS",
            razorpay_order_id: response.razorpay_order_id || "",
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature || ""
          }));
        }
      };

      // Attach real order_id from backend
      var orderId = "${orderId}";
      if (orderId && orderId.length > 0 && !orderId.startsWith("order_MOCK")) {
        options.order_id = orderId;
      }

      var rzp = new Razorpay(options);
      rzp.on('payment.failed', function(response) {
        var err = response.error;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: "PAYMENT_FAILED",
          error: err.description || 'Payment failed',
          code: err.code,
          reason: err.reason,
          source: err.source,
          step: err.step,
          metadata: err.metadata
        }));
      });
      rzp.open();
    }

    function cancelPayment() {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: "PAYMENT_CANCELLED" }));
    }
  </script>
</body>
</html>
  `;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function RazorpayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const webViewRef = useRef<WebView>(null);

  const [webViewLoading, setWebViewLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const {
    orderId = "",
    amount = "0",
    currency = "INR",
    razorpayKey = "rzp_live_TZ6HW9gEKM5aEq",
    courseId = "",
    courseName = "Course Enrollment",
  } = params as Record<string, string>;

  // Use mock HTML in test mode, real Razorpay HTML in production
  const htmlContent = IS_MOCK_MODE
    ? buildMockHTML({
      amount: Number(amount),
      courseName: String(courseName),
    })
    : buildRazorpayHTML({
      key: razorpayKey,
      orderId: String(orderId),
      amount: Number(amount),
      currency: String(currency),
      courseName: String(courseName),
    });

  // ─── Handle messages from WebView ──────────────────────────────────────────

  const handleMessage = async (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      // 🔍 STEP 1 — What did Razorpay WebView send back?
      console.log("=== [PAYMENT] WebView message received ===");
      console.log("  type              :", data.type);
      console.log("  razorpay_order_id :", data.razorpay_order_id);
      console.log("  razorpay_payment_id:", data.razorpay_payment_id);
      console.log("  razorpay_signature :", data.razorpay_signature);
      console.log("  courseId           :", courseId);
      console.log("  error (if any)     :", data.error);

      if (data.type === "PAYMENT_SUCCESS") {
        setVerifying(true);

        const verifyPayload = {
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
          course_id: courseId,
        };

        // 🔍 STEP 2 — What are we sending to backend?
        console.log("=== [PAYMENT] Sending verify payload to backend ===");
        console.log(JSON.stringify(verifyPayload, null, 2));

        let verifyRes: any;
        try {
          verifyRes = await verifyRazorpayPayment(verifyPayload);

          // 🔍 STEP 3 — What did backend respond?
          console.log("=== [PAYMENT] Backend verify response ===");
          console.log(JSON.stringify(verifyRes, null, 2));
        } catch (verifyError: any) {
          // 🔍 STEP 3 ERROR — Backend threw an error
          console.log("=== [PAYMENT] Backend verify ERROR ===");
          console.log("  status :", verifyError?.response?.status);
          console.log("  data   :", JSON.stringify(verifyError?.response?.data, null, 2));
          console.log("  message:", verifyError?.message);
          setVerifying(false);
          Alert.alert(
            "Verification Failed",
            "Payment done but verification failed. Please contact support.",
            [{ text: "Go Back", onPress: () => router.back() }]
          );
          return;
        }

        setVerifying(false);

        // 🔍 STEP 4 — Did backend say success?
        console.log("=== [PAYMENT] verifyRes.success =", verifyRes?.success);

        if (verifyRes?.success) {
          Alert.alert(
            "🎉 Enrollment Successful!",
            `You are now enrolled in "${courseName}". Your learning journey starts now!`,
            [
              {
                text: "Go to Home",
                onPress: () => router.replace("/(students)"),
              },
            ]
          );
        } else {
          Alert.alert(
            "Verification Failed",
            "Payment done but verification failed. Please contact support.",
            [{ text: "Go Back", onPress: () => router.back() }]
          );
        }
      } else if (data.type === "PAYMENT_FAILED") {
        console.log("=== [PAYMENT] FAILED — FULL DETAILS ===");
        console.log("  description :", data.error);
        console.log("  code        :", data.code);
        console.log("  reason      :", data.reason);
        console.log("  source      :", data.source);
        console.log("  step        :", data.step);
        console.log("  metadata    :", JSON.stringify(data.metadata));
        Alert.alert(
          "Payment Failed",
          data.error || "Your payment could not be processed. Please try again.",
          [
            { text: "Try Again", style: "cancel" },
            { text: "Go Back", onPress: () => router.back() },
          ]
        );
      } else if (data.type === "PAYMENT_CANCELLED") {
        console.log("=== [PAYMENT] CANCELLED by user");
        Alert.alert(
          "Payment Cancelled",
          "You cancelled the payment. No charges were made.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
    } catch (e) {
      console.warn("WebView message parse error:", e);
    }
  };

  // ─── Verifying Overlay ───────────────────────────────────────────────────────

  if (verifying) {
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.overlayCard}>
          <ActivityIndicator size="large" color="#B92124" />
          <Text style={styles.overlayText}>Verifying your payment...</Text>
          <Text style={styles.overlaySubtext}>Please do not close the app</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#303841" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.secureTag}>
          <Ionicons name="lock-closed" size={11} color="#16a34a" />
          <Text style={styles.secureTagText}>SECURE</Text>
        </View>
      </View>

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent, baseUrl: "https://apicoaching.fillipsoftware.com" }}
        originWhitelist={["*"]}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="always"
        allowFileAccess
        setSupportMultipleWindows={false}
        onMessage={handleMessage}
        onLoadStart={() => setWebViewLoading(true)}
        onLoadEnd={() => setWebViewLoading(false)}
        onError={(e) => console.warn("WebView error:", e.nativeEvent)}
        style={{ flex: 1 }}
      />

      {/* Loading Overlay */}
      {webViewLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#B92124" />
          <Text style={styles.loadingText}>Loading payment gateway...</Text>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#303841",
    marginLeft: -34,
  },
  secureTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    gap: 3,
  },
  secureTagText: {
    color: "#16a34a",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    top: 60,
  },
  loadingText: {
    marginTop: 14,
    color: "#64748b",
    fontSize: 14,
    fontWeight: "500",
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "75%",
  },
  overlayText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#303841",
    textAlign: "center",
  },
  overlaySubtext: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
});
