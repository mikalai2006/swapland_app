import { View, Text } from "react-native";
import React from "react";
import { ProductSchema } from "@/schema/ProductSchema";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import RImage from "../r/RImage";
import dayjs from "@/utils/dayjs";
import SIcon from "../ui/SIcon";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";

export type ProductButtonProps = {
  product: ProductSchema;
};

const ProductButton = (props: ProductButtonProps) => {
  const { product } = props;

  const userFromStore = useAppSelector(user);

  const offersByProduct = useQuery(OfferSchema, (items) =>
    items.filtered(
      "productId == $0 && status == $1",
      product?._id.toString(),
      1
    )
  );

  const questionsWithoutAnswer = useQuery(QuestionSchema, (items) =>
    items.filtered("answer == '' AND productId == $0", product?._id.toString())
  );

  return (
    <UIButton
      type="link"
      className="m-0 bg-white dark:bg-s-800 rounded-lg mb-2 mx-4 mt-2"
      onPress={() => {
        router.push({
          pathname: `/product/[id]`,
          params: {
            id: product._id.toString(),
          },
        });
      }}
    >
      <View className="flex flex-row items-center gap-4">
        <View className="py-4 pl-4">
          {product?.images && (
            <RImage
              className="h-24 w-24 rounded-lg"
              image={product.images[0]}
            />
          )}
        </View>
        {/* <View>
          {item.images.slice(1).map((img, index) => (
            <RImage key={index} className="h-8 w-8" image={img} />
          ))}
        </View> */}
        <View className="flex-auto flex flex-row items-center gap-4">
          <View className="flex-auto">
            <Text
              numberOfLines={2}
              className="text-lg leading-5 text-s-800 dark:text-s-200"
            >
              {product.description}
            </Text>
            <View className="flex flex-row flex-wrap gap-1">
              {offersByProduct.length &&
              userFromStore?.id === product.userId ? (
                <View className="rounded-lg bg-green-500">
                  <Text className="px-1.5 py-0.5 text-sm text-white dark:text-black leading-4">
                    новое предложение
                  </Text>
                </View>
              ) : null}
              {questionsWithoutAnswer.length &&
              userFromStore?.id === product.userId ? (
                <View className="rounded-lg bg-green-500">
                  <Text className="px-1.5 py-0.5 text-sm text-white dark:text-black leading-4">
                    новый вопрос
                  </Text>
                </View>
              ) : null}
            </View>
            <Text className="text-sm text-s-500">
              Добавлен {dayjs(product.createdAt).fromNow()}
            </Text>
          </View>
          <View className="px-2 py-2">
            <SIcon path="iChevronRight" size={20} />
          </View>
        </View>
        {/* <View className="absolute top-0 right-0 flex flex-row"></View> */}
      </View>
    </UIButton>
  );
};

export default ProductButton;
