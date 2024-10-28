import { Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import { user } from "@/store/storeSlice";
import { useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { hostAPI } from "@/utils/global";
import useAuth from "@/hooks/useAuth";

import * as Location from "expo-location";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";

export type IMapMyLocationProps = {
  callback: (location: Location.LocationObject) => void;
};

const MapMyLocation = ({ callback }: IMapMyLocationProps) => {
  const { t } = useTranslation();

  const { onGetIam } = useAuth();

  const userFromStore = useAppSelector(user);

  const { onFetchWithAuth } = useFetchWithAuth();

  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const onGetGeo = useCallback(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      callback(location);
      // if (userFromStore?.id) {
      //   setLoading(true);
      //   await onFetchWithAuth(`${hostAPI}/user/${userFromStore?.id}/location`, {
      //     method: "PATCH",
      //     body: JSON.stringify({
      //       lat: location.coords.latitude,
      //       lon: location.coords.longitude,
      //     }),
      //   })
      //     .then((res) => res.json())
      //     .then((res: any) => {
      //       onGetIam();
      //       callback(location);
      //     })
      //     .catch((e) => {
      //       console.log("MapMyLocation Error", e);
      //     })
      //     .finally(() => {
      //       setLoading(false);
      //     });
      // }
    })();
  }, []);

  const locationFromDb = useMemo(
    () => userFromStore?.location,
    [userFromStore?.location]
  );

  return (
    <View>
      {/* <Text className="text-lg text-s-800 dark:text-s-200">
        Текущее местонахождение:
      </Text>
      {locationFromDb?.address && (
        <Text className="text-lg font-bold text-s-800 dark:text-s-200 mb-6">
          {locationFromDb?.address.country}, {locationFromDb?.address.city}
        </Text>
      )} */}
      <UIButton
        type="link"
        loading={loading}
        // disabled={loading}
        className="p-4 bg-p-500 rounded-full"
        onPress={onGetGeo}
      >
        <SIcon path="iCenterLocation" size={30} color={Colors.white} />
      </UIButton>
      {/* <Text className="text-base text-s-800 dark:text-s-200">
        {JSON.stringify(location)}
        {locationFromDb}
      </Text> */}
    </View>
  );
};

export default MapMyLocation;
