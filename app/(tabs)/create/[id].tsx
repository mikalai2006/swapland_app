import { View, Text, Alert, ActivityIndicator } from "react-native";

import Card from "@/components/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
import UIInput from "@/components/ui/UIInput";
import UIButton from "@/components/ui/UIButton";
import { ScrollView } from "react-native-gesture-handler";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI } from "@/utils/global";
import {
  router,
  useNavigation,
  useLocalSearchParams,
  useGlobalSearchParams,
} from "expo-router";
import useProduct from "@/hooks/useProduct";
import { IAddress, IImage } from "@/types";
import RText from "@/components/r/RText";
import UICategory from "@/components/ui/UICategory";
import UIUpload from "@/components/ui/UIUpload";
import UIAction from "@/components/ui/UIAction";
import { SafeAreaView } from "react-native-safe-area-context";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { SSkeleton } from "@/components/ui/SSkeleton";
import { Colors } from "@/utils/Colors";
import ProductShortInfo from "@/components/product/ProductShortInfo";
import { useObject, useQuery } from "@realm/react";
import { OfferSchema } from "@/schema/OfferSchema";
import UIAddressChooser from "@/components/ui/UIAddressChooser";
import { AddressSchema } from "@/schema/AddressSchema";
import { BSON } from "realm";

