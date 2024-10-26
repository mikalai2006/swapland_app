import { ActivityIndicator, Alert, View } from "react-native";
import React, { useMemo, useState } from "react";
import useOffers from "@/hooks/useOffers";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { BSON, UpdateMode } from "realm";
import { useObject, useQuery, useRealm } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { OfferSchema } from "@/schema/OfferSchema";
import DaromStat from "./DaromStat";
import UILabel from "../ui/UILabel";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI } from "@/utils/global";
import { IOffer } from "@/types";
import DaromWin from "./DaromWin";
import { SSkeleton } from "../ui/SSkeleton";
import { Colors } from "@/utils/Colors";

export type DaromProps = {
  productId: BSON.ObjectId;
};

const Darom = ({ productId }: DaromProps) => {
  const { isLoading } = useOffers({ productId: [productId.toString()] });

  const realm = useRealm();

  const userFromStore = useAppSelector(user);

  const product = useObject(ProductSchema, new BSON.ObjectId(productId));

  const offers = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", productId.toString());
  });

  const myBet = useMemo(
    () => offers.find((x) => x.userId === userFromStore?.id),
    [userFromStore, offers]
  );

  const [loading, setLoading] = useState(false);

  const { onFetchWithAuth } = useFetchWithAuth();

  const onCreateOfferAlert = () => {
    Alert.alert(
      "Запрос в дар",
      "Вы действительно хотите забрать этот лот за 1 бал?",
      [
        {
          text: "Отмена",
          onPress: () => {},
          style: "cancel",
        },
        { text: "Да", onPress: () => onCreateOffer() },
      ]
    );
  };

  const onCreateOffer = async () => {
    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/offer`, {
      method: "POST",
      body: JSON.stringify({
        productId: productId.toString(),
        cost: 1,
      }),
    })
      .then((res) => res.json())
      .then((res: IOffer) => {
        // console.log(res, );
        realm.write(() => {
          try {
            realm.create(
              "OfferSchema",
              {
                ...res,
                _id: new BSON.ObjectId(res.id),
              },
              UpdateMode.Modified
            );
          } catch (e) {
            console.log("Darom error realm: ", e);
          }
        });
      })
      .catch((e) => {
        console.log("Darom Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /* {product?.userId === userFromStore?.id && (
                    )} */
  return (
    <View className="">
      <UILabel text="Запросы в дар" />
      {isLoading ? (
        <SSkeleton className="mt-4 h-60 bg-s-50 dark:bg-s-800 flex items-center justify-center">
          <ActivityIndicator size={30} color={Colors.s[500]} />
        </SSkeleton>
      ) : (
        <View className="">
          {product?._id && (
            <View className="gap-4">
              <DaromStat productId={product?._id} />
              <DaromWin productId={product?._id} />
              {userFromStore?.id !== product?.userId && !myBet ? (
                <UIButton
                  type="primary"
                  text="Хочу забрать за 1 бал"
                  loading={loading}
                  disabled={loading}
                  onPress={() => {
                    onCreateOfferAlert();
                  }}
                />
              ) : null}
              {userFromStore?.id === product?.userId || myBet ? (
                <UIButton
                  type="secondary"
                  icon="iChevronRight"
                  text="Детали дарения"
                  startText
                  onPress={() => {
                    router.navigate({
                      pathname: "/modaldarom/[id]",
                      params: { id: product?._id.toString() },
                    });
                  }}
                />
              ) : null}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default Darom;
