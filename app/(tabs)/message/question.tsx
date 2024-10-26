import { Text, View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { useMemo } from "react";
import ProductButton from "@/components/product/ProductButton";
import { QuestionSchema } from "@/schema/QuestionSchema";
import { ProductSchema } from "@/schema/ProductSchema";
import QuestionButton from "@/components/question/QuestionButton";
import useQuestions from "@/hooks/useQuestions";

export default function ScreenQuestion() {
  const userFromStore = useAppSelector(user);

  const { isLoading } = useQuestions({
    userId: [userFromStore?.id],
    sort: { key: "updatedAt", value: -1 },
  });

  const allQuestions = useQuery(QuestionSchema, (items) =>
    items
      .filtered("userProductId == $0 OR userId == $0", userFromStore?.id)
      .sorted("updatedAt", true)
  );

  // const allProducts = useQuery(ProductSchema);

  // const productsFormMyQuestions = useMemo(() => {
  //   const idsProducts = allQuestions.map((x) => `'${x.productId}'`).join(", ");
  //   return allProducts.filtered(`_id IN {${idsProducts}}`);
  // }, [allQuestions]);

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      {/* <View className="p-4">
        <UIButton
          type="secondary"
          text="addProduct"
          onPress={() => router.push("/lots/create")}
        />
      </View> */}
      {/* <Text>{JSON.stringify(allQuestions)}</Text> */}

      <FlatList
        data={allQuestions}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <QuestionButton question={item} />}
      />
    </View>
  );
}
