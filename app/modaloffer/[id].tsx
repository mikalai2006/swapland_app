import Card from "@/components/Card";
import DaromStat from "@/components/darom/DaromStat";
import OfferCount from "@/components/offer/OfferCount";
import OfferList from "@/components/offer/OfferList";
import Offers from "@/components/offer/Offers";
import OfferWin from "@/components/offer/OfferWin";
import ProductShortInfo from "@/components/product/ProductShortInfo";
import UIButton from "@/components/ui/UIButton";
import UIButtonBack from "@/components/ui/UIButtonBack";
import UICounter from "@/components/ui/UICounter";
import UILabel from "@/components/ui/UILabel";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { useTimer } from "@/hooks/useTimer";
import { OfferSchema } from "@/schema/OfferSchema";
import { ProductSchema } from "@/schema/ProductSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { hostAPI } from "@/utils/global";
import { getNoun } from "@/utils/utils";
import { useObject, useQuery } from "@realm/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BSON } from "realm";

export default function ModalOffer() {
  const params = useLocalSearchParams<{ id: string }>();

  const userFromStore = useAppSelector(user);

  const product = useObject(ProductSchema, new BSON.ObjectId(params.id));

  const offers = useQuery(OfferSchema, (items) =>
    items.filtered("productId == $0", params.id)
  );

  const winOffer = useMemo(() => offers.find((x) => x.win === 1), [offers]);

  const offersNotDisable = useMemo(
    () => offers.filter((x) => x.status >= 0),
    [offers]
  );

  const maxCost = useMemo(() => {
    const _allOfferCost = offersNotDisable.length
      ? offersNotDisable.map((x) => x.cost || 0)
      : [product?.cost || 1];
    return Math.max(..._allOfferCost);
  }, [product, offersNotDisable]);

  const isAuction = useMemo(() => product?.actions?.includes(2), [product]);

  const [cost, setCost] = useState(maxCost + (isAuction ? 1 : 0));

  useEffect(() => {
    setCost(maxCost + (isAuction ? 1 : 0));
  }, [maxCost]);

  const myBet = useMemo(
    () => offers.find((x) => x.userId === userFromStore?.id),
    [userFromStore, offers]
  );

  const [loading, setLoading] = useState(false);

  const { onFetchWithAuth } = useFetchWithAuth();

  const onCreateOffer = async () => {
    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/offer`, {
      method: "POST",
      body: JSON.stringify({
        productId: params.id,
        cost,
      }),
    })
      .then((res) => res.json())
      .then((res: any) => {})
      .catch((e) => {
        console.log("ModalOffer Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const minNeedBal = useMemo(
    () => (offersNotDisable.length !== 0 ? maxCost + 1 : cost),
    [maxCost, cost]
  );

  // const { days, hours, minutes, seconds, isTimerComplete } = useTimer({
  //   durationDays: 20,
  //   startTime: product[0]?.createdAt,
  // });

  return product ? (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            <ProductShortInfo id={product?._id.toString()} />
          </View>
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          <View className="p-4">
            <Card className="">
              <UILabel text="Детали аукциона" />
              {/* {product[0]?.createdAt && (
                <View className="flex">
                  <Text className="self-start text-g-700 dark:text-s-200 text-lg">
                    До конца аукциона осталось
                  </Text>
                  <Text className="font-bold text-4xl text-s-900 dark:text-s-200">
                    {days ? days + "дн." : ""} {hours}:{minutes}:{seconds}
                  </Text>
                </View>
              )} */}
              <View className="flex gap-2">
                <OfferCount productId={product._id} />
                <OfferWin
                  productId={product._id}
                  isTimerComplete={false}
                  showButtons
                />
              </View>
            </Card>

            {userFromStore &&
              userFromStore.id !== product.userId &&
              (!myBet || myBet.cost < maxCost || (myBet && myBet.status > 0)) &&
              !winOffer && (
                <Card className="mt-4">
                  <UILabel text="Форма запроса" />
                  <View className="gap-4">
                    <UICounter
                      value={cost.toString()}
                      initValue={maxCost}
                      max={maxCost + 100}
                      // disable={cost > userFromStore.bal}
                      onChangeValue={setCost}
                    />
                    <UIButton
                      type="primary"
                      loading={loading}
                      disabled={
                        loading || cost < minNeedBal || cost > userFromStore.bal
                      }
                      text={`Заберу за ${cost} ${getNoun(
                        cost,
                        "бал",
                        "бала",
                        "балов"
                      )}`}
                      onPress={() => {
                        onCreateOffer();
                      }}
                    />
                  </View>
                  {userFromStore && cost > userFromStore.bal && (
                    <View className="mt-4 bg-r-500/20 rounded-lg p-4">
                      <Text className="text-base text-r-800 dark:text-s-200 leading-5">
                        У вас не хватает баллов, чтобы поднять ставку выше!
                      </Text>
                    </View>
                  )}
                </Card>
              )}
            {offers.length > 0 && ( // userFromStore?.id === product[0].userId &&
              <Card className="mt-4">
                <UILabel text="Все предложения" />
                <OfferList productId={product?._id.toString()} />
              </Card>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  ) : (
    <Text>Not found product</Text>
  );
}
