import { View, Text } from "react-native";
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
import OfferButtonChangeStatus from "./OfferButtonChangeStatus";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { BSON } from "realm";

export type IOfferWinProps = {
  productId: BSON.ObjectId;
  isTimerComplete: boolean;
  showButtons?: boolean;
};

export default function OfferWin({
  productId,
  isTimerComplete,
  showButtons,
}: IOfferWinProps) {
  const userFromStore = useAppSelector(user);

  const maxOffer = useQuery(OfferSchema, (items) =>
    items
      .filtered("productId == $0 AND status != -1", productId.toString())
      .sorted("cost", true)
  )[0];

  const winOffer = useQuery(OfferSchema, (items) =>
    items.filtered(
      "productId == $0 AND status != -1 AND win == 1",
      productId.toString()
    )
  )[0];
  // useMemo(() => offers.find((x) => x.win === 1), [offers]);

  const choosedOffer = useMemo(
    () => winOffer || maxOffer,
    [winOffer, maxOffer]
  );

  const userData = useObject(
    UserSchema,
    new BSON.ObjectId(choosedOffer?.userId)
  );
  const product = useObject(ProductSchema, productId);

  return (
    <View key={choosedOffer?._id.toString()}>
      {choosedOffer && (
        <>
          <View className="bg-gr-50 dark:bg-s-800 p-2 rounded-lg pr-4">
            <Text className="text-base text-s-500 dark:text-s-400 leading-5 mb-1.5">
              {winOffer ? "Лот обещан" : "Максимальное предложение"}
              {/* - {maxOffer}{" "} */}
              {/* {getNoun(maxOffer, "бал", "бала", "балов")} */}
            </Text>
            <View
              className="flex flex-row items-center gap-4"
              key={choosedOffer?.userId}
            >
              <View className="flex-auto">
                <UserInfo
                  userId={userData?._id.toString()}
                  borderColor="border-gr-50 dark:border-s-800"
                />
              </View>
              {userFromStore?.id === choosedOffer?.userId && (
                <Text className="absolute -bottom-3 -right-3 text-base bg-p-500 rounded-lg text-white dark:text-black px-1 py-0 leading-5">
                  моя ставка
                </Text>
              )}
              <Text className="text-lg text-s-900 dark:text-s-200 leading-6">
                {choosedOffer?.cost}{" "}
                {getNoun(choosedOffer?.cost, "бал", "бала", "балов")}
              </Text>
              {choosedOffer?.status === 1 && <BadgeTabLots />}
            </View>

            <View className="pt-4">
              {showButtons &&
                winOffer &&
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
                  </View>
                )}
              {choosedOffer &&
                !winOffer &&
                userFromStore?.id === product?.userId && (
                  <OfferButtonChangeStatus
                    type="primary"
                    win={1}
                    isTimerComplete={isTimerComplete}
                    productId={productId}
                    offerId={choosedOffer._id}
                    text="Одарить"
                    titleAlert="Одарить"
                    textAlert="Вы действительно хотите отдать этот лот?"
                  />
                )}
            </View>
          </View>
        </>
      )}
    </View>
  );
}
