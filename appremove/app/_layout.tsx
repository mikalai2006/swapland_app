import "react-native-reanimated";

import { useColorScheme } from "nativewind";
import { Colors } from "@/utils/Colors";

// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Drawer from "expo-router/drawer";
// import { ScrollView, View } from "react-native";
// import {
//   DrawerContentComponentProps,
//   DrawerItem,
// } from "@react-navigation/drawer";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { ThemeChanger } from "@/components/ThemeChanger";
// import { PersistGate } from "redux-persist/integration/react";
// import { ActivityIndicator, StatusBar, View } from "react-native";
// import { Provider } from "react-redux";
// import WidgetInitAuth from "@/widget/WidgetInitAuth";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { WidgetInitApp } from "@/widget/WidgetInitApp";
// import WidgetEvents from "@/widget/WidgetEvents";

import { Stack } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { tokens } from "@/store/storeSlice";

export default function AppLayout() {
  const { colorScheme } = useColorScheme();
  const tokensFromStore = useAppSelector(tokens);

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor:
            colorScheme === "dark" ? Colors.s[950] : Colors.white,
        },
        headerTintColor: colorScheme === "dark" ? Colors.s[200] : Colors.s[800],
      }}
      children={[
        <Stack.Screen
          key="(tabs)"
          name="(tabs)"
          options={{ headerShown: false }}
        />,
        <Stack.Screen
          name="product"
          key="product"
          options={{
            // presentation: "transparentModal",
            // animation: "slide_from_right",
            headerShown: false,
          }}
        />,
      ]}
    ></Stack>
  );
}

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};
