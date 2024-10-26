import { View, Text, ActivityIndicator } from "react-native";

import useProduct from "@/hooks/useProduct";
import { ScrollView } from "react-native-gesture-handler";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  usePathname,
} from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { filter, user } from "@/store/storeSlice";
import ImageSlider from "@/components/image/ImageSlider";
import Card from "@/components/Card";
import UserInfo from "@/components/user/UserInfo";
import UIButton from "@/components/ui/UIButton";
import SIcon from "@/components/ui/SIcon";
import UIShareButton from "@/components/ui/UIShareButton";
import ProductCategory from "@/components/product/ProductCategory";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Offers from "@/components/offer/Offers";
import ProductLocation from "@/components/product/ProductLocation";
import ProductQuestionButton from "@/components/product/ProductQuestionButton";
import Darom from "@/components/darom/Darom";
import { Colors } from "@/utils/Colors";
import { useColorScheme } from "nativewind";
import UIButtonBack from "@/components/ui/UIButtonBack";
import UILabel from "@/components/ui/UILabel";
import { useEffect } from "react";
import { SSkeleton } from "@/components/ui/SSkeleton";
import ProductButtonMore from "@/components/product/ProductButtonMore";

export default function ProductScreen() {
  const dispatch = useAppDispatch();

  const { addListener, removeListener } = useNavigation();

  const { colorScheme } = useColorScheme();

  const pathname = usePathname();

  const { id } = useLocalSearchParams<{ id: string }>();

  const userFromStore = useAppSelector(user);

  const filterFromStore = useAppSelector(filter);

  const onBeforeRemove = () => {
    console.log("onBeforeRemove");
  };
  useEffect(() => {
    addListener("beforeRemove", onBeforeRemove);

    return () => {
      removeListener("beforeRemove", onBeforeRemove);
    };
  }, []);

  const {
    productFromRealm: product,
    isLoading,
    // error,
  } = useProduct({
    id,
  });

  return product ? (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      header={
        <View className="flex flex-row">
          <View className="flex-none">
            <UIButtonBack />
          </View>
          <View className="flex-auto"></View>
          <View>
            <View className="flex-row gap-4 items-end">
              <UIShareButton link={`${pathname}`} />
              <UIButton
                type="link"
                className="bg-s-200/20 dark:bg-s-950/20 p-2 rounded-lg"
              >
                <View className="">
                  <SIcon
                    path="iHeart"
                    size={25}
                    color={
                      colorScheme === "dark" ? Colors.s[100] : Colors.s[950]
                    }
                  />
                </View>
              </UIButton>
              <ProductButtonMore productId={product._id} />
            </View>
          </View>
        </View>
      }
      headerImage={
        product?.images ? (
          <>
            <ImageSlider slides={product?.images} />
          </>
        ) : null
      }
    >
      <View className="flex-1">
        <ScrollView>
          <View className="bg-s-100 dark:bg-s-950 p-4">
            <Card>
              {/* <Text className="text-2xl font-bold text-g-900 dark:text-s-50 leading-6">
                {product?.title}
              </Text> */}
              {/* {product && <ProductCategory product={product} />} */}
              <View>
                <Text className="text-xl text-g-700 dark:text-s-100 leading-6">
                  {product?.description}
                </Text>
              </View>
              <View className="pt-2">
                <ProductLocation userId={product.userId} />
              </View>

              {/* <Text className="text-4xl">{JSON.stringify(product || {})}</Text> */}
              {/* <View className="flex flex-row gap-4 mt-4 items-center">
                <View className="flex flex-row gap-4">
                  <ProductCost product={product} />
                </View>
                <View className="flex-auto"></View>
              </View> */}
            </Card>
            {/* <Card className="mt-4">
              <UILabel text="Местонахождение" />
              <ProductLocation userId={product.userId} />
            </Card> */}

            {/* {isLoading ? (
              <SSkeleton className="mt-4 h-60 bg-s-200 dark:bg-s-800 flex items-center justify-center">
                <ActivityIndicator size={30} color={Colors.s[500]} />
              </SSkeleton>
            ) : ( */}
            <View className="mt-4 flex flex-row items-stretch gap-4">
              <Card className="flex-auto">
                <UILabel text="Владелец лота" />
                {product?.userId && (
                  // <UIButton
                  //   type="link"
                  //   className="m-0"
                  //   onPress={() =>
                  //     router.navigate({
                  //       pathname: "/user/[id]",
                  //       params: {
                  //         id: product.userId,
                  //       },
                  //     })
                  //   }
                  // >
                  <View className="flex flex-row items-center gap-2">
                    <View className="flex-auto">
                      <UserInfo
                        userId={product?.userId}
                        borderColor="border-white dark:border-s-900"
                      />
                    </View>
                    <View className="">
                      <SIcon path="iChevronRight" size={20} />
                    </View>
                  </View>
                  // </UIButton>
                )}
              </Card>
              <Card className="w-2/5">
                <ProductQuestionButton product={product} />
              </Card>
            </View>
            {product.status >= 0 && (
              <>
                {product.actions?.includes(2) && (
                  <Card className="mt-4">
                    <Offers productId={product._id} />
                  </Card>
                )}
                {product.actions?.includes(1) && (
                  <Card className="mt-4">
                    <Darom productId={product._id} />
                  </Card>
                )}
              </>
            )}
            {/* )} */}

            {/* {product && (
              <Card className="mt-4">
                <Text className="text-base text-s-400 dark:text-s-300 -mt-2 mb-3">
                  Вопросы владельцу
                </Text>
                <ProductQuestion id={product._id} />
              </Card>
            )} */}

            {/* <View>
              <Card className="mt-4">
                <UILabel text="Действия с лотом" />
                {userFromStore?.id === product.userId && (
                  <View className="mb-2">
                    <UIButton
                      type="secondary"
                      text="Редактировать лот"
                      onPress={() =>
                        router.push({
                          pathname: "/create/[id]",
                          params: {
                            id: product._id.toString(),
                          },
                        })
                      }
                    />
                  </View>
                )}
                <UIButton
                  type="secondary"
                  text="Пожаловаться"
                  onPress={() =>
                    router.push({
                      pathname: "/create/[id]",
                      params: {
                        id: product._id.toString(),
                      },
                    })
                  }
                />
              </Card>
            </View> */}
          </View>
        </ScrollView>
      </View>
    </ParallaxScrollView>
  ) : (
    <View>
      <Text>Not found product</Text>
    </View>
  );
  // (
  //   <View className="flex-1 bg-s-200 dark:bg-s-950">
  //     {/* <SafeAreaView style={{ flex: 1 }}> */}
  //     <View className="h-1/2">
  //       {product?.images && <ImageSlider slides={product?.images} />}

  //       <View className="absolute top-6 right-4 flex flex-row gap-4 p-4">
  //         <UIShareButton link={`${pathname}`} />
  //         <UIButton type="secondary">
  //           <SIcon path="iHeart" size={30} />
  //         </UIButton>
  //       </View>
  //     </View>
  //     <View className="flex-1 -mt-16">
  //       <ScrollView>
  //         <View className="p-4">
  //           <Card>
  //             <Text className="text-2xl font-bold text-s-900 dark:text-s-200">
  //               {product?.title}
  //             </Text>
  //             {product && <ProductCategory product={product} />}
  //             <Text className="text-xl text-s-600 dark:text-s-400">
  //               {product?.description}
  //             </Text>
  //             {/* <Text className="text-4xl">{JSON.stringify(product || {})}</Text> */}
  //             <View className="flex flex-row gap-4 mt-4 items-center">
  //               <View className="flex flex-row gap-4">
  //                 <ProductCost product={product} />
  //               </View>
  //               <View className="flex-auto"></View>
  //             </View>
  //             <View>
  //               <OfferList offers={product?.offers} />
  //               <UIButton
  //                 type="primary"
  //                 text="Хочу забрать"
  //                 onPress={() => {
  //                   router.navigate({
  //                     pathname: "/modaloffer",
  //                     params: { productId: product?.id },
  //                   });
  //                 }}
  //               />
  //             </View>
  //           </Card>
  //           {product && (
  //             <Card className="mt-4">
  //               <Text className="text-base text-s-500 dark:text-s-300 mb-2">
  //                 Вопросы владельцу
  //               </Text>
  //               <ProductQuestion product={product} />
  //             </Card>
  //           )}
  //           <Card className="mt-4">
  //             <Text className="text-base text-s-500 dark:text-s-300 mb-2">
  //               Владелец лота
  //             </Text>
  //             {product?.user && <UserInfo userData={product?.user} />}
  //           </Card>
  //         </View>
  //       </ScrollView>
  //     </View>
  //     {/* </SafeAreaView> */}
  //   </View>
  // );
}
