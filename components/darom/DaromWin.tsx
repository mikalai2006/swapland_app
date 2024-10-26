import { View, Text, Alert } from "react-native";
import React, { useMemo } from "react";
import UserInfo from "../user/UserInfo";
import { useObject, useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { UserSchema } from "@/schema/UserSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { getNoun } from "@/utils/utils";
import BadgeTabLots from "../badge/BadgeTabLots";
import { ProductSchema } from "@/schema/ProductSchema";
import DaromButtonChangeStatus from "./DaromButtonChangeStatus";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { BSON } from "realm";

export type IDaromWinProps = {
  productId: BSON.ObjectId;
};

export default function DaromWin({ productId }: IDaromWinProps) {
  const userFromStore = useAppSelector(user);

  const offers = useQuery(OfferSchema, (items) =>
    items.filtered("productId == $0", productId.toString()).sorted("createdAt")
  );

  const firstOffer = useMemo(
    () => offers.filtered("status != -1")[0],
    [offers]
  );

  const winOffer = useMemo(() => offers.find((x) => x.win === 1), [offers]);

  const userData = useObject(UserSchema, new BSON.ObjectId(firstOffer?.userId));

  const product = useObject(ProductSchema, productId);

  return (
    <View>
      {product && userData ? (
        <View className="bg-gr-50 dark:bg-s-800 p-2 rounded-lg pr-4">
          <Text className="text-base text-s-500 dark:text-s-400 leading-5 mb-1.5">
            {winOffer ? "Происходит передача" : "В ожидании реакции владельца"}
            {/* - {maxOffer}{" "} */}
            {/* {getNoun(maxOffer, "бал", "бала", "балов")} */}
          </Text>
          <View
            className="flex flex-row items-center gap-4"
            key={firstOffer?.userId}
          >
            <View className="flex-auto">
              <UserInfo
                userId={userData._id.toString()}
                borderColor="border-gr-50 dark:border-s-800"
              />
            </View>
            {userFromStore?.id === firstOffer?.userId && (
              <Text className="text-base bg-p-500 rounded-lg text-white dark:text-black px-1 py-0 leading-5">
                моя просьба
              </Text>
            )}
            <Text className="text-lg text-s-900 dark:text-s-200 leading-6">
              {firstOffer?.cost}{" "}
              {getNoun(firstOffer?.cost, "бал", "бала", "балов")}
            </Text>
            {firstOffer?.status === 1 && <BadgeTabLots />}
          </View>
          <View className="pt-4">
            {winOffer &&
              (winOffer.userId === userFromStore?.id ||
                winOffer.userProductId === userFromStore?.id) && (
                <View className="gap-2">
                  <UIButton
                    type="primary"
                    text="Обсуждение передачи лота"
                    icon="iChevronRight"
                    startText
                    onPress={() => {
                      router.push({
                        pathname: `/modalmessage/[roomId]`,
                        params: {
                          roomId: winOffer.roomId,
                        },
                      });
                    }}
                  />
                  <UIButton
                    type="primary"
                    text="Завершить сделку"
                    icon="iChevronRight"
                    startText
                    onPress={() => {
                      router.push({
                        pathname: `/modaldeal/[id]`,
                        params: {
                          id: winOffer._id.toString(),
                        },
                      });
                    }}
                  />
                  {/* <DaromButtonChangeStatus
                    type="primary"
                    win={0}
                    isTimerComplete={false}
                    productId={productId}
                    offerId={firstOffer._id}
                    text="Отменить дарение лота"
                    titleAlert="Отмена дарения"
                    textAlert="Вы действительно хотите отменить дар лота?"
                  /> */}
                </View>
              )}
            {userFromStore?.id === product.userId && !winOffer && (
              <DaromButtonChangeStatus
                type="primary"
                win={1}
                isTimerComplete={false}
                productId={productId}
                offerId={firstOffer._id}
                text="Одарить"
                titleAlert="Дарение"
                textAlert="Вы действительно хотите отдать этот лот?"
              />
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
}
