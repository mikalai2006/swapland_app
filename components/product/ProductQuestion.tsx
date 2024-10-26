import { View } from "react-native";
import React from "react";
import useQuestions from "@/hooks/useQuestions";
import UIButton from "../ui/UIButton";
import { BSON } from "realm";
import { useObject } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import { router } from "expo-router";
import ProductQuestionList from "./ProductQuestionList";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";

export interface IProductQuestionProps {
  id: BSON.ObjectId;
}

const ProductQuestion = ({ id }: IProductQuestionProps) => {
  const product = useObject(ProductSchema, id);
  const userFromStore = useAppSelector(user);

  const { questions } = useQuestions({
    productId: product?._id.toString(),
    sort: { key: "updatedAt", value: -1 },
  });

  return (
    <>
      {product?._id && <ProductQuestionList id={product?._id} />}
      {product?.userId !== userFromStore?.id && (
        <View className="mt-4">
          <UIButton
            type="secondary"
            text="Задать вопрос"
            onPress={() => {
              router.navigate(`/modalquestion/${product?._id.toString()}`);
            }}
          />
        </View>
      )}
    </>
  );
};

export default ProductQuestion;