export default function Modal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, setProduct } = useProduct({ id });

  const { onFetchWithAuth } = useFetchWithAuth();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePickerAsset[] | IImage[]>([]);
  // const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [actions, setActions] = useState<number[]>([]);
  const [cost, setCost] = useState<number>(1);
  const [addressId, setAddressId] = useState<string>(
    "000000000000000000000000"
  );
  // const onUpdateCost = (value: string) => {
  //   setCost(parseInt(value, 10) || 0);
  // };

  const address = useObject(AddressSchema, new BSON.ObjectId(addressId));

  useEffect(() => {
    product?.images && setImages(product?.images);
    // product?.title && setTitle(product?.title);
    product?.description && setDescription(product?.description);
    product?.categoryId && setCategoryId(product?.categoryId);

    // console.log("address: ", address, product?.addressId);
    if (address?.address) {
      setAddressId(address._id.toString());
    } else if (product?.addressId) {
      setAddressId(product?.addressId);
    }

    product?.cost && setCost(product?.cost);
    product?.actions && setActions(product?.actions);
  }, [product]);

  const { addListener, removeListener } = useNavigation();
  const callbackRemovePage = () => {
    setProduct(null);
    setImages([]);
    // setTitle("");
    setDescription("");
    setCategoryId("");
    setCost(0);
    setActions([]);
    setAddressId("000000000000000000000000");
  };

  useEffect(() => {
    addListener("beforeRemove", callbackRemovePage);

    return () => {
      removeListener("beforeRemove", callbackRemovePage);
    };
  }, []);

  const glob = useGlobalSearchParams<{
    categoryIdx: string;
    addressId: string;
  }>();
  const onGetRouteParams = () => {
    // console.log("glob =", glob);
    glob.categoryIdx && setCategoryId(glob.categoryIdx);
    glob.addressId && setAddressId(glob.addressId);
  };
  useEffect(() => {
    addListener("focus", onGetRouteParams);

    return () => {
      removeListener("focus", onGetRouteParams);
    };
  }, [glob]);

  const offers = useQuery(OfferSchema, (items) =>
    items.filtered("productId == $0", id)
  );

  const onCreateProduct = useCallback(async () => {
    if (!address) {
      return;
    }

    const data = new FormData();

    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      data.append("images", {
        name: element.fileName,
        type: element.mimeType, //.type,
        uri: element.uri,
      });
    }

    data.append("service", "product");
    // data.append("title", title);
    data.append("description", description);
    data.append("categoryId", categoryId);
    data.append("cost", cost);
    data.append("lat", address.lat);
    data.append("lon", address.lon);
    data.append("addressId", address._id.toString());

    for (let index = 0; index < actions.length; index++) {
      const element = actions[index];
      data.append("actions", element);
    }
    // console.log(data);

    await onFetchWithAuth(hostAPI + "/product", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin-Type": "*",
      },
      body: data,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message && res?.code === 401) {
          console.log("401 onSync Product");
          // dispatch(setTokenAccess({access_token: ''}));
          return;
        }

        callbackRemovePage();
        router.back();
      })
      .catch((error) => {
        console.log("Create error:", error);
      });
  }, [images, description, categoryId, cost, actions, addressId]);

  const onPatchProduct = useCallback(async () => {
    if (!id || !address) {
      return;
    }
    console.log({
      description,
      categoryId,
      cost,
      actions,
    });

    await onFetchWithAuth(`${hostAPI}/product/${id}`, {
      method: "PATCH",
      headers: {
        "Access-Control-Allow-Origin-Type": "*",
      },
      body: JSON.stringify({
        description,
        categoryId,
        cost,
        actions,
        lat: address?.lat,
        lon: address?.lon,
        addressId: address._id.toString(),
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.message && res?.code === 401) {
          console.log("401 Patch Product");
          // dispatch(setTokenAccess({access_token: ''}));
          return;
        }

        router.back();
      })
      .catch((error) => {
        console.log("Patch product error:", error);
      });
  }, [images, description, categoryId, cost, actions, addressId]);

  const disabledSave = useMemo(
    () => description === "" || !images.length || !addressId,
    [description, images, categoryId, cost, actions, addressId]
  );

  const disabledPatch = useMemo(() => {
    const isIncluded = (arr1: number[], arr2: number[]) =>
      arr1?.length && arr2?.length
        ? arr1.every((e) => arr2.includes(e))
        : false;
    return (
      // title === product?.title &&
      description === product?.description &&
      categoryId === product?.categoryId &&
      cost === product?.cost &&
      isIncluded(actions, product.actions) &&
      actions.length === product.actions.length &&
      address?._id.toString() === product.addressId
    );
  }, [description, categoryId, cost, actions, product, address]);

  const onRemoveProductAlert = () => {
    Alert.alert("Удаление", "Вы действительно хотите удалить товар?", [
      {
        text: "Отмена",
        onPress: () => {},
        style: "cancel",
      },
      { text: "Да", onPress: () => onRemoveProduct() },
    ]);
  };
  const onRemoveProduct = () => {};

  const onChangeStatusProductAlert = () => {
    Alert.alert(
      "Изменение статуса",
      "Вы действительно хотите изменить статус публикации товара?",
      [
        {
          text: "Отмена",
          onPress: () => {},
          style: "cancel",
        },
        { text: "Да", onPress: () => onChangeStatusProduct() },
      ]
    );
  };
  const onChangeStatusProduct = () => {};

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            {product && !isLoading && <ProductShortInfo id={id} />}
          </View>
        </View>
        <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
          <View className="p-4" key={product?.id}>
            {isLoading ? (
              <>
                <SSkeleton className="h-72 bg-s-100 dark:bg-s-800 flex items-center justify-center">
                  <View className="flex-1 flex-row flex-wrap p-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <View key={item.toString()} className="h-32 w-1/3 p-2">
                        <SSkeleton className="flex-1 bg-s-50 dark:bg-s-900" />
                      </View>
                    ))}
                  </View>
                </SSkeleton>

                <SSkeleton className="mt-4 h-24 bg-s-100 dark:bg-s-800 flex items-center justify-center">
                  <ActivityIndicator size={30} color={Colors.s[500]} />
                </SSkeleton>

                <SSkeleton className="mt-4 h-48 bg-s-100 dark:bg-s-800 flex items-center justify-center" />
              </>
            ) : (
              <>
                {/* <Text>{JSON.stringify(address)}</Text> */}
                {offers.length > 0 && (
                  <Card className="mb-4 bg-r-300 dark:bg-r-900">
                    <Text className="text-r-900 dark:text-r-300 text-lg font-medium leading-5">
                      Нельзя изменить. По данному лоту уже поступили запросы!
                    </Text>
                  </Card>
                )}
                <Card className="mb-4">
                  {/* <Text>{JSON.stringify(product)}</Text> */}
                  {/* <Text>{JSON.stringify(categoryId)}</Text> */}
                  <UIUpload
                    value={images}
                    title="Изображения товара"
                    setValue={setImages}
                    service="product"
                    serviceId={product?.id}
                    disabled={offers.length > 0}
                  />
                </Card>

                <Card className="mb-4">
                  <UIAddressChooser
                    title="Адрес"
                    value={addressId}
                    // onSetCategoryId={(categoryId) => {
                    //   router.back();
                    //   router.setParams({ categoryIdx: categoryId });
                    // }}
                  />
                </Card>
                <Card className="mb-4">
                  <UICategory
                    title="Категория"
                    value={categoryId}
                    // onSetCategoryId={(categoryId) => {
                    //   router.back();
                    //   router.setParams({ categoryIdx: categoryId });
                    // }}
                  />
                </Card>
                {/* <Card className="mb-4">
            <UIInput
              title="Название"
              numberOfLines={2}
              textAlignVertical="top"
              multiline
              value={title}
              maxLength={50}
              onChangeText={setTitle}
            />
          </Card> */}
                <Card className="mb-4">
                  <UIInput
                    title="Описание"
                    value={description}
                    numberOfLines={5}
                    multiline
                    maxLength={500}
                    textAlignVertical="top"
                    onChangeText={setDescription}
                  />
                </Card>
                {/* <Card className="mb-4">
            <UIInput
              title="Стоимость (в балах)"
              keyboardType="number-pad"
              value={cost.toString()}
              textAlignVertical="top"
              onChangeText={onUpdateCost}
            />
          </Card> */}
                <Card className="mb-4">
                  <UIAction
                    title="Как вы хотели бы отдать лот?"
                    value={actions}
                    type="single"
                    onSetValue={setActions}
                    // onSetCategoryId={(categoryId) => {
                    //   router.back();
                    //   router.setParams({ categoryIdx: categoryId });
                    // }}
                  />
                </Card>
                {product ? (
                  <UIButton
                    type="primary"
                    text="Изменить"
                    loading={loading}
                    disabled={disabledPatch || offers.length > 0}
                    onPress={onPatchProduct}
                  />
                ) : (
                  <UIButton
                    type="primary"
                    text="Сохранить"
                    loading={loading}
                    disabled={disabledSave || offers.length > 0}
                    onPress={onCreateProduct}
                  />
                )}
                {product && (
                  <View className="mt-12">
                    {/* <UIButton
                      type="secondary"
                      text="Снять с публикации"
                      disabled={!product.id}
                      onPress={onChangeStatusProductAlert}
                    /> */}
                    <UIButton
                      type="link"
                      disabled={!product.id || offers.length > 0}
                      className="mt-4"
                      onPress={onRemoveProductAlert}
                    >
                      <View className="px-4 py-2 flex items-center bg-red-200 dark:bg-r-500/10 rounded-lg">
                        <RText className="text-red-800 dark:text-r-200 text-lg">
                          Удалить лот
                        </RText>
                      </View>
                    </UIButton>
                  </View>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
