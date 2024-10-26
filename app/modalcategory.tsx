import Card from "@/components/Card";
import RText from "@/components/r/RText";
import RTitle from "@/components/r/RTitle";
import UIButton from "@/components/ui/UIButton";
import UICategory from "@/components/ui/UICategory";
import { useAppSelector } from "@/store/hooks";
import { categories } from "@/store/storeSlice";
import { Link, router, useGlobalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  SlideInDown,
  SlideInLeft,
} from "react-native-reanimated";

export default function Modal() {
  const glob = useGlobalSearchParams<{ categoryId: string }>();

  const categoriesFromStore = useAppSelector(categories);

  const list = useMemo(
    () =>
      categoriesFromStore
        .slice()
        .sort((a, b) => a.title.localeCompare(b.title)), //
    [categoriesFromStore]
  );
  // const listX = useMemo(
  //   () => categoriesFromStore.map((x) => x.title), //.sort((a, b) => a.title.localeCompare(b.title))
  //   [categoriesFromStore]
  // );
  // console.log(listX);

  // const list = useMemo(
  //   () => Object.values(categoriesFromStore),
  //   [categoriesFromStore]
  // );

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Card>
            {/* <RTitle text="Выберите категорию" className="mb-4" /> */}
            {list.map((category) => (
              <View className="my-2" key={category.id}>
                <UIButton
                  type={
                    glob.categoryId === category.id ? "primary" : "secondary"
                  }
                  onPress={() => {
                    router.back();
                    router.setParams({ categoryIdx: category.id });
                  }}
                >
                  <RText>{category.title}</RText>
                </UIButton>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
