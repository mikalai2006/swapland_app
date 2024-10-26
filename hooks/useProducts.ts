import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IFilterSort, IOffer, IProduct } from "@/types";
import { useFocusEffect } from "expo-router";
import { useQuery, useRealm } from "@realm/react";
import { ProductSchema, ProductSchemaInput } from "@/schema/ProductSchema";
import { BSON, UpdateMode } from "realm";
import { UserSchema } from "@/schema/UserSchema";
import { OfferSchema } from "@/schema/OfferSchema";

export interface IUseProductsProps {
  userId?: string | undefined;
  query?: string;
  categoryId?: string[];
  cost?: number;
  sort?: IFilterSort;
  id?: string[];
  onlyMyOffers?: boolean;
}

const useProducts = (props: IUseProductsProps) => {
  // console.log("useProducts render---------------------->");

  const { t } = useTranslation();

  const realm = useRealm();
  const productsFromRealm = useQuery(ProductSchema);

  const { query, userId, categoryId, cost, sort, id, onlyMyOffers } = props;

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [products, setProducts] = useState<IProduct[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      let ignore = false;
      const onFindProducts = async () => {
        try {
          // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
          await onFetchWithAuth(
            `${hostAPI}/product/${onlyMyOffers ? "myoffers" : "find"}?` +
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
                query: query || undefined,
                categoryId,
                id,
                cost,
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
            .then((response) => {
              if (!ignore) {
                // console.log("useProducts response: ", response);

                const responseProducts = response;
                if (!responseProducts) {
                  // dispatch(setActiveNode(null));
                  // setProducts([]);
                  setTimeout(() => {
                    setLoading(false);
                  }, 300);
                  return;
                }

                const responseProductsData: IProduct[] = responseProducts.data;

                const listDataForRealm = responseProductsData.map(
                  (x: IProduct) => {
                    return {
                      ...x,
                      // _id: existLocalNode?._id || new BSON.ObjectId(),
                      _id: new BSON.ObjectId(x.id),
                      actions: x?.actions || [],
                    };
                  }
                );

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
                          "ProductSchema",
                          listDataForRealm[i],
                          UpdateMode.Modified
                        );
                      }

                      for (
                        let i = 0, total = responseProductsData.length;
                        i < total;
                        i++
                      ) {
                        realm.create(
                          "UserSchema",
                          {
                            ...responseProductsData[i].user,
                            // sid: responseProductsData[i].user.id,
                            _id: new BSON.ObjectId(
                              responseProductsData[i].user.id
                            ),
                          },
                          UpdateMode.Modified
                        );
                      }

                      // const allOffers = responseProductsData.reduce(
                      //   (ac, item) => {
                      //     ac.push(...item.offers);
                      //     return ac;
                      //   },
                      //   [] as IOffer[]
                      // );
                      // for (
                      //   let i = 0, total = allOffers.length;
                      //   i < total;
                      //   i++
                      // ) {
                      //   const existLocalOffer = localOffersMap.get(
                      //     allOffers[i].id
                      //   );
                      //   realm.create(
                      //     "OfferSchema",
                      //     {
                      //       ...allOffers[i],
                      //       sid: allOffers[i].id,
                      //       _id: existLocalOffer?._id || new BSON.ObjectId(),
                      //     },
                      //     UpdateMode.Modified
                      //   );
                      // }
                    } catch (e) {
                      console.log("useProducts error: ", e);
                    }
                  });
                }
                // console.log("productsFromRealm: ", localOffersMap);
                // setProducts(responseProductsData);

                // console.log('activeMarker=', response);
                // dispatch(setActiveNode(responseNode));
              }
            })
            .catch((e) => {
              // setTimeout(() => {
              //   setLoading(false);
              // }, 300);
              throw e;
            })
            .finally(() => {
              setTimeout(() => {
                setLoading(false);
              }, 300);
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
        onFindProducts();
      }

      return () => {
        ignore = true;
      };
    }, [query, userId, id, categoryId, cost, sort])
  );

  return {
    isLoading,
    products: productsFromRealm.length ? productsFromRealm : [],
    error,
  };
};

export default useProducts;
