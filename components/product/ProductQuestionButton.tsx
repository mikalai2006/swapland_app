import { View, Text } from "react-native";
import React, { useMemo } from "react";
import UIButton from "../ui/UIButton";
import { ProductSchema } from "@/schema/ProductSchema";
import { router } from "expo-router";
import SIcon from "../ui/SIcon";
import useQuestions from "@/hooks/useQuestions";
import { useQuery } from "@realm/react";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { getNoun } from "@/utils/utils";
import UILabel from "../ui/UILabel";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";

export type ProductQuestionsButton = {
  product: ProductSchema;
};

const ProductQuestionButton = ({ product }: ProductQuestionsButton) => {
  const userFromStore = useAppSelector(user);

  useQuestions({
    productId: product._id.toString(),
    sort: { key: "updatedAt", value: -1 },
  });

  const questionsByProduct = useQuery(QuestionSchema, (items) =>
    items.filtered("productId == $0", product._id.toString())
  );

  const questionsWithoutAnswer = useMemo(
    () => questionsByProduct.filter((x) => !x.answer),
    [questionsByProduct]
  );

  return (
    <UIButton
      type="link"
      className="p-0"
      onPress={() => {
        router.navigate(`/modalquestion/${product?._id.toString()}`);
      }}
    >
      <UILabel text="Вопросы" />
      <View className="flex flex-row gap-1">
        <View className="flex-auto">
          <View className="flex flex-row gap-2">
            <SIcon path="iChatDots" size={20} />
            <Text className="text-xl text-s-800 dark:text-s-100 font-bold leading-6">
              {questionsByProduct.length}
            </Text>
          </View>

          <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
            {getNoun(
              questionsByProduct.length,
              "вопрос",
              "вопроса",
              "вопросов"
            )}
          </Text>
        </View>
        <View className="px-2 py-2 relative">
          <SIcon path="iChevronRight" size={20} />
          {questionsWithoutAnswer.length > 0 &&
            userFromStore?.id === product?.userId && (
              <View className="w-4 h-4 rounded-full bg-green-500 absolute -top-1 right-1" />
            )}
        </View>
      </View>
    </UIButton>
  );
};

export default ProductQuestionButton;
