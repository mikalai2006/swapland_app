import { View, Text } from "react-native";
import React from "react";
import { useObject } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import { useColorScheme } from "nativewind";
import { BSON } from "realm";
import { AddressSchema } from "@/schema/AddressSchema";

export type ProductLocationProps = {
  userId: string | undefined;
  addressId: string;
};

const ProductLocation = ({ userId, addressId }: ProductLocationProps) => {
  const { colorScheme } = useColorScheme();

  const user = useObject(UserSchema, new BSON.ObjectId(userId));

  const address = useObject(AddressSchema, new BSON.ObjectId(addressId));

  return address?.address ? (
    <View className="flex flex-row gap-2 items-center">
      {/* <SIcon
        path="iGeoAlt"
        size={12}
        color={colorScheme === "dark" ? Colors.s[200] : Colors.s[500]}
      /> */}
      <Text
        className="text-base text-g-950 dark:text-s-200 leading-5"
        numberOfLines={1}
        lineBreakMode="tail"
      >
        {address?.address.country},{" "}
        {address?.address.village ||
          address?.address.town ||
          address?.address.city}
        , {address.address.road}
      </Text>
    </View>
  ) : (
    <View></View>
  );
};

export default ProductLocation;
