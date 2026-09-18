import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";

export const useUserLocation = () => {
  const [city, setCity] = useState("");

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Enable location access in Settings."
          );
          return;
        }

        let servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          Alert.alert("Location Off", "Turn on device location services.");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let geocode = await Location.reverseGeocodeAsync(location.coords);

        if (geocode.length > 0) {
          const cityName = geocode[0].city || geocode[0].subregion || "";
          setCity(cityName);
        }
      } catch (err) {
        console.error("Location error:", err);
      }
    })();
  }, []);

  return city;
};
