import MapFilter from "@/components/map/MapFilter";
import React, { useRef } from "react";
import { View, Alert } from "react-native";

export default function MapScreen() {
  const mapPressHandler = (coordinates: [number, number]) => {
    Alert.alert(
      "Map press",
      `You pressed at position ${coordinates[0]}/${coordinates[1]}`
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <MapFilter />
    </View>
  );
}
