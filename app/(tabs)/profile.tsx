import { Text, View, ScrollView } from "react-native";

// import { hostAPI } from "@/utils/global";
// import * as WebBrowser from "expo-web-browser";
// import * as Linking from "expo-linking";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { tokens, user } from "@/store/storeSlice";
import UIButton from "@/components/ui/UIButton";
import useAuth from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "@/components/Card";
import SIcon from "@/components/ui/SIcon";
import UserSettingAvatar from "@/components/user/UserSettingAvatar";
import SwitchMode from "@/components/SwitchMode";
import { getNoun } from "@/utils/utils";
import { router } from "expo-router";

export default function TabProfileScreen() {
  const dispatch = useAppDispatch();

  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  const { onLogout } = useAuth();

  return (
    <ScrollView className="bg-s-200 dark:bg-s-950">
      <SafeAreaView>
        <View className="flex-1 p-4">
          <SwitchMode />
          {userFromStore && tokensFromStore?.access_token ? (
            <>
              <UserSettingAvatar />

              <Card className="my-4">
                <View className="py-2 border-b border-s-100 dark:border-s-800">
                  <UIButton
                    type="link"
                    onPress={() => {
                      router.navigate({
                        pathname: "/address/[userId]",
                        params: {
                          userId: userFromStore.id,
                        },
                      });
                    }}
                  >
                    <View className="flex-row gap-4">
                      <Text className="flex-auto text-lg text-s-800 dark:text-s-200">
                        {userFromStore.name}
                      </Text>
                      <SIcon path="iChevronRight" size={20} />
                    </View>
                  </UIButton>
                </View>
                <View className="py-2 flex-row gap-4 items-center border-b border-s-100 dark:border-s-800">
                  <Text className="flex-auto px-4 text-xl font-bold text-s-800 dark:text-s-200">
                    {userFromStore?.bal}{" "}
                    {getNoun(userFromStore?.bal, "балл", "балла", "баллов")}
                  </Text>
                  <UIButton
                    type="secondary"
                    text="Пополнить"
                    icon="iChevronRight"
                    startText
                  />
                </View>
                <View className="py-2">
                  <UIButton
                    type="link"
                    onPress={() => {
                      router.navigate({
                        pathname: "/address/[userId]",
                        params: {
                          userId: userFromStore.id,
                        },
                      });
                    }}
                  >
                    <View className="flex-row gap-4">
                      <Text className="flex-auto text-lg text-s-800 dark:text-s-200">
                        Мои адреса
                      </Text>
                      <SIcon path="iChevronRight" size={20} />
                    </View>
                  </UIButton>
                </View>
              </Card>

              {/* <UserSettingForm />
              <Card className="mt-4">
                <UserSettingGeo />
              </Card> */}
              <View className="mt-4">
                <Card>
                  <UIButton type="link" onPress={onLogout}>
                    <View className="flex flex-row items-center gap-4">
                      <Text className="text-red-800 dark:text-red-200 text-center text-xl">
                        Выйти из аккаунта
                      </Text>
                    </View>
                  </UIButton>
                </Card>
              </View>
            </>
          ) : (
            <Card>
              {/* <RText>
                Авторизируйтесь, используя один из сервисов и вперед совершать
                обмены
              </RText>
              <UIButton
                type="secondary"
                onPress={() => goAuth("/oauth/google")}
              >
                <View className="flex flex-row items-center gap-4 p-4">
                  <SIcon path="iGoogle" type="secondary" size={25} />
                  <Text className="text-s-900 dark:text-s-200 text-center text-xl">
                    Google
                  </Text>
                </View>
              </UIButton> */}
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
