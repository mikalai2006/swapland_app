import { Text } from "react-native";
import React, { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { categories } from "@/store/storeSlice";
import { ProductSchema } from "@/schema/ProductSchema";

export interface IProductCategoryProps {
  product: ProductSchema;
}

const ProductCategory = ({ product }: IProductCategoryProps) => {
  const categoryFromStore = useAppSelector(categories);

  const category = useMemo(
    () => categoryFromStore.find((x) => x.id === product.categoryId),
    [product]
  );

  return (
    <Text className="text-base text-s-500 dark:text-s-500 leading-5">
      Категория: {category?.title}
    </Text>
  );
};

export default ProductCategory;
