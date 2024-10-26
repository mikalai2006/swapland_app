import { Text, View, ScrollView } from "react-native";

import { hostAPI } from "@/utils/global";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTokens, tokens, user } from "@/store/storeSlice";
import { useEffect, useMemo, useState } from "react";
import UIButton from "@/components/ui/UIButton";
import { ITokenResponse } from "@/types";
import useAuth from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import UIInput from "@/components/ui/UIInput";
import Card from "@/components/Card";
import RText from "@/components/r/RText";
import SIcon from "@/components/ui/SIcon";
import UserSettingAvatar from "@/components/user/UserSettingAvatar";
import SwitchMode from "@/components/SwitchMode";
import UserSettingForm from "@/components/user/UserSettingForm";
import UserSettingGeo from "@/components/user/UserSettingGeo";
import { getNoun } from "@/utils/utils";

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
          {tokensFromStore?.access_token ? (
            <>
              <UserSettingAvatar />
              <Card className="my-4">
                <Text className="mb-4 text-2xl font-bold text-center text-s-800 dark:text-s-200">
                  {userFromStore?.bal}{" "}
                  {getNoun(userFromStore?.bal, "балл", "балла", "баллов")}
                </Text>
                <UIButton
                  type="secondary"
                  text="Пополнить баллы"
                  icon="iChevronRight"
                  startText
                />
              </Card>
              <UserSettingForm />
              <Card className="mt-4">
                <UserSettingGeo />
              </Card>
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
