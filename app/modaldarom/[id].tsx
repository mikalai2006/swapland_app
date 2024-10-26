import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

import Card from "@/components/Card";
import DaromStat from "@/components/darom/DaromStat";
import DaromUserList from "@/components/darom/DaromUserList";
import ProductShortInfo from "@/components/product/ProductShortInfo";
import UIButtonBack from "@/components/ui/UIButtonBack";
import UILabel from "@/components/ui/UILabel";
import { OfferSchema } from "@/schema/OfferSchema";
import { ProductSchema } from "@/schema/ProductSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useObject, useQuery } from "@realm/react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import DaromWin from "@/components/darom/DaromWin";
import { BSON } from "realm";

export default function Modal() {
  const params = useLocalSearchParams<{ id: string }>();

  const userFromStore = useAppSelector(user);

  const product = useObject(ProductSchema, new BSON.ObjectId(params.id));

  const offers = useQuery(OfferSchema, (items) =>
    items.filtered("productId == $0", params.id)
  );

  const maxCost = useMemo(() => {
    const _allOfferCost = offers.length
      ? offers.map((x) => x.cost || 0)
      : [product?.cost || 1];
    return Math.max(..._allOfferCost);
  }, [product, offers]);

  const isAuction = useMemo(() => product?.actions?.includes(2), [product]);

  const [cost, setCost] = useState(maxCost + (isAuction ? 1 : 0));

  useEffect(() => {
    setCost(maxCost + (isAuction ? 1 : 0));
  }, [maxCost]);

  const minNeedBal = useMemo(() => maxCost + 1, [maxCost]);

  return product ? (
    <View className="flex-1 bg-s-100 dark:bg-s-950">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="flex flex-row gap-4">
              <UIButtonBack />
              <View className="flex-auto">
                <ProductShortInfo id={product?._id.toString()} />
              </View>
            </View>
            <Card className="mt-4">
              <UILabel text="Запросы в дар" />
              <DaromStat productId={product._id} />
              <DaromWin productId={product._id} />
            </Card>
            {/* <Card className="mt-4">
              {userFromStore?.id !== product[0]?.userId &&
                offers.length === 0 && (
                  <UIButton
                    type="primary"
                    loading={loading}
                    // disabled={loading || cost < minNeedBal}
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
                )}
            </Card> */}
            {offers.length > 0 && ( // userFromStore?.id === product[0].userId
              <Card className="mt-4">
                <UILabel text="Все просьбы" />
                <DaromUserList productId={product?._id.toString()} />
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
