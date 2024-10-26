import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { getNoun } from "@/utils/utils";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { BSON } from "realm";

export type IDaromStatProps = {
  productId: BSON.ObjectId;
};

export default function DaromStat({ productId }: IDaromStatProps) {
  const userFromStore = useAppSelector(user);

  const offers = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", productId.toString());
  });
  const disableOffers = useMemo(() => {
    return offers.filter((x) => x.status < 0);
  }, [offers]);

  // const maxOffer = useMemo(
  //   () => Math.max(...offers.map((x) => x.cost)),
  //   [offers]
  // );

  // const myBet = useMemo(
  //   () => offers.find((x) => x.userId === userFromStore?.id),
  //   [userFromStore, offers]
  // );

  return offers.length ? (
    <View>
      <Text className="text-lg text-g-900 dark:text-s-200 leading-5">
        Уже {getNoun(offers.length, "попросил", "попросили", "попросили")}{" "}
        {offers.length}{" "}
        {getNoun(
          offers.length,
          "пользователь",
          "пользователя",
          "пользователей"
        )}
        {disableOffers.length
          ? ` (${disableOffers.length} ${getNoun(
              disableOffers.length,
              "отказ",
              "отказа",
              "отказов"
            )})`
          : ""}
      </Text>
      {/* {myBet && <DaromUserListItem id={myBet._id} productSid={productSid} />} */}
    </View>
  ) : (
    <Text className="text-g-500 dark:text-s-300 text-lg">
      Пока никто не попросил этот лот.
    </Text>
  );
}
