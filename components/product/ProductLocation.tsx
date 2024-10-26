import { View, Text } from "react-native";
import React, { useMemo } from "react";
import { useObject, useQuery } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import SIcon from "../ui/SIcon";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import { BSON } from "realm";

export type ProductLocationProps = {
  userId: string | undefined;
};

const ProductLocation = ({ userId }: ProductLocationProps) => {
  const { colorScheme } = useColorScheme();

  const user = useObject(UserSchema, new BSON.ObjectId(userId));

  return user ? (
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
        {user.location?.address.city}, {user.location?.address.country}
      </Text>
    </View>
  ) : (
    <View></View>
  );
};

export default ProductLocation;
