import Card from "@/components/Card";
import SIcon from "@/components/ui/SIcon";
import UIButton from "@/components/ui/UIButton";
import UIButtonBack from "@/components/ui/UIButtonBack";
import UILabel from "@/components/ui/UILabel";
import useAddresses from "@/hooks/useAddresses";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { AddressSchema } from "@/schema/AddressSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { Colors } from "@/utils/Colors";
import { hostAPI } from "@/utils/global";
import { useQuery } from "@realm/react";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddressesScreen() {
  const params = useLocalSearchParams<{ userId: string }>();
  const glob = useGlobalSearchParams<{ addressId: string }>();

  const { colorScheme } = useColorScheme();
  //   console.log("glob: ", glob);

  const userFromStore = useAppSelector(user);

  const addresses = useQuery(AddressSchema, (items) =>
    items.filtered("userId == $0", params.userId)
  );

  useAddresses({ userId: userFromStore?.id });

  const [loading, setLoading] = useState(false);

  const { onFetchWithAuth } = useFetchWithAuth();

  const onCreateAddress = async () => {
    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/address`, {
      method: "POST",
      body: JSON.stringify({
        userId: params.userId,
      }),
    })
      .then((res) => res.json())
      .then((res: any) => {})
      .catch((e) => {
        console.log("AddressesScreen Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return addresses ? (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          {/* <View className="flex-auto">
            <ProductShortInfo id={product?._id.toString()} />
          </View> */}
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          <View className="p-4">
            <View className="">
              {/* <UILabel text="Адреса" /> */}
              <View className="flex gap-2">
                {/* <Text>{JSON.stringify(addresses)}</Text> */}
                {addresses.map((adr) => (
                  <UIButton
                    key={adr._id.toString()}
                    type="secondary"
                    className="p-0"
                    onPress={() => {
                      if (glob?.addressId) {
                        router.back();
                        router.setParams({
                          addressId: adr._id.toString(),
                        });
                      } else {
                        router.navigate("/mapaddaddress");
                        router.setParams({
                          address: JSON.stringify(adr),
                        });
                      }
                    }}
                  >
                    <View
                      className={`rounded-lg p-4  ${
                        glob.addressId === adr._id.toString()
                          ? " bg-p-300 dark:bg-p-300"
                          : " bg-white dark:bg-s-800 "
                      }`}
                    >
                      <View className="flex-row gap-4">
                        {glob?.addressId && (
                          <View className="w-6 h-6 items-center justify-center">
                            {/* <SIcon path="iCheckLg" size={20} /> */}
                            {glob.addressId === adr._id.toString() && (
                              <SIcon
                                path="iCheckLg"
                                size={30}
                                color={
                                  colorScheme === "dark"
                                    ? Colors.black
                                    : Colors.black
                                }
                              />
                            )}
                          </View>
                        )}
                        <View className="flex-auto">
                          <View>
                            <Text
                              className={`text-lg leading-5 ${
                                glob.addressId === adr._id.toString()
                                  ? "text-black dark:text-black"
                                  : "text-s-800 dark:text-s-200"
                              }`}
                            >
                              {/* {adr.address.country},{" "}
                              {adr.address.city || adr.address.town},{" "}
                              {adr.address.road} */}
                              {adr.dAddress}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row gap-4">
                          {!glob.addressId && (
                            // <UIButton
                            //   type="secondary"
                            //   onPress={() => {
                            //     router.navigate("/mapaddaddress");
                            //     router.setParams({
                            //       address: JSON.stringify(adr),
                            //     });
                            //   }}
                            // />
                            <SIcon path="iPen" size={20} />
                          )}
                        </View>
                      </View>
                    </View>
                  </UIButton>
                ))}
              </View>
            </View>
            {addresses?.length <= 3 && (
              <View className="mt-4">
                <UIButton
                  type="primary"
                  text="Добавить адрес"
                  onPress={() => {
                    router.navigate("/mapaddaddress");
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  ) : (
    <Text>Not found addresses</Text>
  );
}
