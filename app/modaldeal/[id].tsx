import Card from "@/components/Card";
import OfferButtonChangeStatus from "@/components/offer/OfferButtonChangeStatus";
import ProductShortInfo from "@/components/product/ProductShortInfo";
import UIButton from "@/components/ui/UIButton";
import UIButtonBack from "@/components/ui/UIButtonBack";
import UILabel from "@/components/ui/UILabel";
import UserInfo from "@/components/user/UserInfo";
import { useFetchWithAuth } from "@/hooks/useFetchWithAuth";
import { OfferSchema } from "@/schema/OfferSchema";
import { ProductSchema } from "@/schema/ProductSchema";
import { useAppSelector } from "@/store/hooks";
import { user } from "@/store/storeSlice";
import { hostAPI } from "@/utils/global";
import { getNoun } from "@/utils/utils";
import { useObject, useQuery } from "@realm/react";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BSON } from "realm";

export default function ModalDeal() {
  const params = useLocalSearchParams<{ id: string }>();

  const userFromStore = useAppSelector(user);

  const offer = useObject(OfferSchema, new BSON.ObjectId(params.id));

  const product = useObject(ProductSchema, new BSON.ObjectId(offer?.productId));

  // const offers = useQuery(OfferSchema, (items) =>
  //   items.filtered("productId == $0", params.id)
  // );

  // const winOffer = useMemo(() => offers.find((x) => x.win === 1), [offers]);

  const [type, setType] = useState<"success" | "cancel" | "">("");

  const cancelWhy = {
    owner: [
      {
        id: "1",
        text: "Не хочу отдавать этот лот вообще",
        penalty: 0,
      },
      {
        id: "2",
        text: "Одаряемый не может забрать лот",
        penalty: 0,
      },
      {
        id: "3",
        text: "Одаряемому не понравился этот лот",
        penalty: 0,
      },
      {
        id: "4",
        text: "Не могу связаться с одаряемым",
        penalty: 0,
      },
      {
        id: "5",
        text: "Без комментариев",
        penalty: 0,
      },
    ],
    user: [
      {
        id: "1",
        text: "Не могу связаться с владельцем лота",
        penalty: 0,
      },
      {
        id: "2",
        text: "Меня не устраивает состояние этого лота",
        penalty: 0,
      },
      {
        id: "3",
        text: "Мне не нужен этот лот",
        penalty: 0,
      },
      {
        id: "4",
        text: "Без комментариев",
        penalty: 0,
      },
    ],
  };

  const why = useMemo(
    () => cancelWhy[offer?.userId === userFromStore?.id ? "user" : "owner"],
    [offer, cancelWhy, userFromStore]
  );

  const [message, setMessage] = useState<(typeof why)[0] | null>(null);

  const isEnd = useMemo(
    () =>
      (offer?.userId === userFromStore?.id && offer?.take === 1) ||
      (offer?.userProductId === userFromStore?.id && offer?.give === 1),
    [offer, userFromStore]
  );

  return (
    <View className="flex-1 bg-s-100 dark:bg-s-800">
      <SafeAreaView style={{ flex: 1 }}>
        <View className="flex flex-row gap-2 px-4 mb-2">
          <UIButtonBack />
          <View className="flex-auto">
            {product && <ProductShortInfo id={product?._id.toString()} />}
          </View>
        </View>
        {offer && product && (
          <ScrollView className="flex-1 bg-s-200 dark:bg-s-950">
            <View className="p-4">
              <Card className="mb-4">
                <UILabel text="Одаряемый" />
                <UserInfo key={offer?.userId} userId={offer?.userId} />
              </Card>

              {offer.give === 1 && (
                <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                  {offer?.userProductId === userFromStore?.id
                    ? "Вы отметили, что отдали лот"
                    : "Владелец отметил, что лот отдан"}
                </Text>
              )}

              {offer.take === 1 && (
                <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                  {offer?.userId === userFromStore?.id
                    ? "Вы отметили, что забрали лот"
                    : "Одаряемый отметил, что забрал лот"}
                </Text>
              )}

              {offer.take === 1 && offer.give === 1 && (
                <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                  Сделка завершена
                </Text>
              )}

              {type === "" &&
                offer?.userId === userFromStore?.id &&
                !isEnd &&
                offer.win === 1 && (
                  <Card className="mb-4">
                    <UILabel text="Подтверждение получения лота" />

                    {offer?.userId === userFromStore?.id && (
                      <View>
                        <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                          Внимание: Только, если вы получили лот, подтвердите
                          это, нажав кнопку ниже.
                        </Text>
                        <UIButton
                          type="success"
                          text="Подтвердить получение лота"
                          onPress={() => {
                            setType("success");
                            setMessage(null);
                          }}
                        ></UIButton>
                      </View>
                    )}
                    {/* : (
                    <View>
                      <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                        Если вы отдали лот, подтвердите это, нажав кнопку ниже
                      </Text>
                      <UIButton
                        type="success"
                        text="Подтвердить дарение лота"
                        onPress={() => {
                          setType("success");
                          setMessage(null);
                        }}
                      ></UIButton>
                    </View>
                  )} */}
                    {/* <Text>{JSON.stringify(offer)}</Text>
              <Text>{JSON.stringify(product)}</Text> */}
                    <View className="flex gap-2"></View>
                  </Card>
                )}
              {type === "" && !isEnd && (
                <Card className="">
                  <UILabel text="Отмена дарения лота" />
                  {offer?.userProductId === userFromStore?.id ? (
                    <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                      Если вы передумали отдавать этот лот, вы можете отменить
                      передачу, нажав кнопку ниже
                    </Text>
                  ) : (
                    <>
                      <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                        Вы можете отменить запрос на этот лот.
                      </Text>
                    </>
                  )}
                  <UIButton
                    type="danger"
                    text={
                      offer?.userId === userFromStore?.id
                        ? "Отменить запрос"
                        : "Отменить передачу лота"
                    }
                    onPress={() => {
                      setType("cancel");
                      setMessage(null);
                    }}
                  ></UIButton>
                  {/* <View className="flex gap-2"></View> */}
                </Card>
              )}

              {type !== "" && (
                <Card className="mb-4">
                  {type === "cancel" && <UILabel text="Отмена сделки" />}
                  {type === "success" && (
                    <UILabel text="Подтверждение сделки" />
                  )}
                  <View className="absolute top-0 right-0">
                    <UIButton
                      type="link"
                      icon="iClose"
                      onPress={() => {
                        setType("");
                      }}
                    />
                  </View>

                  {type === "cancel" && (
                    <>
                      {offer?.userId === userFromStore?.id && (
                        <Text className="mb-4 bg-r-500/20 p-4 rounded-lg text-lg text-r-800 dark:text-r-100 leading-6">
                          Внимание, отмена запроса снимет 1 бал!
                        </Text>
                      )}

                      <Text className="mb-4 text-lg text-s-800 dark:text-s-100 leading-6">
                        Выберите одну из более подходящих причин отмены сделки:
                      </Text>
                      <View className="gap-1 mb-4">
                        {why.map((item) => (
                          <UIButton
                            key={item.id}
                            type={
                              item.id === message?.id ? "primary" : "secondary"
                            }
                            text={item.text}
                            onPress={() => {
                              setMessage(item);
                            }}
                          />
                        ))}
                      </View>
                      <OfferButtonChangeStatus
                        type="danger"
                        win={0}
                        isTimerComplete={false}
                        productId={product._id}
                        offerId={offer._id}
                        disabled={!message}
                        message={message?.text}
                        text="Отменить передачу лота"
                        titleAlert="Отмена передачи"
                        textAlert="Вы действительно хотите отменить передачу лота?"
                      />
                    </>
                  )}

                  {type === "success" && (
                    <>
                      <Text className="mb-4 bg-r-500/20 p-4 rounded-lg text-lg text-r-800 dark:text-r-100 leading-6">
                        Будьте внимательны! Мошенники
                        {/* Отметив, что вы получили лот, вы
                        передадите {offer.cost}{" "}
                        {getNoun(offer.cost, "балл", "балла", "баллов")}{" "}
                        владельцу лота. */}
                      </Text>
                      {offer?.userId === userFromStore?.id ? (
                        <OfferButtonChangeStatus
                          type="secondary"
                          take={1}
                          isTimerComplete={false}
                          productId={product._id}
                          offerId={offer._id}
                          text="Подтвердить получение лота"
                          titleAlert="Получение лота"
                          textAlert="Вы действительно получили лот?"
                        />
                      ) : (
                        <OfferButtonChangeStatus
                          type="success"
                          give={1}
                          isTimerComplete={false}
                          productId={product._id}
                          offerId={offer._id}
                          text="Подтвердить дарение лота"
                          titleAlert="Дарение лота"
                          textAlert="Вы действительно отдали лот?"
                        />
                      )}
                    </>
                  )}
                </Card>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}
