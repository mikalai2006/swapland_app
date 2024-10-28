import { Tabs } from "expo-router";

import React, { useEffect, useMemo } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/utils/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "nativewind";
import { IconAwesome5 } from "@/components/navigation/IconAwesome5";
import { IconAwesome6 } from "@/components/navigation/IconAwesome6";
import { View } from "react-native";
import UserTabInfo from "@/components/user/UserTabInfo";

import { modeTheme, user } from "@/store/storeSlice";
import { useAppSelector } from "@/store/hooks";
import FocusStatusBar from "@/components/FocusStatusBar";
import { setMode } from "@/utils/mode";
import SIcon from "@/components/ui/SIcon";
import BadgeTabLots from "@/components/badge/BadgeTabLots";
import BadgeTabMessage from "@/components/badge/BadgeTabMessage";
import useMessagesRooms from "@/hooks/useMessagesRooms";
import useOffers from "@/hooks/useOffers";
import useMessages from "@/hooks/useMessages";
import useAddresses from "@/hooks/useAddresses";

export default function TabLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const userFromStore = useAppSelector(user);

  if (userFromStore?.id) {
    const { messagesRooms } = useMessagesRooms({
      userId: userFromStore?.id,
    });

    useOffers({ userId: userFromStore?.id });

    useAddresses({ userId: userFromStore?.id });
  }
  // const roomIds = useMemo(
  //   () => messagesRooms.map((x) => x._id.toString()) || undefined,
  //   []
  // );
  // useMessages({
  //   roomId: roomIds,
  // });

  const modeThemeFromStore = useAppSelector(modeTheme);
  useEffect(() => {
    console.log("modeThemeFromStore=", modeThemeFromStore);

    setMode(modeThemeFromStore);
    setColorScheme(modeThemeFromStore);
  }, []);

  return (
    <Tabs
      backBehavior="history"
      initialRouteName="list"
      screenOptions={{
        tabBarStyle: {
          // minHeight: 60,
          borderTopWidth: 0,
          shadowColor: "transparent",
          // borderColor: colorScheme === "dark" ? Colors.s[800] : Colors.s[100],
          backgroundColor:
            colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
        },
        // headerShadowVisible: true,
        tabBarActiveBackgroundColor:
          colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
        tabBarActiveTintColor:
          colorScheme === "dark" ? Colors.p[300] : Colors.p[700],
        tabBarInactiveTintColor:
          colorScheme === "dark" ? Colors.s[300] : Colors.s[950],
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Лента",
          tabBarIcon: ({ color, focused }) => (
            <SIcon
              path={focused ? "iViewList" : "iViewList"}
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lots"
        options={{
          title: "Мои лоты",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <SIcon
                path={focused ? "iInboxes" : "iInboxes"}
                size={20}
                color={color} //focused ? Colors.white : Colors.white
              />
              <BadgeTabLots />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "",
          // tabBarActiveTintColor: Colors.white,
          // tabBarInactiveTintColor: Colors.white,
          tabBarItemStyle: {
            borderRadius: 50,
            backgroundColor:
              colorScheme === "dark" ? Colors.s[950] : Colors.s[200],
            maxWidth: 60,
            height: 60,
            // paddingHorizontal: 5,
            // paddingVertical: 15,
            paddingTop: 10,
            marginTop: -6,
            borderColor: colorScheme === "dark" ? Colors.s[900] : Colors.s[100],
            borderWidth: 5,
          },
          tabBarIcon: ({ color, focused }) => (
            <SIcon
              path={focused ? "iPlusLg" : "iPlusLg"}
              size={30}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: "Сообщения",
          tabBarIcon: ({ color, focused }) => (
            <View>
              <SIcon
                path={focused ? "iBell" : "iBell"}
                size={25}
                color={color}
              />
              {/* <View className="w-4 h-4 rounded-full bg-red-500 absolute top-0 right-0 border-2 border-white dark:border-s-950" /> */}
              <BadgeTabMessage />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          // tabBarLabel(props) {
          //   return null;
          // },
          tabBarIcon: ({ color, focused }) =>
            !userFromStore?.images ? (
              <IconAwesome6
                name={focused ? "user" : "user"}
                size={20}
                color={color}
              />
            ) : (
              <UserTabInfo userData={userFromStore} />
            ),
        }}
      />
    </Tabs>
  );
}
