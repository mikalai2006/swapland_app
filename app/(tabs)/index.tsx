import { View, TextInput, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { ProductListItem } from "@/components/product/ProductListItem";
import SIcon from "@/components/ui/SIcon";
import UIButton from "@/components/ui/UIButton";
import useProducts from "@/hooks/useProducts";
import { ScrollView } from "react-native-gesture-handler";
import { useMemo, useState } from "react";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { filter, setFilterTypeList } from "@/store/storeSlice";
import { ProductGridItem } from "@/components/product/ProductGridItem";

export default function TabListScreen() {
  const dispatch = useAppDispatch();

  const filterFromStore = useAppSelector(filter);

  const { products, isLoading, error } = useProducts({
    userId: "",
    query: "",
    categoryId: filterFromStore.categories,
    cost: 10000,
    sort: filterFromStore.sort,
  });

  const [numColumns, setNumColumns] = useState(filterFromStore.numColumns);
  const toggleNumColumns = () => {
    setNumColumns(numColumns === 1 ? 2 : 1);
    dispatch(setFilterTypeList(numColumns === 1 ? 2 : 1));
  };

  const isFilter = useMemo(
    () => filterFromStore.categories.length > 0 || filterFromStore.showLessBal,
    [filterFromStore]
  );

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-950">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row items-center px-4 pb-4 gap-2">
          <View className="flex-auto">
            <TextInput
              className="bg-s-100 dark:bg-s-950 border border-s-300 dark:border-s-700 focus:border-p-500 text-lg px-4 py-2 rounded-lg text-s-900 dark:text-s-100 placeholder:text-s-500"
              placeholder="I want all..."
            />
          </View>
          <View>
            <UIButton
              type="secondary"
              onPress={() => router.navigate("/modalfilter")}
            >
              <SIcon
                path={isFilter ? "iFilterFill" : "iFilter"}
                size={20}
                type={isFilter ? "primary" : "secondary"}
              />
              {isFilter && (
                <View className="absolute top-1 right-1 w-4 h-4 rounded-full bg-p-500 border-2 border-s-100 dark:border-s-950" />
              )}
            </UIButton>
          </View>
          <View>
            <UIButton type="secondary" onPress={toggleNumColumns}>
              <SIcon
                path={numColumns === 2 ? "iViewList" : "iGrid"}
                size={20}
                type="secondary"
              />
            </UIButton>
          </View>
          <View>
            <UIButton
              type="secondary"
              onPress={() => router.navigate("/modalsort")}
            >
              <SIcon
                path={filterFromStore.sort.icon || "iArrowDownUp"}
                size={20}
                type="secondary"
              />
            </UIButton>
          </View>
        </View>
        {/* <View className="px-4 flex flex-row items-center gap-4"></View> */}
        <View className="flex-auto bg-s-200 dark:bg-s-950">
          {/* <FlatList
            // contentContainerStyle={{
            //   display: "flex",
            //   alignItems: "stretch",
            //   flexDirection: "row",
            //   // flexWrap: "wrap",
            // }}
            numColumns={numColumns}
            data={products}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({ item }) => (
              <ProductListItem numColumns={numColumns} product={item} />
            )}
          /> */}
          <ScrollView>
            <View className="flex items-stretch flex-row flex-wrap py-2">
              {products.map((item, index) => {
                return numColumns === 1 ? (
                  <ProductListItem
                    key={item._id.toString() || index}
                    product={item}
                  />
                ) : (
                  <ProductGridItem
                    key={item._id.toString() || index}
                    product={item}
                  />
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}
