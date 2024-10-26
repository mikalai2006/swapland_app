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
import { ProductSchema } from "@/schema/ProductSchema";
import BadgeTabLots from "../badge/BadgeTabLots";
import OfferButtonChangeStatus from "../offer/OfferButtonChangeStatus";

export type IDaromUserListItemProps = {
  id: BSON.ObjectId;
  productId: string;
  winOffer: OfferSchema | undefined;
  firstOffer: OfferSchema | undefined;
};

export default function DaromUserListItem({
  id,
  productId,
  winOffer,
  firstOffer,
}: IDaromUserListItemProps) {
  const userFromStore = useAppSelector(user);

  const offer = useObject(OfferSchema, id);

  const product = useObject(ProductSchema, new BSON.ObjectId(productId));

  return offer && product ? (
    // <UIButton
    //   type="link"
    //   className="p-0"
    //   onPress={() => {
    //     router.push({
    //       pathname: "/user/[id]",
    //       params: {
    //         id: offer?.userId,
    //       },
    //     });
    //   }}
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
          <UserInfo userId={offer?.userId} borderColor="border-white " />
        </View>
        {/* <Text className="text-2xl font-bold text-s-900 dark:text-s-200 leading-6">
            {offer?.cost}
          </Text> */}

        {/* <View className="absolute -bottom-3 -right-3 flex flex-row gap-2">
          {userFromStore?.id === offer?.userId && (
            <Text className="text-base bg-p-500 rounded-md text-white dark:text-black px-1 py-0 leading-5">
              моя просьба
            </Text>
          )}
          {offer?.status < 0 && (
            <Text className="text-base bg-p-500 rounded-md text-white dark:text-black px-1 py-0 leading-5">
              отказ
            </Text>
          )}
        </View> */}

        {userFromStore?.id === product.userId &&
          offer &&
          offer.status >= 0 &&
          !winOffer &&
          firstOffer?._id.toString() === offer._id.toString() && (
            <OfferButtonChangeStatus
              type="secondary"
              win={1}
              isTimerComplete={false}
              productId={product._id}
              offerId={offer._id}
              text="Одарить"
              titleAlert="Одарить"
              textAlert="Вы действительно хотите отдать этот лот?"
            />
          )}
        {offer?.status === 1 && <BadgeTabLots />}
      </View>
      {/* <View className="flex gap-2 items-start pt-1 mt-2">
        {offer?.status < 0 && (
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
      </View> */}
      <View className="flex gap-2 items-start pt-1">
        <View>
          {userFromStore?.id === offer?.userId && (
            <Text className="text-base bg-p-500 rounded-md text-white dark:text-black px-1 py-0 leading-5">
              моя просьба
            </Text>
          )}
        </View>
        {offer?.status < 0 && (
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
    </View>
  ) : // </UIButton>
  null;
}
