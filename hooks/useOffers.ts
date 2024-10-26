import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IFilterSort, IOffer, IResponseData } from "@/types";
import { useFocusEffect } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";
import { UserSchema } from "@/schema/UserSchema";
import { OfferSchema } from "@/schema/OfferSchema";

export interface IUseOffersProps {
  userId?: string | undefined;
  productId?: string[];
  sort?: IFilterSort;
}

const useOffers = (props: IUseOffersProps) => {
  const { t } = useTranslation();

  const { userId, sort, productId } = props;

  let query = "";
  if (userId) {
    query += `userId == '${userId}' `;
  }
  if (productId?.length) {
    const idsQuery = productId.map((x) => `'${x}'`).join(", ");
    query += `productId IN {${idsQuery}}`;
  }
  const offers = useQuery(OfferSchema, (items) => items.filtered(query));

  const realm = useRealm();
  // const usersFromRealm = useQuery(UserSchema);
  const offersFromRealm = useQuery(OfferSchema);

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindOffers = async () => {
        try {
          await onFetchWithAuth(
            `${hostAPI}/offer/find?` +
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
            .then((response: IResponseData<IOffer>) => {
              if (!ignore) {
                // console.log("useOffers response: ", response);

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
                          "OfferSchema",
                          {
                            ...listDataForRealm[i],
                          },
                          UpdateMode.Modified
                        );
                      }

                      for (
                        let i = 0, total = responseItems.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "UserSchema",
                          {
                            ...responseItems[i].user,
                            _id: new BSON.ObjectId(responseItems[i].user.id),
                          },
                          UpdateMode.Modified
                        );
                      }
                    } catch (e) {
                      console.log("useOffers error: ", e);
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
        onFindOffers();
      }

      return () => {
        ignore = true;
      };
    }, []) //productId, userId, sort
  );

  return {
    isLoading,
    offers: offers || [],
    error,
  };
};

export default useOffers;
