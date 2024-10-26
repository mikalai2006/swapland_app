import { Text } from "react-native";
import React, { useMemo } from "react";
import { ProductSchema } from "@/schema/ProductSchema";

export interface IProductActionsProps {
  product: ProductSchema;
}

const ProductActions = ({ product }: IProductActionsProps) => {
  const actions = [
    { id: 1, title: "По первому запросу" },
    { id: 2, title: "Аукцион" },
  ];

  const action = useMemo(
    () => actions.filter((x) => product.actions?.includes(x.id)),
    [actions, product.actions]
  );

  return action.map((item, index) => (
    <Text
      key={index.toString()}
      className="text-base bg-s-200 dark:bg-s-700 text-s-500 px-2 py-0.5 leading-5 rounded-md"
    >
      {item.title}
    </Text>
  ));
};

export default ProductActions;
