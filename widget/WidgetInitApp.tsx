import React, { useEffect, useMemo } from "react";
import { NativeModules, Platform } from "react-native";
import { hostAPI } from "@/utils/global";

import {
  activeLanguage,
  setLanguages,
  langCode,
  languages,
  setCategories,
} from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import useFetch from "@/hooks/useFetch";
import useLanguage from "@/hooks/useLanguage";

export const WidgetInitApp = () => {
  const { onFetch } = useFetch();

  // const {isInternetReachable} = useNetInfo();

  const dispatch = useAppDispatch();
  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const activeLangCode = useAppSelector(langCode);
  // console.log('activeLangCode=', activeLangCode);

  const { onChooseLanguage, onChangeLocale } = useLanguage();
  const languagesFromStore = useAppSelector(languages);
  const deviceLanguage = useMemo(() => {
    const appLang =
      Platform.OS === "ios"
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
        : NativeModules.I18nManager.localeIdentifier;
    const appLangCode = appLang.split("_")[0];
    return appLangCode;
  }, []);

  useEffect(() => {
    onChangeLocale(activeLangCode || deviceLanguage);
  }, []);

  const setFirstRunSettings = () => {
    if (!activeLangCode || languagesFromStore.length === 0) {
      console.log(
        "First run app: deviceLanguage=",
        deviceLanguage,
        activeLangCode
      );
      if (deviceLanguage) {
        onChooseLanguage(deviceLanguage);
        // dispatch(setAppState({alreadyUse: true}));
      }
    } else {
      onChangeLocale(activeLangCode);
    }
  };

  useEffect(() => {
    const onFetching = async () => {
      try {
        const onFindLanguages = async () => {
          await onFetch(
            hostAPI +
              "/lang?" +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              if (r.data?.length) {
                // console.log('r.data=', r.data);
                dispatch(setLanguages(r.data));
              }
            })
            .catch((e) => {
              throw e;
            })
            .finally(() => {
              setFirstRunSettings();
            });
        };
        await onFindLanguages();

        const onFindCategories = async () => {
          await onFetch(
            hostAPI +
              "/category?" +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
                $limit: "100",
              }),
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          )
            .then((r) => r.json())
            .then((r) => {
              if (r.data?.length) {
                dispatch(setCategories(r.data));
              }
            })
            .catch((e) => {
              throw e;
            });
        };
        await onFindCategories();
      } catch (e: any) {
        console.log("WidgetInitApp error: ", e.message);
      } finally {
      }
    };

    onFetching();
  }, []);

  return null;
  // !isInternetReachable ? (
  //     <View tw="absolute top-12 px-6 w-full">
  //         <Text tw="text-s-200 text-lg text-center">For first start app need internet!</Text>
  //     </View>
  // ) :
};
