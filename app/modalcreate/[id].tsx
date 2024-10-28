import { View, Text, Alert } from "react-native";

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
import UIAddress from "@/components/ui/UIAddress";

export default function Modal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { product, isLoading, setProduct } = useProduct({ id });

  const { onFetchWithAuth } = useFetchWithAuth();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImagePickerAsset[] | IImage[]>([]);
  // const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [address, setAddress] = useState<IAddress | null>(null);
  const [actions, setActions] = useState<number[]>([]);
  const [cost, setCost] = useState<number>(1);
  const onUpdateCost = (value: string) => {
    setCost(parseInt(value, 10) || 0);
  };

  useEffect(() => {
    product?.images && setImages(product?.images);
    // product?.title && setTitle(product?.title);
    product?.description && setDescription(product?.description);
    product?.categoryId && setCategoryId(product?.categoryId);
    product?.address && setAddress(product?.address);
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
    setAddress(null);
    setCost(0);
    setActions([]);
  };
  useEffect(() => {
    addListener("beforeRemove", callbackRemovePage);

    return () => {
      removeListener("beforeRemove", callbackRemovePage);
    };
  }, []);

  const glob = useGlobalSearchParams<{ categoryIdx: string }>();
  const onGetRouteParams = () => {
    // console.log("glob =", glob);
    glob.categoryIdx && setCategoryId(glob.categoryIdx);
  };
  useEffect(() => {
    addListener("focus", onGetRouteParams);

    return () => {
      removeListener("focus", onGetRouteParams);
    };
  }, [glob]);

  const onCreateProduct = useCallback(async () => {
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
    data.append("address", address);
    data.append("cost", cost);
    for (let index = 0; index < actions.length; index++) {
      const element = actions[index];
      data.append("actions", element);
    }
    console.log(data);

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

        router.back();
      })
      .catch((error) => {
        console.log("Create error:", error);
      });
  }, [images, description, categoryId, cost, actions]);

  const onPatchProduct = useCallback(async () => {
    if (!id) {
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
        console.log("Create error:", error);
      });
  }, [images, description, categoryId, cost, actions]);

  const disabledSave = useMemo(
    () => description === "" || !images.length,
    [description, images, categoryId, cost, actions]
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
      actions.length === product.actions.length
    );
  }, [description, categoryId, cost, actions]);

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
    <View className="flex-1 bg-s-100 dark:bg-s-950">
      <ScrollView className="flex-1">
        <View className="p-4" key={product?.id}>
          <Card className="mb-4">
            {/* <Text>{JSON.stringify(product)}</Text> */}
            {/* <Text>{JSON.stringify(categoryId)}</Text> */}
            <UIUpload
              value={images}
              title="Изображения товара"
              setValue={setImages}
              service="product"
              serviceId={product?.id}
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
          <Card className="mb-4">
            <UIAddress
              title="Адрес"
              value={address}
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
              disabled={disabledPatch}
              onPress={onPatchProduct}
            />
          ) : (
            <UIButton
              type="primary"
              text="Сохранить"
              loading={loading}
              disabled={disabledSave}
              onPress={onCreateProduct}
            />
          )}
          {product && (
            <View className="mt-16">
              <UIButton
                type="secondary"
                text="Снять с публикации"
                disabled={!product.id}
                onPress={onChangeStatusProductAlert}
              />
              <UIButton
                type="link"
                disabled={!product.id}
                className="mt-4"
                onPress={onRemoveProductAlert}
              >
                <View className="px-4 py-2 flex items-center bg-red-200 dark:bg-red-300 rounded-lg">
                  <RText className="text-red-800 dark:text-red-900 text-lg">
                    Удалить лот
                  </RText>
                </View>
              </UIButton>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
