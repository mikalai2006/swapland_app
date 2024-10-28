import Card from "@/components/Card";
import RText from "@/components/r/RText";
import SIcon from "@/components/ui/SIcon";
import UIButton from "@/components/ui/UIButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  categories,
  filter,
  setFilter,
  setFilterCategory,
  setFilterLessBal,
} from "@/store/storeSlice";
import { ICategory } from "@/types";
import { Colors } from "@/utils/Colors";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView, Switch } from "react-native-gesture-handler";

export default function Modal() {
  const dispatch = useAppDispatch();

  const filterFormStore = useAppSelector(filter);

  const categoriesFromStore = useAppSelector(categories);

  const { colorScheme } = useColorScheme();

  const [isLessBal, setIsLessBal] = useState(filterFormStore.showLessBal);
  const toggleSwitch = () => {
    setIsLessBal((previousState) => !previousState);
    dispatch(setFilterLessBal(!isLessBal));
  };

  const toggleCategory = (cat: ICategory) => {
    if (filterFormStore.categories.includes(cat.id)) {
      const indexCategory = filterFormStore.categories.findIndex(
        (x) => x === cat.id
      );
      const newValue = filterFormStore.categories.slice();
      newValue.splice(indexCategory, 1);
      dispatch(setFilterCategory([...newValue]));
    } else {
      const newValue = filterFormStore.categories.slice();
      newValue.push(cat.id);
      dispatch(setFilterCategory([...newValue]));
    }
  };

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <ScrollView>
        <View className="p-4">
          <Card>
            <View className="flex flex-row gap-4 py-4 border-b border-s-200 dark:border-s-900">
              <UIButton
                type="link"
                className="flex-1"
                onPress={() => {
                  router.navigate({
                    pathname: "/mapfilter",
                    // params: { address: JSON.stringify(filterFormStore.address) || "" },
                  });
                }}
              >
                <View className="p-4 flex-row gap-4 border border-s-200 dark:border-s-700 rounded-lg">
                  <View className="flex-auto">
                    {/* <Text>{JSON.stringify(filterFormStore.address)}</Text> */}
                    <Text className="text-lg text-p-900 dark:text-p-500 leading-5">
                      {filterFormStore.address?.address.country}
                      {", "}
                      {filterFormStore.address?.address.county}
                      {", "}
                      {filterFormStore.address?.address.village ||
                        filterFormStore.address?.address.town ||
                        filterFormStore.address?.address.city}
                    </Text>
                    <Text className="text-lg text-p-800 dark:text-p-500">
                      + {filterFormStore.distance} км.
                    </Text>
                  </View>
                  <SIcon path="iChevronRight" size={20} />
                </View>
              </UIButton>
            </View>
            <View className="flex flex-row gap-4 py-4 border-b border-s-200 dark:border-s-900">
              <View className="flex-auto">
                <RText text="Показывать только те товары, на которые хватает балов" />
              </View>
              <Switch
                trackColor={{
                  false: colorScheme === "dark" ? Colors.s[600] : Colors.s[200],
                  true: Colors.p[200],
                }}
                thumbColor={isLessBal ? Colors.p[500] : Colors.s[500]}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isLessBal}
              />
            </View>
            <View className="gap-4 py-4">
              <View className="flex-auto">
                <RText text="Показать товары из категорий" />
              </View>
              <View className="flex flex-row flex-wrap gap-2">
                {categoriesFromStore.map((cat, index) => (
                  <UIButton
                    key={index.toString()}
                    type={
                      filterFormStore.categories.includes(cat.id)
                        ? "primary"
                        : "secondary"
                    }
                    text={cat.title}
                    onPress={() => toggleCategory(cat)}
                  />
                ))}
              </View>
            </View>
            {/* <UIButton
            type="secondary"
            text="Загрузить из галереи"
            icon="iImage"
            onPress={() => {
              router.back();
              router.setParams({ typePicker: "gallery" });
            }}
          /> */}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
