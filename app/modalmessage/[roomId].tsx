import { Alert, Text, View } from "react-native";

import { ScrollView, TextInput } from "react-native-gesture-handler";
import { router, useLocalSearchParams, usePathname } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useColorScheme } from "nativewind";
import UIButtonBack from "@/components/ui/UIButtonBack";
import { useObject, useQuery } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductShortInfo from "@/components/product/ProductShortInfo";
import { UserSchema } from "@/schema/UserSchema";
import UserInfo from "@/components/user/UserInfo";
import UserInfoAvatar from "@/components/user/UserInfoAvatar";
import UIButton from "@/components/ui/UIButton";
import SIcon from "@/components/ui/SIcon";
import useMessages from "@/hooks/useMessages";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { hostAPI, hostSERVER } from "@/utils/global";
import { MessageRoomSchema } from "@/schema/MessageRoomSchema";
import { MessageSchema } from "@/schema/MessageSchema";
import dayjs from "@/utils/dayjs";
import { Colors } from "@/utils/Colors";
import { BSON } from "realm";
import { ImagePickerAsset } from "expo-image-picker";
import { IImage } from "@/types";
import UIUpload from "@/components/ui/UIUpload";
import RImage from "@/components/r/RImage";

export default function MessageRoomScreen() {
  const dispatch = useAppDispatch();

  const { colorScheme } = useColorScheme();

  const pathname = usePathname();

  const { roomId } = useLocalSearchParams<{
    roomId: string;
  }>();

  const room = useObject(MessageRoomSchema, new BSON.ObjectId(roomId));
  // const { productId: productIdGlobal } = useGlobalSearchParams<{
  //   productId: string;
  // }>();
  // if (!productId) {
  //   productId = productIdGlobal;
  // }

  const userFromStore = useAppSelector(user);

  const product = useObject(ProductSchema, new BSON.ObjectId(room?.productId));

  const userRoom = useObject(
    UserSchema,
    new BSON.ObjectId(
      room?.userId === userFromStore?.id ? room?.takeUserId : room?.userId
    )
  );

  const messagesByRoom = useQuery(MessageSchema, (items) =>
    items.filtered("roomId == $0", roomId)
  );

  const [newMessage, setNewMessage] = useState("");

  useMessages({ roomId: [roomId] });

  const [loading, setLoading] = useState(false);

  const [images, setImages] = useState<ImagePickerAsset[] | IImage[]>([]);

  const { onFetchWithAuth } = useFetchWithAuth();

  useEffect(() => {
    scrollView.current?.scrollToEnd({ animated: true });
  }, [messagesByRoom]);

  const onRemoveImage = async (
    img: ImagePickerAsset | IImage,
    index: number
  ) => {
    const newValue = images.slice();
    newValue.splice(index, 1);
    // console.log("Remove", img, index, newValue);
    setImages([...newValue]);
  };

  const onAddMessage = async () => {
    if (newMessage.trim() === "") {
      Alert.alert("Введите текст сообщения ");
      return;
    }

    setLoading(true);

    const data = new FormData();

    for (let index = 0; index < images.length; index++) {
      const element = images[index];
      data.append("images", {
        name: element.fileName,
        type: element.mimeType,
        uri: element.uri,
      });
    }

    data.append("message", newMessage);
    data.append("roomId", roomId);

    return await onFetchWithAuth(`${hostAPI}/message`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin-Type": "*",
      },
      body: data,
      // body: JSON.stringify({
      //   roomId,
      //   message: newMessage,
      // }),
    })
      .then((res) => res.json())
      .then((res: any) => {
        setNewMessage("");
        setImages([]);
      })
      .catch((e) => {
        console.log("onAddMessage Error", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const scrollView = useRef(null);

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            <UserInfo userId={userRoom?._id.toString()} />
          </View>
        </View>
        <View className="flex-1 bg-s-200 dark:bg-s-950">
          {product && room && (
            <>
              <View className="border-y bg-white dark:bg-s-800 border-s-200 dark:border-s-900 p-4">
                <View className="flex-auto flex flex-row items-center gap-4">
                  <View>
                    <UserInfoAvatar
                      key={room.userId}
                      userId={room.userId}
                      borderColor="border-white dark:border-s-800"
                    />
                  </View>
                  <View className="rotate-180">
                    <SIcon
                      path="iChevronLeftDouble"
                      size={20}
                      color={Colors.s[400]}
                    />
                  </View>
                  <View className="flex-auto">
                    <ProductShortInfo id={room.productId} />
                  </View>
                  <View className="rotate-180">
                    <SIcon
                      path="iChevronLeftDouble"
                      size={20}
                      color={Colors.s[400]}
                    />
                  </View>
                  <View>
                    <UserInfoAvatar
                      key={room.takeUserId}
                      userId={room.takeUserId}
                      borderColor="border-white dark:border-s-800"
                    />
                  </View>
                </View>
                <View className="pt-2">
                  <UIButton
                    type="primary"
                    text="Завершить сделку"
                    icon="iChevronRight"
                    startText
                    // className="m-0 bg-p-500 py-3"
                    onPress={() => {
                      router.push({
                        pathname: `/modaldeal/[id]`,
                        params: {
                          id: room.offerId,
                        },
                      });
                    }}
                  />
                </View>
              </View>
              <View className="flex-auto">
                <ScrollView
                  className="flex-1"
                  ref={(ref) => {
                    scrollView.current = ref;
                  }}
                >
                  <View className="p-4 flex items-stretch gap-4">
                    {/* <View className="flex flex-row gap-2">
                <UserInfoAvatar userId={userId} />
                <View className="bg-s-100 dark:bg-s-500/10 p-4 rounded-lg">
                  <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
                    {productId} {userId}
                  </Text>
                </View>
              </View> */}

                    {messagesByRoom.map((x) => (
                      <View
                        key={x._id.toString()}
                        className={`flex flex-row gap-2 ${
                          userFromStore?.id === x.userId ? " self-end" : ""
                        }`}
                      >
                        {userFromStore?.id !== x.userId && (
                          <View>
                            <UserInfoAvatar userId={x.userId} />
                          </View>
                        )}
                        <View className="flex-initial">
                          {/* <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
                      {productId}
                    </Text> */}
                          <View className="bg-white dark:bg-s-500/20 p-4 rounded-lg">
                            {/* <Text>{JSON.stringify(x.images)}</Text> */}
                            {x.images?.length ? (
                              <View className="flex flex-row flex-wrap gap-2 mb-4">
                                {x.images.map((uri, index) => (
                                  <View
                                    className="h-20 w-auto aspect-square"
                                    key={index.toString()}
                                  >
                                    <RImage
                                      uri={`${hostSERVER}/images/${uri}`}
                                      className="w-full h-full object-contain rounded-lg"
                                    />
                                  </View>
                                ))}
                              </View>
                            ) : null}
                            <Text className="text-lg text-s-800 dark:text-s-100 leading-5">
                              {x.message}
                            </Text>
                            <Text className="text-sm text-g-400 text-right">
                              {dayjs(x.createdAt).fromNow()}
                            </Text>
                          </View>
                          {/* <View></View> */}
                        </View>
                        {userFromStore?.id === x.userId && (
                          <View>
                            <UserInfoAvatar userId={x.userId} />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
              {images.length > 0 && (
                <View className="flex flex-row gap-2 bg-s-50 p-2 pb-0">
                  {images.map((img, index) => (
                    <View className="h-20 w-auto aspect-square" key={index}>
                      <RImage
                        image={img}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <View className="absolute -bottom-3 -right-3">
                        <UIButton
                          type="link"
                          // disabled={disabled}
                          onPress={() => onRemoveImage(img, index)}
                        >
                          <View className="bg-red-300 rounded-lg p-2">
                            <SIcon path="iDelete" size={20} />
                          </View>
                        </UIButton>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              <View className="flex flex-row flex-nowrap gap-0 items-stretch justify-stretch">
                <View className="flex items-stretch justify-stretch bg-s-50 dark:bg-s-800">
                  <UIUpload
                    value={images}
                    title="Изображения товара"
                    setValue={setImages}
                    service="message"
                    serviceId={undefined}
                    disabled={images.length >= 3}
                    hideList
                    chooseElement={
                      <View className="flex items-stretch justify-stretch">
                        <UIButton
                          type="link"
                          loading={loading}
                          disabled={loading}
                          onPress={() => {
                            router.navigate("/modalpicker");
                          }}
                        >
                          <SIcon path="iClip" size={25} color={Colors.s[500]} />
                        </UIButton>
                      </View>
                    }
                  />
                </View>
                <View className="flex-auto">
                  <TextInput
                    className="text-lg bg-s-50 dark:bg-s-800 p-4 text-s-900 dark:text-s-300 placeholder:text-s-500 focus:border-p-500"
                    value={newMessage}
                    placeholder="Введите сообщение ..."
                    onFocus={() => {
                      scrollView.current.scrollToEnd({ animated: true });
                    }}
                    onTouchStart={() => {
                      scrollView.current.scrollToEnd({ animated: true });
                    }}
                    onChangeText={(newMessage) => {
                      setNewMessage(newMessage);
                    }}
                  />
                </View>
                <View className="flex-none">
                  <UIButton
                    type="link"
                    loading={loading}
                    disabled={loading}
                    className="flex-1 m-0 p-4 bg-s-500"
                    onPress={() => {
                      onAddMessage();
                    }}
                  >
                    <SIcon
                      path="iChevronRightDouble"
                      size={25}
                      color={Colors.white}
                    />
                  </UIButton>
                </View>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
