import { Text, View } from "react-native";
import React, { useMemo } from "react";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import DaromUserListItem from "./DaromUserListItem";

export type IDaromUserListProps = {
  productId: string;
};

export default function DaromUserList({ productId }: IDaromUserListProps) {
  const userFromStore = useAppSelector(user);

  const offersList = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", productId).sorted("createdAt");
  });

  const offers = useMemo(() => offersList.sorted("cost", true), [offersList]);

  const winOffer = useMemo(() => offers.find((x) => x.win === 1), [offers]);

  const firstOffer = useMemo(() => offers[0], [offers]);

  return (
    <View className="gap-2">
      {offers
        ? offers.map((item, index) => (
            <DaromUserListItem
              key={item._id.toString()}
              id={item._id}
              productId={productId}
              winOffer={winOffer}
              firstOffer={firstOffer}
            />
          ))
        : null}
    </View>
  );
}
