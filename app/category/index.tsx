import { Text, View, ScrollView } from "react-native";

import { ThemeChanger } from "@/components/ThemeChanger";

export default function CategoryScreen() {
  return (
    <ScrollView className="pt-12">
      <View>
        <ThemeChanger />
        <Text className="text-red-500 dark:text-teal-500 text-xl">
          Hello Category Index
        </Text>
      </View>
    </ScrollView>
  );
}
