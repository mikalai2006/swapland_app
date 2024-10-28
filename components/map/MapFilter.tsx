import { useAssets } from "expo-asset";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import UIButton from "../ui/UIButton";
import {
  filter,
  setFilterAddress,
  setFilterDistance,
  user,
  zoom,
} from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Card from "../Card";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import SIcon from "../ui/SIcon";
import { router, useGlobalSearchParams } from "expo-router";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI } from "@/utils/global";
import { IAddress, ILatLon } from "@/types";
import UICounter from "../ui/UICounter";

type Props = {};

const MapFilter = (props: Props) => {
  // const glob = useGlobalSearchParams<{ address: string }>();
  const dispatch = useAppDispatch();

  const filterFormStore = useAppSelector(filter);

  const address = useMemo(
    () => (filterFormStore.address ? filterFormStore.address : null),
    [filterFormStore.address]
  );

  const userFromStore = useAppSelector(user);

  const { colorScheme } = useColorScheme();

  const [center, setCenter] = useState<ILatLon>({ lat: 0, lon: 0 });

  const [distance, setDistance] = useState<number>(
    filterFormStore.distance || 3
  );

  useEffect(() => {
    if (address) {
      setCenter({
        lat: address.lat,
        lon: address.lon,
      });
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const [assets] = useAssets([require("@/assets/index.html")]);

  const [htmlString, setHtmlString] = useState<string>();

  const dimensions = useWindowDimensions();

  const webViewRef = useRef<WebView | null>();

  const zoomToGeoJSON = () => {
    //webViewRef.current?.injectJavaScript("window.zoomToGeoJSON(); true");
  };

  //   useEffect(() => {
  //     if (userFromStore?.location) {
  //       console.log(userFromStore?.location);
  //       sendMessage({
  //         msg: "center",
  //         center: {
  //           lat: userFromStore.location.lat,
  //           lon: userFromStore.location.lon,
  //         },
  //       });
  //     }
  //   }, []);

  const sendMessage = useCallback((payload: any) => {
    webViewRef.current?.postMessage(JSON.stringify(payload));
    // webViewRef.current?.injectJavaScript(
    //   `window.postMessage(${JSON.stringify(payload)}, '*');`
    //   );
    // logMessage(`sending: ${JSON.stringify(payload)}`);
  }, []);

  useEffect(() => {
    if (assets) {
      fetch(assets[0].localUri || "")
        .then((res) => res.text())
        .then((html) => {
          setHtmlString(html);
        });
    }
  }, [assets]);

  const messageHandler = (e: WebViewMessageEvent) => {
    const message = JSON.parse(e.nativeEvent.data);
    switch (message.event) {
      case "center":
        setCenter(message.data);
        break;
      case "ready":
        sendMessage({
          msg: "init",
          center: center.lat
            ? [center.lon, center.lat]
            : [
                userFromStore?.location?.lon || 0,
                userFromStore?.location?.lat || 0,
              ],
          zoom: userFromStore?.location ? 15 : 5,
          theme: colorScheme,
        });

        break;

      default:
        break;
    }

    // const coords = JSON.parse(e.nativeEvent.data) as [number, number];
    // onMapPress(coords);
  };

  const { onFetchWithAuth } = useFetchWithAuth();

  const onSave = async () => {
    setLoading(true);
    await onFetchWithAuth(`${hostAPI}/address/address`, {
      method: "POST",
      body: JSON.stringify({ ...center }),
    })
      .then((res) => res.json())
      .then((res: IAddress) => {
        setCenter({
          lat: res.lat,
          lon: res.lon,
        });
        dispatch(setFilterAddress(res));
        // router.setParams({ address: JSON.stringify(res) });
      })
      .catch((e) => e)
      .finally(() => {
        setLoading(false);
      });

    dispatch(setFilterDistance(distance));
  };

  if (!htmlString) {
    return <></>;
  }

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <WebView
        ref={(r) => (webViewRef.current = r)}
        injectedJavaScript=""
        source={{
          html: htmlString,
        }}
        javaScriptEnabled
        style={{
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor:
            colorScheme === "dark" ? Colors.s[950] : Colors.s[200],
        }}
        scrollEnabled={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scalesPageToFit={false}
        containerStyle={{ flex: 1 }}
        onMessage={messageHandler}
      />
      <View className="absolute top-12 left-0 right-0 flex items-center">
        <Card className="">
          <Text className="mx-4 text-lg text-s-800 dark:text-s-200 leading-5">
            Перемещайте карту, чтобы установить маркер в нужное место
          </Text>
        </Card>
      </View>
      <View className="absolute bottom-2 left-0 right-0 flex items-center">
        <Card className="">
          <UICounter
            initValue={3}
            max={100}
            value={distance.toString()}
            onChangeValue={setDistance}
          />
          {center.lat != address?.lat && (
            <View>
              <Text className="text-lg text-s-800 dark:text-s-200 leading-5">
                Нажмите сохранить, чтобы зафиксировать позицию{" "}
                {/* {JSON.stringify(address)} */}
                {JSON.stringify(center)}
              </Text>
              <View className="self-center">
                <UIButton
                  text="Сохранить"
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  onPress={() => {
                    onSave();
                    // sendMessage({
                    //   msg: "center",
                    //   center: { lat: 53.171386336718854, lon: 29.180430864870228 },
                    // });
                  }}
                />
              </View>
            </View>
          )}
        </Card>
      </View>

      <View className="absolute top-0 left-0 bottom-0 right-0 flex items-center z-50 justify-center pointer-events-none">
        <View style={{ marginTop: -48 }}>
          <SIcon
            path="iMarkerCenter"
            size={55}
            color={colorScheme === "dark" ? Colors.s[200] : Colors.s[800]}
          />
        </View>
      </View>
      {loading && (
        <View className="absolute top-0 left-0 bottom-0 right-0 flex items-center z-50 justify-center">
          <View style={{ marginTop: -62 }}>
            <ActivityIndicator size={43} color={Colors.s[200]} />
          </View>
        </View>
      )}
    </View>
  );
};

export default MapFilter;
