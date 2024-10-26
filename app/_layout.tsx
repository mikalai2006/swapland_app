import "react-native-get-random-values";
import { useEffect } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { store, persistor } from "../store/store";

import "../tailwind.css";
import "../localization/i18n";

import { useColorScheme } from "nativewind";
import { Colors } from "@/utils/Colors";

import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import WidgetInitAuth from "@/widget/WidgetInitAuth";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WidgetInitApp } from "@/widget/WidgetInitApp";
import WidgetEvents from "@/widget/WidgetEvents";

import { router, Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { RealmProvider } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import { ImageSchema } from "@/schema/ImageSchema";
import { LocationSchema, UserSchema } from "@/schema/UserSchema";
import { OfferSchema } from "@/schema/OfferSchema";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { MessageSchema } from "@/schema/MessageSchema";
import { MessageRoomSchema } from "@/schema/MessageRoomSchema";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      }
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();

  const { colorScheme } = useColorScheme();
  // const tokensFromStore = useAppSelector(tokens);

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RealmProvider
      schema={[
        ProductSchema,
        ImageSchema,
        UserSchema,
        LocationSchema,
        OfferSchema,
        QuestionSchema,
        MessageSchema,
        MessageRoomSchema,
      ]}
      inMemory
    >
      <Provider store={store}>
        <PersistGate
          loading={
            <>
              <StatusBar translucent backgroundColor="transparent" />
              <ActivityIndicator />
            </>
          }
          persistor={persistor}
        >
          <WidgetInitApp />
          <GestureHandlerRootView style={styles.root}>
            <View style={styles.view} className="bg-s-100 dark:bg-s-950">
              <Stack
                // initialRouteName="auth"
                screenOptions={{
                  headerTitleAlign: "center",
                  presentation: "fullScreenModal",
                  headerStyle: {
                    backgroundColor:
                      colorScheme === "dark" ? Colors.s[950] : Colors.s[100],
                  },
                  headerTintColor:
                    colorScheme === "dark" ? Colors.s[200] : Colors.s[800],
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modalcategory"
                  options={{
                    title: "Выберите категорию",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modalpicker"
                  options={{
                    title: "Добавление изображения",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modalfilter"
                  options={{
                    title: "Настройка фильтра",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modalsort"
                  options={{
                    title: "Настройка сортировки",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    // headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="product"
                  options={{
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="user"
                  options={{
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modalauth"
                  options={{
                    title: "Авторизация",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modaloffer"
                  options={{
                    // title: "Предложение",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modaldarom"
                  options={{
                    // title: "Предложение",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="modalquestion"
                  options={{
                    // title: "Вопросы",
                    // presentation: "transparentModal",
                    // animation: "slide_from_right",
                    headerShown: false,
                  }}
                />

                <Stack.Screen
                  name="auth"
                  options={{
                    headerShown: false,
                    // presentation: 'transparentModal',
                    // animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="modalmessage"
                  options={{
                    headerShown: false,
                    // presentation: 'transparentModal',
                    // animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="modaldeal"
                  options={{
                    headerShown: false,
                    // presentation: 'transparentModal',
                    // animation: "slide_from_bottom",
                  }}
                />
                <Stack.Screen
                  name="modalcreate"
                  options={{
                    title: "Редактор лота",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      color:
                        colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
                    },
                    // headerLeft: () => (
                    //   <UIButton
                    //     text="Мои лоты"
                    //     type="secondary"
                    //     icon="iArrowLeftAndroid"
                    //     className="pl-0 pr-6"
                    //     onPress={() => router.back()}
                    //   />
                    // ),
                  }}
                />
                {/* <Stack.Screen
                  name="giveactions"
                  options={{
                    // headerShown: false,
                    title: "Активность лота",
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                      color:
                        colorScheme === "dark" ? Colors.s[200] : Colors.s[900],
                    },
                    // headerLeft: () => (
                    //   <UIButton
                    //     text="Мои лоты"
                    //     type="secondary"
                    //     icon="iArrowLeftAndroid"
                    //     className="pl-0 pr-6"
                    //     onPress={() => router.back()}
                    //   />
                    // ),
                  }}
                /> */}
                <Stack.Screen name="+not-found" />
              </Stack>
            </View>
          </GestureHandlerRootView>
          <WidgetInitAuth />
          <WidgetEvents />
        </PersistGate>
      </Provider>
    </RealmProvider>
  );
}

const styles = {
  root: { flex: 1, paddingTop: 0 },
  view: { flex: 1 },
};
