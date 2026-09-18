import { useCallback } from "react";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Linking, Platform } from "react-native";

const getFileName = (pdfUrl: string) => {
  const fallbackName = `syllabus-${Date.now()}.pdf`;

  try {
    const url = new URL(pdfUrl);
    const rawName = url.pathname.split("/").pop() || fallbackName;
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_");

    if (!sanitizedName) {
      return fallbackName;
    }

    return sanitizedName.toLowerCase().endsWith(".pdf")
      ? sanitizedName
      : `${sanitizedName}.pdf`;
  } catch {
    const rawName = pdfUrl.split("/").pop()?.split("?")[0] || fallbackName;
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9._-]/g, "_");

    if (!sanitizedName) {
      return fallbackName;
    }

    return sanitizedName.toLowerCase().endsWith(".pdf")
      ? sanitizedName
      : `${sanitizedName}.pdf`;
  }
};

export const useDownloadPDF = () => {
  const downloadAndSharePDF = useCallback(async (pdfUrl: string) => {
    try {
      if (!pdfUrl) {
        Alert.alert("Error", "No PDF file was found for download.");
        return;
      }

      const fileName = `${Date.now()}-${getFileName(pdfUrl)}`;

      if (Platform.OS === "web") {
        await Linking.openURL(pdfUrl);
        return;
      }

      const destinationFile = new FileSystem.File(
        FileSystem.Paths.document,
        fileName
      );
      const downloadedFile = await FileSystem.File.downloadFileAsync(
        pdfUrl,
        destinationFile
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadedFile.uri, {
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
          dialogTitle: "Download PDF",
        });
        return;
      }

      Alert.alert("Downloaded", "PDF downloaded successfully.");
    } catch (err) {
      console.error("Download error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to download PDF.";
      Alert.alert("Error", message);
    }
  }, []);

  return { downloadAndSharePDF };
};
