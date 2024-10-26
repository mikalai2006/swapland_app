import { Text, View } from "react-native";
import React from "react";
import useQuestions from "@/hooks/useQuestions";
import { BSON } from "realm";
import { useObject } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import Card from "../Card";
import UIButton from "../ui/UIButton";
import { router } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import SIcon from "../ui/SIcon";

export interface IProductQuestionListProps {
  id: BSON.ObjectId | undefined;
}

const ProductQuestionList = ({ id }: IProductQuestionListProps) => {
  const product = useObject(ProductSchema, id);

  const userFromStore = useAppSelector(user);

  const { questions } = useQuestions({
    productId: product?._id.toString(),
    sort: { key: "updatedAt", value: -1 },
  });

  return (
    <>
      {questions.map((item, index) => (
        <UIButton
          key={index.toString()}
          type="link"
          className="m-0 mt-2 flex flex-row items-center bg-white dark:bg-s-900 p-4 rounded-lg"
          onPress={() => {
            if (product?.userId === userFromStore?.id) {
              router.push({
                pathname: `/modalquestion/[id]/answer/[questionId]`,
                params: {
                  id: item.productId,
                  questionId: item._id.toString(),
                },
              });
            }
          }}
        >
          <View className="flex-auto">
            <Text className="font-bold text-lg leading-5 text-s-800 dark:text-s-100">
              {item?.question}
            </Text>
            {item?.answer ? (
              <Text className="text-lg leading-5 text-s-700 dark:text-s-200">
                - {item?.answer}
              </Text>
            ) : userFromStore?.id !== product?.userId ? (
              <Text className="text-base text-g-300 dark:text-s-500">
                В ожидании ответа ...
              </Text>
            ) : (
              <Text className="py-0.5 px-2 rounded-md bg-green-500 self-start">
                Новый вопрос
              </Text>
            )}
          </View>
          {userFromStore?.id === product?.userId ? (
            <View>
              <SIcon path="iChevronRight" size={20} />
            </View>
          ) : null}
        </UIButton>
      ))}
    </>
  );
};

export default ProductQuestionList;
