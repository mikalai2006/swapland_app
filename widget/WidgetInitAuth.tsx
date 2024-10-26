import { router, usePathname } from "expo-router";
import React from "react";
import useAuth from "@/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";
import { tokens } from "@/store/storeSlice";
// import NetInfo from "@react-native-community/netinfo";

export default function () {
  const { onGetIam, isAccessTokenExpired, onSyncToken } = useAuth();
  const tokensFromStore = useAppSelector(tokens);
  const pathname = usePathname();

  React.useEffect(() => {
    const onCheck = async () => {
      try {
        // const stateNet = await NetInfo.fetch();
        // if (!stateNet.isConnected) {
        //   return;
        // }

        // const _tokensFromStore = await onSyncToken();
        // console.log("WidgetInitAuth: token.access_token=", _tokensFromStore);

        if (!tokensFromStore) {
          console.log("WidgetInitAuth: Go to auth screen");
          router.navigate("/modalauth");
        } else if (pathname === "/modalauth") {
          console.log("WidgetInitAuth: Go to auth preview screen", pathname);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.navigate("/");
          }
        }
      } catch (e: Error | any) {
        console.log("WidgetInitAuth error: ", e.message);
      }
    };

    onCheck();
  }, [tokensFromStore]);

  React.useEffect(() => {
    // console.log("WidgetInitAuth useEffect ", tokensFromStore);
    const onCheck = async () => {
      try {
        // const stateNet = await NetInfo.fetch();
        // if (!stateNet.isConnected) {
        //   return;
        // }

        if (tokensFromStore?.access_token !== "" && !isAccessTokenExpired()) {
          // console.log("WidgetInitAuth onGetIam: ");
          // console.log('WidgetInitAuth: Get user info');
          await onGetIam();
        } else {
          // router.navigate("/(tabs)");
        }
      } catch (e: Error | any) {
        console.log("WidgetInitAuth error: ", e.message);
      }
    };

    onCheck();
  }, [tokensFromStore]);

  return <></>;
}
