import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { IOffer } from "@/types";
import dayjs from "@/utils/dayjs";
import UserInfo from "../user/UserInfo";
import { useObject, useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { BSON } from "realm";
import { UserSchema } from "@/schema/UserSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import SIcon from "../ui/SIcon";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { getNoun, getObjectId } from "@/utils/utils";
import BadgeTabLots from "../badge/BadgeTabLots";
import { ProductSchema } from "@/schema/ProductSchema";
import OfferButtonChangeStatus from "./OfferButtonChangeStatus";

export type IOfferListItemProps = {
  id: BSON.ObjectId;
  productId: string;
  winOffer: OfferSchema | undefined;
};

export default function OfferListItem({
  id,
  productId,
  winOffer,
}: IOfferListItemProps) {
  const userFromStore = useAppSelector(user);

  const offer = useObject(OfferSchema, id);

  const userData = useObject(UserSchema, new BSON.ObjectId(offer?.userId));

  const product = useObject(ProductSchema, new BSON.ObjectId(productId));

  return offer && product ? (
    // <UIButton
    //   type="link"
    //   className="p-0"
    //   onPress={() =>
    //     router.push({
    //       pathname: "/user/[id]",
    //       params: {
    //         id: offer?.userId,
    //       },
    //     })
    //   }
    // >
    <View
      className={
        (userFromStore?.id === offer?.userId ? "bg-p-500/10" : "bg-s-500/5") +
        " rounded-lg p-4 px-4"
      }
    >
      {/* <View className="flex flex-row items-center gap-2 pb-1">
          <Text className="text-base text-s-500 dark:text-s-300">
            {dayjs(offer?.updatedAt).fromNow()}
          </Text>
        </View> */}
      <View className="flex flex-row items-center gap-4">
        <View className="flex-auto">
          <UserInfo userId={userData?._id.toString()} />
        </View>
        {/* <View className="absolute -bottom-3 -right-3 flex flex-row gap-2">
            {userFromStore?.id === offer?.userId && (
              <Text className="text-base bg-p-500 rounded-md text-white dark:text-black px-1 py-0 leading-5">
                моя ставка
              </Text>
            )}
            {offer?.status < 0 && (
              <Text className="text-base bg-p-500 rounded-md text-white dark:text-black px-1 py-0 leading-5">
                отказ
              </Text>
            )}
          </View> */}
        <Text className="text-lg text-s-900 dark:text-s-200 leading-6">
          {offer?.cost} {getNoun(offer?.cost, "бал", "бала", "балов")}
        </Text>
        {/* {userFromStore?.id === offer?.userId && (
            <View>
              <SIcon path="iChevronRight" size={20} />
            </View>
          )} */}
        {offer?.status === 1 && <BadgeTabLots />}
      </View>

      <View className="flex gap-2 items-start pt-1">
        <View>
          {userFromStore?.id === offer?.userId && (
            <>
              <Text className="text-base bg-p-500 rounded-md text-white dark:text-black px-1 py-0 leading-5">
                моя ставка
              </Text>
            </>
          )}
        </View>
        {getObjectId(offer?.rejectUserId) != "0" && (
          <View className="bg-r-500/10 rounded-md p-2 flex-row flex-wrap gap-0">
            <Text className="text-base text-r-500 dark:text-r-200 leading-5">
              {offer.rejectUserId === offer.userId
                ? "Отказался от лота"
                : "Отказал владелец лота"}
            </Text>
            {offer.message && (
              <Text className="text-base font-bold text-r-500 dark:text-r-200 leading-5">
                - {offer.message}
              </Text>
            )}
          </View>
        )}
      </View>
      <View className="flex flex-row gap-2 mt-2">
        {userFromStore?.id === product.userId &&
          offer &&
          offer.status >= 0 &&
          !winOffer && (
            <OfferButtonChangeStatus
              type="primary"
              win={1}
              isTimerComplete={false}
              productId={product._id}
              offerId={offer._id}
              text="Одарить"
              titleAlert="Одарить"
              textAlert="Хотите отдать лот этому пользователю?"
            />
          )}

        {offer.status >= 0 && (
          <>
            {userFromStore?.id === product.userId && (
              <UIButton
                type="secondary"
                text="Отказать"
                icon="iChevronRight"
                startText
                onPress={() => {
                  router.push({
                    pathname: `/modaldeal/[id]`,
                    params: {
                      id: offer._id.toString(),
                    },
                  });
                }}
              />
            )}
            {userFromStore?.id === offer?.userId && (
              <UIButton
                type="secondary"
                text="Отменить запрос"
                icon="iChevronRight"
                startText
                onPress={() => {
                  router.push({
                    pathname: `/modaldeal/[id]`,
                    params: {
                      id: offer._id.toString(),
                    },
                  });
                }}
              />
            )}
          </>
        )}
      </View>
    </View>
  ) : // </UIButton>
  null;
}
