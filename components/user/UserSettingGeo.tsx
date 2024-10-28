import { Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import { user } from "@/store/storeSlice";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { hostAPI } from "@/utils/global";
import useAuth from "@/hooks/useAuth";
import Card from "../Card";

import * as Location from "expo-location";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";

const UserSettingGeo = () => {
  const { t } = useTranslation();

  const { onGetIam } = useAuth();

  const userFromStore = useAppSelector(user);

  const { onFetchWithAuth } = useFetchWithAuth();

  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const onGetGeo = useCallback(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      if (userFromStore?.id) {
        await onFetchWithAuth(`${hostAPI}/user/${userFromStore?.id}/location`, {
          method: "PATCH",
          body: JSON.stringify({
            lat: location.coords.latitude,
            lon: location.coords.longitude,
          }),
        })
          .then((res) => res.json())
          .then((res: any) => {
            onGetIam();
          })
          .catch((e) => {
            console.log("UserSettingGeo Error", e);
          });
      }
    })();
  }, []);

  const locationFromDb = useMemo(
    () => userFromStore?.location,
    [userFromStore?.location]
  );

  return (
    <View>
      <Text className="text-lg text-s-800 dark:text-s-200">
        Текущее местонахождение:
      </Text>
      {locationFromDb?.address && (
        <Text className="text-lg font-bold text-s-800 dark:text-s-200 mb-6">
          {locationFromDb?.address.country}, {locationFromDb?.address.city}
        </Text>
      )}
      <UIButton
        text="Получить мое геоположение"
        type="secondary"
        onPress={onGetGeo}
      />
      {/* <Text className="text-base text-s-800 dark:text-s-200">
        {JSON.stringify(location)}
        {locationFromDb}
      </Text> */}
    </View>
  );
};

export default UserSettingGeo;
