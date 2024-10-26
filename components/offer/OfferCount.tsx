import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { getNoun } from "@/utils/utils";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { BSON } from "realm";

export type IOfferCountProps = {
  productId: BSON.ObjectId;
};

export default function OfferCount({ productId }: IOfferCountProps) {
  const userFromStore = useAppSelector(user);

  const offers = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", productId.toString());
  });
  const disableOffers = useMemo(() => {
    return offers.filter((x) => x.status < 0);
  }, [offers]);

  return offers.length ? (
    <View>
      <Text className="text-lg text-s-900 dark:text-s-200 leading-5 mb-2">
        {offers.length}{" "}
        {getNoun(
          offers.length,
          "пользователь",
          "пользователя",
          "пользователей"
        )}{" "}
        {getNoun(offers.length, "сделал", "сделали", "сделали")} ставку
        {disableOffers.length
          ? ` (${disableOffers.length} ${getNoun(
              disableOffers.length,
              "отказ",
              "отказа",
              "отказов"
            )})`
          : ""}
      </Text>
    </View>
  ) : (
    <Text className="text-g-700 dark:text-s-200 text-lg">
      Пока никто не сделал ставку
    </Text>
  );
}
