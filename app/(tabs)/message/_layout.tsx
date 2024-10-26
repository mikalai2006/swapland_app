import React from "react";
import { Text, View } from "react-native";

import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

import { Colors } from "@/utils/Colors";
import { router, Stack, withLayoutContext } from "expo-router";
import { useColorScheme } from "nativewind";

import UIButton from "@/components/ui/UIButton";
import { SafeAreaView } from "react-native-safe-area-context";
import LotsTabBar from "@/components/navigate/LotsTabBar";
import useOffers from "@/hooks/useOffers";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import SIcon from "@/components/ui/SIcon";
import BadgeTabQuestion from "@/components/badge/BadgeTabQuestion";
import BadgeTabMessage from "@/components/badge/BadgeTabMessage";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
  const { colorScheme } = useColorScheme();
  const userFromStore = useAppSelector(user);

  // useOffers({ userId: userFromStore?.id });

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <MaterialTopTabs tabBar={(props) => <LotsTabBar {...props} />}>
          <MaterialTopTabs.Screen
            name="room"
            options={{
              title: "Сообщения",
              tabBarIcon: ({ color, focused }) => (
                <View className="absolute top-4 right-3">
                  <BadgeTabMessage />
                </View>
              ),
            }}
          />
          <MaterialTopTabs.Screen
            name="question"
            options={{
              title: "Вопросы",
              tabBarIcon: ({ color, focused }) => (
                <View className="absolute top-4 right-3">
                  <BadgeTabQuestion />
                </View>
              ),
            }}
          />
        </MaterialTopTabs>
      </SafeAreaView>
    </View>
  );
  // (
  //   <Stack
  //     screenOptions={{
  //       headerTitleAlign: "center",
  //       headerStyle: {
  //         backgroundColor:
  //           colorScheme === "dark" ? Colors.s[950] : Colors.white,
  //       },
  //     }}
  //   >
  //     <Stack.Screen
  //       name="index"
  //       // listeners={{
  //       //   focus: () => {
  //       //     console.log("focus");
  //       //   },
  //       // }}
  //       options={{
  //         title: "Мои лоты",
  //         headerTitleAlign: "left",
  //         headerTitleStyle: {
  //           color: colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
  //         },
  //         headerRight: () => (
  //           <View className="mb-3">
  //             <UIButton
  //               text="Добавить"
  //               type="secondary"
  //               icon="iPlus"
  //               onPress={() => router.push("/create")}
  //             />
  //           </View>
  //         ),
  //       }}
  //     />
  //     <Stack.Screen
  //       name="create"
  //       options={{
  //         title: "Редактор лота",
  //         headerTitleAlign: "center",
  //         headerTitleStyle: {
  //           color: colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
  //         },
  //         headerLeft: () => (
  //           <UIButton
  //             text="Мои лоты"
  //             type="secondary"
  //             icon="iArrowLeftAndroid"
  //             className="pl-0 pr-6"
  //             onPress={() => router.back()}
  //           />
  //         ),
  //       }}
  //     />
  //   </Stack>
  // );
}
