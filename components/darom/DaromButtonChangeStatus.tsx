import { View, Alert } from "react-native";
import React, { useState } from "react";
import { useObject, useQuery, useRealm } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import UIButton, { UIButtonProps } from "../ui/UIButton";
import { hostAPI } from "@/utils/global";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { BSON, UpdateMode } from "realm";
import { IOffer } from "@/types";

export type IDaromButtonChangeStatusProps = UIButtonProps & {
  productId: BSON.ObjectId;
  offerId: BSON.ObjectId;
  isTimerComplete: boolean;
  status?: number;
  give?: number;
  take?: number;
  win?: number;
  titleAlert: string;
  textAlert: string;
};

export default function DaromButtonChangeStatus({
  productId,
  offerId,
  isTimerComplete,
  status,
  give,
  take,
  win,
  titleAlert,
  textAlert,
  ...rest
}: IDaromButtonChangeStatusProps) {
  const userFromStore = useAppSelector(user);

  const realm = useRealm();

  const offersByProduct = useQuery(OfferSchema, (items) =>
    items.filtered("productId == $0", productId.toString())
  );

  const offer = useObject(OfferSchema, offerId);

  const { onFetchWithAuth } = useFetchWithAuth();

  const [loading, setLoading] = useState(false);

  const onChooseWin = async () => {
    setLoading(true);

    return await onFetchWithAuth(`${hostAPI}/offer/${offer?._id.toString()}`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        give,
        take,
        win,
      }),
    })
      .then((res) => res.json())
      .then((res: IOffer) => {
        realm.write(() => {
          try {
            realm.create(
              "OfferSchema",
              {
                ...res,
                _id: new BSON.ObjectId(res.id),
                // _id: existOffer?._id || new BSON.ObjectId(),
              },
              UpdateMode.Modified
            );
          } catch (e) {
            console.log("onChooseWin error: ", e);
          }
        });
      })
      .catch((e) => {
        console.log("onChooseWin Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onChooseWinAlert = () => {
    Alert.alert(titleAlert, textAlert, [
      {
        text: "Отмена",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Да", onPress: () => onChooseWin() },
    ]);
  };

  return (
    <View>
      {userFromStore?.id === offer?.userProductId && (
        <UIButton
          icon="iChevronRight"
          loading={loading}
          disabled={isTimerComplete || loading}
          startText
          onPress={() => onChooseWinAlert()}
          {...rest}
        />
      )}
    </View>
  );
}
