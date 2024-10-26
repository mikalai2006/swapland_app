import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IFilterSort, IMessage, IResponseData } from "@/types";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";

export interface IuseMessagesProps {
  userId?: string | undefined;
  roomId?: string[] | undefined;
  productId?: string;
  sort?: IFilterSort;
}

const useMessages = (props: IuseMessagesProps) => {
  const { t } = useTranslation();

  const { userId, sort, roomId, productId } = props;

  // let query = "";
  // if (userId) {
  //   query += `userId == '${userId}' `;
  // }
  // if (productId) {
  //   // const idsQuery = productId.map((x) => `'${x}'`).join(", ");
  //   // query += `productId IN {${idsQuery}}`;

  //   query += (query !== "" ? "  && " : "") + ` productId == '${productId}' `;
  // }
  // const messages = useQuery(MessageSchema, (items) => items.filtered(query));

  const realm = useRealm();

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindMessages = async () => {
        try {
          // console.log({
          //   userId: userId || undefined,
          //   roomId: roomId || undefined,
          //   productId: productId?.length ? productId : undefined,
          //   sort: sort
          //     ? [
          //         {
          //           key: sort.key,
          //           value: sort.value,
          //         },
          //       ]
          //     : [],
          // });

          await onFetchWithAuth(
            `${hostAPI}/message/find?` +
              new URLSearchParams({
                lang: activeLanguageFromStore?.code || "en",
              }),
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              // node(id: "${featureFromStore?.id}") {
              body: JSON.stringify({
                userId: userId || undefined,
                productId: productId?.length ? productId : undefined,
                roomId: roomId && roomId.length > 0 ? roomId : undefined,
                sort: sort
                  ? [
                      {
                        key: sort.key,
                        value: sort.value,
                      },
                    ]
                  : [],
              }),
            }
          )
            .then((r) => r.json())
            .then((response: IResponseData<IMessage>) => {
              if (!ignore) {
                // console.log("useMessages response: ", response);

                const responseData = response;
                if (!responseData) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const responseItems = responseData.data;

                const listDataForRealm = responseItems.map((x) => {
                  return {
                    ...x,
                    _id: new BSON.ObjectId(x.id),
                  };
                });

                // console.log("listDataForRealm: ", listDataForRealm);
                if (listDataForRealm.length) {
                  realm.write(() => {
                    try {
                      for (
                        let i = 0, total = listDataForRealm.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "MessageSchema",
                          {
                            ...listDataForRealm[i],
                          },
                          UpdateMode.Modified
                        );
                      }
                    } catch (e) {
                      console.log("useMessages error: ", e);
                    }
                  });
                }
                // setProducts(responseProductsData);

                setTimeout(() => {
                  setLoading(false);
                }, 100);
                // console.log('activeMarker=', response);
                // dispatch(setActiveNode(responseNode));
              }
            })
            .catch((e) => {
              setTimeout(() => {
                setLoading(false);
              }, 300);
              throw e;
            });
        } catch (e: any) {
          // ToastAndroid.showWithGravity(
          //     `${t('general:alertAdviceTitle')}: ${e?.message}`,
          //     ToastAndroid.LONG,
          //     ToastAndroid.TOP,
          // );
          setError(e.message);
          // console.log('UseNode error: ', e?.message);
        }
      };

      if (!ignore) {
        // setTimeout(onGetNodeInfo, 100);
        onFindMessages();
      }

      return () => {
        ignore = true;
      };
    }, []) //productId, userId, sort
  );

  return {
    isLoading,
    // messages: messages || [],
    error,
  };
};

export default useMessages;
