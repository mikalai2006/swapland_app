import { Text, View } from "react-native";
import React, { useMemo } from "react";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import OfferListItem from "./OfferListItem";
import useOffers from "@/hooks/useOffers";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";

export type IOfferListProps = {
  productId: string;
};

export default function OfferList({ productId }: IOfferListProps) {
  const userFromStore = useAppSelector(user);

  const offersList = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", productId, userFromStore?.id);
  });

  const offers = useMemo(() => offersList.sorted("cost", true), [offersList]);

  const winOffer = useMemo(() => offers.find((x) => x.win === 1), [offers]);

  return (
    <View className="gap-2">
      {offers
        ? offers.map((item, index) => (
            <OfferListItem
              key={item._id.toString()}
              id={item._id}
              productId={productId}
              winOffer={winOffer}
            />
          ))
        : null}
    </View>
  );
}
