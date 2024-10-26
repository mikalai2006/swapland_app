import { View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import useProducts from "@/hooks/useProducts";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import ProductButton from "@/components/product/ProductButton";
import { useQuery } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";

export default function Screen() {
  // const [loading, setLoading] = useState(false);
  // const [products, setProducts] = useState<IProduct[]>([]);

  // const onFindProducts = async () => {
  //   setLoading(true);
  //   await onFetchWithAuth(hostAPI + "/product", {
  //     method: "GET",
  //     headers: {
  //       "Access-Control-Allow-Origin-Type": "*",
  //     },
  //     // body: data,
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       if (res.message && res?.code === 401) {
  //         console.log("401 onSync Product find");
  //         // dispatch(setTokenAccess({access_token: ''}));
  //         return;
  //       }
  //       // console.log("res=", res);

  //       setProducts(res.data);
  //     })
  //     .catch((error) => {
  //       console.log("Find product error:", error);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   onFindProducts();
  // }, []);

  const userFromStore = useAppSelector(user);
  const { products, isLoading, error } = useProducts({
    userId: userFromStore?.id,
    query: "",
  });

  const giveProducts = useQuery(ProductSchema, (items) =>
    items.filtered("userId == $0", userFromStore?.id)
  );

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950 py-2">
      {/* <View className="p-4">
        <UIButton
          type="secondary"
          text="addProduct"
          onPress={() => router.push("/create")}
        />
      </View> */}
      {isLoading ? (
        <View></View>
      ) : (
        <FlatList
          data={giveProducts}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          initialNumToRender={5}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => <ProductButton product={item} />}
        />
      )}
    </View>
  );
}
