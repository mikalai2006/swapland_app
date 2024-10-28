import React from "react";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="[userId]" options={{ headerShown: false }} />
    </Stack>
  );
}
