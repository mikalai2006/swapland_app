import { Text, TextProps } from "react-native";
import React, { useMemo } from "react";
import { getNoun } from "@/utils/utils";
import { ProductSchema } from "@/schema/ProductSchema";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";

export type IProductCostProps = TextProps & {
  product: ProductSchema;
};

const ProductCost = ({ product, ...rest }: IProductCostProps) => {
  const offersFromRealm = useQuery(OfferSchema, (items) => {
    return items.filtered("productId == $0", product._id.toString());
  });

  const maxCost = useMemo(() => {
    const _allOfferCost = offersFromRealm?.length
      ? offersFromRealm.map((x) => x.cost || 0)
      : [product?.cost || 1];
    return Math.max(..._allOfferCost);
  }, [product, offersFromRealm]);
  return (
    <Text className="text-xl font-bold" {...rest}>
      {maxCost} {getNoun(maxCost, "бал", "бала", "балов")}
    </Text>
  );
};

export default ProductCost;
