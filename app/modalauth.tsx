import Card from "@/components/Card";
import RText from "@/components/r/RText";
import RTitle from "@/components/r/RTitle";
import SIcon from "@/components/ui/SIcon";
import UIButton from "@/components/ui/UIButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Text, View } from "react-native";

import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { hostAPI } from "@/utils/global";
import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { setTokens, tokens } from "@/store/storeSlice";
import { ITokenResponse } from "@/types";

export default function Modal() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const tokensFromStore = useAppSelector(tokens);

  const [result, setResult] = useState("");
  const goAuth = async (path: string) => {
    const schemas = Linking.collectManifestSchemes();
    console.log("schemas: ", schemas);

    let result = await WebBrowser.openBrowserAsync(`${hostAPI}${path}`);
    setResult(result.type);
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const urlSearchParams = url.split("?");
      const urlParamsArray =
        urlSearchParams.length > 0 ? urlSearchParams[1]?.split("&") : [];
      const tokensData: ITokenResponse = urlParamsArray.length
        ? Object.fromEntries(urlParamsArray.map((x) => x.split("=")))
        : [];
      // console.log("URL: ", url);
      console.log("tokensData: ", tokensData);
      if (tokensData) {
        dispatch(
          setTokens({
            access_token: tokensData.token,
            refresh_token: tokensData.rt,
            expires_in: parseInt(tokensData.exp.toString(), 10),
            expires_in_r: parseInt(tokensData.expr.toString(), 10),
          })
        );
      }
      WebBrowser.dismissBrowser();
    });
    return () => subscription.remove();
  }, []);

  // const callbackBeforeRemoveRoute = useCallback(
  //   (e) => {
  //     if (tokensFromStore) {
  //       console.log(
  //         "callbackBeforeRemoveRoute ",
  //         tokensFromStore,
  //         !tokensFromStore
  //       );

  //       e.preventDefault();
  //       console.log("onback");
  //       // Do your stuff here
  //       //navigation.dispatch(e.data.action);
  //     }
  //   },
  //   [tokensFromStore]
  // );

  // useEffect(() => {
  //   navigation.addListener("beforeRemove", callbackBeforeRemoveRoute);

  //   return () => {
  //     navigation.removeListener("beforeRemove", callbackBeforeRemoveRoute);
  //   };
  // }, [tokensFromStore]);

  return (
    <View className="flex-1">
      <View className="absolute top-0 bottom-0 right-0 left-0 bg-white/90 dark:bg-black/90" />
      <View className="p-4 absolute bottom-12 left-0 right-0">
        {/* <Card>
          <RTitle text="Рефреш" />
          <Text className="text-s-500">{JSON.stringify(tokensFromStore)}</Text>
        </Card> */}
        <Card>
          <RTitle text="Авторизация" />
          <RText>
            Авторизируйтесь, чтобы открыть доступ ко всем функциям приложения
          </RText>
          <View className="mt-4 flex flex-row flex-wrap gap-4">
            <UIButton type="secondary" onPress={() => goAuth("/oauth/google")}>
              <View className="flex flex-row items-center gap-4 p-4">
                <SIcon path="iGoogle" type="secondary" size={30} />
                <RText className="text-s-900 dark:text-s-200 text-center font-bold text-xl">
                  Google
                </RText>
              </View>
            </UIButton>
            <UIButton type="secondary" onPress={() => goAuth("/oauth/google")}>
              <View className="flex flex-row items-center gap-4 p-4">
                <SIcon path="iYandex" type="secondary" size={30} />
                <RText className="text-s-900 dark:text-s-200 text-center font-bold text-xl">
                  Яндекс
                </RText>
              </View>
            </UIButton>
            <UIButton type="secondary" onPress={() => goAuth("/oauth/google")}>
              <View className="flex flex-row items-center gap-4 p-4">
                <SIcon path="iVk" type="secondary" size={30} />
                <RText className="text-s-900 dark:text-s-200 text-center font-bold text-xl">
                  Вконтакте
                </RText>
              </View>
            </UIButton>
          </View>
        </Card>
      </View>
    </View>
  );
}
