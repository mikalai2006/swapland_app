import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View>
      <Text>index</Text>

      <Link href="/_sitemap">
        <Text>Map!</Text>
      </Link>
    </View>
  );
}
