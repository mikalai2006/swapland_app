import { Text, View } from "react-native";
import RImage from "../r/RImage";
import UIButton from "../ui/UIButton";
import UserInfo from "../user/UserInfo";
import { router } from "expo-router";
import ProductCost from "./ProductCost";
import { useObject, useQuery } from "@realm/react";
import { UserSchema } from "@/schema/UserSchema";
import { useMemo } from "react";
import { ProductSchema } from "@/schema/ProductSchema";
import ProductLocation from "./ProductLocation";
import { BSON } from "realm";

export type ProductGridItemProps = {
  product: ProductSchema;
};

export function ProductGridItem({ product }: ProductGridItemProps) {
  const user = useObject(UserSchema, new BSON.ObjectId(product.userId));

  return (
    <View className="w-1/2 p-2">
      <UIButton
        type="link"
        className="flex flex-col items-stretch bg-white dark:bg-s-900 rounded-lg overflow-hidden"
        onPress={() => {
          router.push({
            pathname: "/product/[id]",
            params: { id: product._id.toString() },
          });
        }}
      >
        <View style={{ aspectRatio: 1 }}>
          <RImage
            className="object-cover aspect-square"
            image={product?.images[0]}
            style={{ aspectRatio: 1, width: "100%" }}
          />
        </View>
        <View className="px-4 pt-2 pb-0 flex flex-col gap-2">
          <View className="flex-auto">
            <Text
              className="text-lg leading-6 font-semibold text-s-800 dark:text-s-100"
              numberOfLines={1}
              lineBreakMode="tail"
            >
              {product.description}
            </Text>

            <View className="">
              <ProductLocation userId={user?._id.toString()} />
            </View>
          </View>
          <View className="pb-4">
            <Text className="text-lg text-p-500 dark:text-p-300 font-bold leading-5">
              {product.actions?.includes(1) ? "Отдам первому" : "Аукцион"}
            </Text>
            {/* <Text>
              <ProductCost
                product={product}
                className="text-xl text-p-500 font-bold leading-5"
              />
            </Text> */}
          </View>
        </View>
      </UIButton>
    </View>
  );
}
