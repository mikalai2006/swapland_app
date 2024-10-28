import "react-native-get-random-values";

import React, { useState } from "react";
import { hostAPI } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IAddress, IFilterSort, IResponseData } from "@/types";
import { useFocusEffect } from "expo-router";
import { useRealm } from "@realm/react";
import { BSON, UpdateMode } from "realm";

export interface IUseAddressesProps {
  userId?: string | undefined;
  sort?: IFilterSort;
}

const useAddresses = (props: IUseAddressesProps) => {
  const { t } = useTranslation();

  const { userId, sort } = props;

  const realm = useRealm();

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
            `${hostAPI}/address/find?` +
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
            .then((response: IResponseData<IAddress>) => {
              if (!ignore) {
                // console.log("UseAddresses response: ", response);

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
                          "AddressSchema",
                          {
                            ...listDataForRealm[i],
                          },
                          UpdateMode.Modified
                        );
                      }
                    } catch (e) {
                      console.log("UseAddresses error: ", e);
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
    error,
  };
};

export default useAddresses;
