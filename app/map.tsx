import React, { useRef } from "react";
import { View, Alert } from "react-native";
import Map from "@/components/map/Map";

export default function MapScreen() {
  const zoomToGeoJSONFuncRef = useRef<() => void>();

  const mapPressHandler = (coordinates: [number, number]) => {
    Alert.alert(
      "Map press",
      `You pressed at position ${coordinates[0]}/${coordinates[1]}`
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Map
        onInitialized={(zoomToGeoJSON) =>
          (zoomToGeoJSONFuncRef.current = zoomToGeoJSON)
        }
        onMapPress={mapPressHandler}
      />
    </View>
  );
}
