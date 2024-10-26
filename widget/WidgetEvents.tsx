import "react-native-get-random-values";
import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAppSelector } from "@/store/hooks";
import { tokens } from "@/store/storeSlice";
import { useQuery, useRealm } from "@realm/react";
import { IWsMessage } from "@/types";
import { UserSchema } from "@/schema/UserSchema";
import { BSON, UpdateMode } from "realm";
import { ProductSchema } from "@/schema/ProductSchema";
import { OfferSchema } from "@/schema/OfferSchema";
import { MessageSchema } from "@/schema/MessageSchema";
import { MessageRoomSchema } from "@/schema/MessageRoomSchema";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function WidgetEvents() {
  const realm = useRealm();
  const usersFromRealm = useQuery(UserSchema);
  const productsFromRealm = useQuery(ProductSchema);
  const offersFromRealm = useQuery(OfferSchema);
  const messagesFromRealm = useQuery(MessageSchema);
  const messagesRoomsFromRealm = useQuery(MessageRoomSchema);

  const tokensFromStore = useAppSelector(tokens);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/api/v1/ws/room1", [
      `Bearer ${tokensFromStore?.access_token}`,
    ]);
    socket.onmessage = function (event) {
      console.log("event.data: ", event.data);
      const data: IWsMessage = JSON.parse(event.data);

      realm.write(() => {
        try {
          switch (data.service) {
            case "user":
              realm.create(
                "UserSchema",
                {
                  ...data.content,
                  _id: new BSON.ObjectId(data.content.id || data.content._id),
                },
                UpdateMode.Modified
              );
              break;

            case "product":
              realm.create(
                "ProductSchema",
                {
                  ...data.content,
                  _id: new BSON.ObjectId(data.content.id || data.content._id),
                },
                UpdateMode.Modified
              );
              break;

            case "offer":
              realm.create(
                "OfferSchema",
                {
                  ...data.content,
                  _id: new BSON.ObjectId(data.content.id || data.content._id),
                },
                UpdateMode.Modified
              );
              break;

            case "question":
              realm.create(
                "QuestionSchema",
                {
                  ...data.content,
                  _id: new BSON.ObjectId(data.content.id),
                },
                UpdateMode.Modified
              );
              break;

            case "message":
              realm.create(
                "MessageSchema",
                {
                  ...data.content,
                  _id: new BSON.ObjectId(data.content.id || data.content._id),
                },
                UpdateMode.Modified
              );
              break;

            case "messageRoom":
              realm.create(
                "MessageRoomSchema",
                {
                  ...data.content,
                  _id: new BSON.ObjectId(data.content.id || data.content._id),
                },
                UpdateMode.Modified
              );
              break;

            default:
              console.log("UNKNOWN EVENT", event);

              break;
          }

          if (data.content.user) {
            realm.create(
              "UserSchema",
              {
                ...data.content.user,
                _id: new BSON.ObjectId(
                  data.content.user.id || data.content.user._id
                ),
              },
              UpdateMode.Modified
            );
          }
        } catch (e) {
          console.log("WidgetEvents error: ", e);
        }
      });

      // Notifications.scheduleNotificationAsync({
      //   content: {
      //     title: "Look at that notification",
      //     body: data.content,
      //     sound: true,
      //     data: {
      //       url: "/modaloffer/6703ca0e1aa5474e6ea7e2c7",
      //     },
      //   },
      //   trigger: null,
      // });
    };
    console.log("Connect Websocket");

    return () => socket.close();
  }, [tokensFromStore]);

  return null;
  // (
  //   <View
  //     style={{
  //       flex: 1,
  //       alignItems: "center",
  //       justifyContent: "space-around",
  //     }}
  //   >
  //     <Text>Your expo push token: {expoPushToken}</Text>
  //     <Text>{`Channels: ${JSON.stringify(
  //       channels.map((c) => c.id),
  //       null,
  //       2
  //     )}`}</Text>
  //     <View style={{ alignItems: "center", justifyContent: "center" }}>
  //       <Text>
  //         Title: {notification && notification.request.content.title}{" "}
  //       </Text>
  //       <Text>Body: {notification && notification.request.content.body}</Text>
  //       <Text>
  //         Data:{" "}
  //         {notification && JSON.stringify(notification.request.content.data)}
  //       </Text>
  //     </View>
  //     <Button
  //       title="Press to schedule a notification"
  //       onPress={async () => {
  //         await schedulePushNotification();
  //       }}
  //     />
  //   </View>
  // );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" }, url: "/" },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      // console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
