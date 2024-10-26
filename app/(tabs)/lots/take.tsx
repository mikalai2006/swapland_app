import { View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import { useMemo } from "react";
import { ProductSchema } from "@/schema/ProductSchema";
import ProductButton from "@/components/product/ProductButton";

export default function Screen() {
  const userFromStore = useAppSelector(user);
  // const { products, isLoading, error } = useProducts({
  //   userId: userFromStore?.id,
  //   query: "",
  //   onlyMyOffers: true,
  // });
  const allProducts = useQuery(ProductSchema);
  const offers = useQuery(OfferSchema, (items) =>
    items.filtered("userId == $0 AND status != -1", userFromStore?.id)
  );

  const productsFormMyOffers = useMemo(() => {
    const idsProducts = offers.map((x) => x.productId);
    return allProducts.filter((x) => idsProducts.includes(x._id.toString()));
  }, [offers]);

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 py-2">
      {/* <View className="p-4">
        <UIButton
          type="secondary"
          text="addProduct"
          onPress={() => router.push("/lots/create")}
        />
      </View> */}
      {/* <Text>{JSON.stringify(offers)}</Text> */}

      <FlatList
        data={productsFormMyOffers}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => <ProductButton product={item} />}
      />
    </View>
  );
}
