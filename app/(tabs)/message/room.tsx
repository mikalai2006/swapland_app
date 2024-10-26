import { View } from "react-native";

import { FlatList } from "react-native-gesture-handler";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { useQuery } from "@realm/react";
import useMessagesRooms from "@/hooks/useMessagesRooms";
import { MessageRoomSchema } from "@/schema/MessageRoomSchema";
import MessageRoomButton from "@/components/message/MessageRoomButton";
import useProducts from "@/hooks/useProducts";
import { useMemo } from "react";

export default function RoomScreen() {
  const userFromStore = useAppSelector(user);

  // useMessagesRooms({
  //   userId: userFromStore?.id,
  // });

  // const idsQuery = useMemo(
  //   () => productIds.map((x) => `'${x}'`).join(", "),
  //   [productIds]
  // );

  // const productsMessages = useQuery(
  //   ProductSchema,
  //   (items) => items.filtered(`sid IN {${idsQuery}}`),
  //   [idsQuery]
  // );
  const messageRooms = useQuery(
    MessageRoomSchema,
    (items) =>
      items.filtered(
        "(userId == $0 || takeUserId == $0) AND status >= 0",
        userFromStore?.id
      ),
    [userFromStore]
  );

  const messagesRoomsProductsId = useMemo(
    () => messageRooms.map((x) => x.productId),
    [messageRooms]
  );

  useProducts({ id: messagesRoomsProductsId });

  return (
    <View className="flex-1 bg-s-200 dark:bg-s-950">
      {/* <View className="p-4">
        <UIButton
          type="secondary"
          text="addProduct"
          onPress={() => router.push("/create")}
        />
      </View> */}
      {!messageRooms.length ? (
        <View></View>
      ) : (
        <FlatList
          data={messageRooms}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <MessageRoomButton roomId={item._id.toString()} />
          )}
        />
      )}
    </View>
  );
}
