import { View, Text, Modal, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import UIButton from "../ui/UIButton";
import SIcon from "../ui/SIcon";
import { useColorScheme } from "nativewind";
import { Colors } from "@/utils/Colors";
import Card from "../Card";
import UILabel from "../ui/UILabel";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { router } from "expo-router";
import { useObject } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import { BSON } from "realm";

export type ProductButtonMoreProps = {
  productId: BSON.ObjectId | undefined;
};

const ProductButtonMore = ({ productId }: ProductButtonMoreProps) => {
  const userFromStore = useAppSelector(user);

  const product = useObject(ProductSchema, productId);

  const { colorScheme } = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/30"
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Card className="mt-4">
            <UILabel text="Действия с лотом" />
            <View className="relative">
              <View className="-mt-10 absolute top-0 -right-4 z-10">
                <UIButton
                  type="link"
                  icon="iCloseLg"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </View>
              {product && (
                <View className="p-6">
                  {userFromStore?.id === product.userId && (
                    <View className="mb-2">
                      <UIButton
                        type="secondary"
                        text="Редактировать лот"
                        onPress={() => {
                          setModalVisible(false);
                          router.push({
                            pathname: "/create/[id]",
                            params: {
                              id: product._id.toString(),
                            },
                          });
                        }}
                      />
                    </View>
                  )}
                  <UIButton
                    type="secondary"
                    text="Пожаловаться"
                    onPress={() => {
                      setModalVisible(false);
                      router.push({
                        pathname: "/create/[id]",
                        params: {
                          id: product._id.toString(),
                        },
                      });
                    }}
                  />
                </View>
              )}
            </View>
          </Card>
        </Pressable>
      </Modal>
      <UIButton
        type="link"
        className="bg-s-200/20 dark:bg-s-950/20 p-2 rounded-lg"
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View className="">
          <SIcon
            path="iDotsVertical"
            size={25}
            color={colorScheme === "dark" ? Colors.s[100] : Colors.s[950]}
          />
        </View>
      </UIButton>
    </>
  );
};

export default ProductButtonMore;
