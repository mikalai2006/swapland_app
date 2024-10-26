import { View, Text, ActivityIndicator } from "react-native";
import React, { useMemo } from "react";
import useOffers from "@/hooks/useOffers";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { BSON } from "realm";
import { useObject, useQuery } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import OfferCount from "./OfferCount";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { OfferSchema } from "@/schema/OfferSchema";
import UILabel from "../ui/UILabel";
import { useTimer } from "@/hooks/useTimer";
import OfferWin from "./OfferWin";
import { SSkeleton } from "../ui/SSkeleton";
import { Colors } from "@/utils/Colors";

export type OffersProps = {
  productId: BSON.ObjectId;
};

const Offers = ({ productId }: OffersProps) => {
  const { isLoading } = useOffers({ productId: [productId.toString()] });

  const userFromStore = useAppSelector(user);

  const product = useObject(ProductSchema, productId);

  const offers = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", productId.toString());
  });

  const offersNotDisable = useMemo(
    () => offers.filter((x) => x.status >= 0),
    [offers]
  );

  const myBet = useMemo(
    () => offers.find((x) => x.userId === userFromStore?.id),
    [userFromStore, offers]
  );

  // const { days, hours, minutes, seconds, isTimerComplete } = useTimer({
  //   durationDays: 20,
  //   startTime: product?.createdAt,
  // });
  /* {product?.userId === userFromStore?.id && (
                    )} */
  return (
    <View className="">
      <UILabel text="Детали аукциона" />
      {isLoading ? (
        <SSkeleton className="mt-4 h-60 bg-s-50 dark:bg-s-800 flex items-center justify-center">
          <ActivityIndicator size={30} color={Colors.s[500]} />
        </SSkeleton>
      ) : (
        <View className="gap-2">
          {/* {product?.createdAt && (
          <View className="flex">
            <Text className="self-start text-g-700 dark:text-s-200 text-lg">
              До конца аукциона осталось
            </Text>
            <Text className="font-bold text-4xl text-s-900 dark:text-s-200">
              {days ? days + "дн." : ""} {hours}:{minutes}:{seconds}
            </Text>
          </View>
        )} */}
          {/* {!isTimerComplete && ( */}
          {product && (
            <>
              {/* {offers.length > 0 || product ? (
              <> */}
              <OfferCount
                key={product?._id.toString()}
                productId={product?._id}
              />
              {offersNotDisable.length > 0 && (
                <OfferWin
                  key={product?.userId}
                  productId={product._id}
                  isTimerComplete={false}
                  showButtons
                />
              )}
              {/* </>
            ) : (
              <SSkeleton className="mt-2 h-48 bg-s-50 dark:bg-s-800 flex items-center justify-center">
                <ActivityIndicator size={30} color={Colors.s[500]} />
              </SSkeleton>
            )} */}
              {userFromStore?.id !== product?.userId && !myBet ? (
                <UIButton
                  type="primary"
                  text="Хочу забрать"
                  onPress={() => {
                    router.navigate({
                      pathname: "/modaloffer/[id]",
                      params: { id: product?._id.toString() },
                    });
                  }}
                />
              ) : (
                <UIButton
                  type="secondary"
                  text="Детали аукциона"
                  icon="iChevronRight"
                  startText
                  onPress={() => {
                    router.navigate({
                      pathname: "/modaloffer/[id]",
                      params: { id: product?._id.toString() },
                    });
                  }}
                />
              )}
            </>
          )}
          {/* )} */}
          {/* {myBet && myBet?.status < 0 && (
          <View>
            <Text>Вы отказались от передачи лота</Text>
          </View>
        )} */}
        </View>
      )}
    </View>
  );
};

export default Offers;
