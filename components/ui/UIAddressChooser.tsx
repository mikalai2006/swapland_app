import React from "react";
import { Text, View } from "react-native";

import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import UIButton from "./UIButton";
import { router } from "expo-router";
import RText from "../r/RText";
import SIcon from "./SIcon";
import { useObject } from "@realm/react";
import { AddressSchema } from "@/schema/AddressSchema";
import { BSON } from "realm";

export interface IUIAddressChooserProps {
  value: string;
  title?: string;
}

const UIAddressChooser = ({ value, title }: IUIAddressChooserProps) => {
  const address = useObject(AddressSchema, new BSON.ObjectId(value));

  const userFromStore = useAppSelector(user);

  return (
    <View>
      <Text className="text-md text-s-500 dark:text-s-400 mb-1.5">{title}</Text>
      <UIButton
        type="link"
        onPress={() => {
          router.navigate({
            pathname: "/address/[userId]",
            params: {
              userId: userFromStore?.id,
            },
          });
          router.setParams({ addressId: value });
        }}
        className=" border border-s-200 dark:border-s-700 p-4 rounded-lg"
      >
        <View className="flex flex-row items-center gap-4">
          {/* <View className="flex-auto"><RText>Категория:</RText></View> */}
          <View className="flex-auto">
            {address?.address ? (
              <RText className="text-p-500 font-bold text-lg leading-5">
                {/* {JSON.stringify(value)} */}
                {address.address.country},{" "}
                {address.address.village ||
                  address.address.city ||
                  address.address.town}
                , {address.address.road}
              </RText>
            ) : (
              <RText>Укажите адрес</RText>
            )}
          </View>
          <View>
            <SIcon path="iChevronRight" size={20} />
          </View>
        </View>
      </UIButton>
    </View>
  );
};

export default UIAddressChooser;
