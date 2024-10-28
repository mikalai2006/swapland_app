import "react-native-get-random-values";
import React, { useState } from "react";
import { hostAPI } from "@/utils/global";

import { useFetchWithAuth } from "./useFetchWithAuth";
import { useAppSelector } from "@/store/hooks";
import { activeLanguage } from "@/store/storeSlice";
import { useTranslation } from "react-i18next";
import { IProduct } from "@/types";
import { useObject, useQuery, useRealm } from "@realm/react";
import { ProductSchema } from "@/schema/ProductSchema";
import { UserSchema } from "@/schema/UserSchema";
import { OfferSchema } from "@/schema/OfferSchema";
import { BSON, UpdateMode } from "realm";

export interface IUseProductProps {
  id: string;
}

const useProduct = (props: IUseProductProps) => {
  const { id } = props;
  // const _id = new BSON.ObjectId("id")
  // console.log("useProduct---------------------->");

  const { t } = useTranslation();

  const realm = useRealm();
  const productFromRealm = useObject(
    ProductSchema,
    new BSON.ObjectId(id || "000000000000000000000000")
  );

  const { onFetchWithAuth } = useFetchWithAuth();

  const activeLanguageFromStore = useAppSelector(activeLanguage);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState<IProduct | null>(null);

  React.useEffect(() => {
    let ignore = false;
    const onFindProduct = async () => {
      try {
        // await onGetNode(activeLanguageFromStore?.code || 'en', localNode)
        await onFetchWithAuth(
          `${hostAPI}/product/find?` +
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
              id: [id],
            }),
          }
        )
          .then((r) => r.json())
          .then((response) => {
            if (!ignore) {
              // console.log("useProduct: ", response, "========>", id);

              const responseProduct: IProduct = response.data[0];
              if (!responseProduct) {
                // dispatch(setActiveNode(null));
                setProduct(null);
                setTimeout(() => {
                  setLoading(false);
                }, 300);
                return;
              }

              // console.log("listDataForRealm: ", listDataForRealm);
              realm.write(() => {
                try {
                  const dataForRealm = {
                    ...responseProduct,
                    _id: new BSON.ObjectId(responseProduct.id),
                    actions: responseProduct?.actions || [],
                  };

                  realm.create(
                    "ProductSchema",
                    dataForRealm,
                    UpdateMode.Modified
                  );

                  realm.create(
                    "UserSchema",
                    {
                      ...responseProduct.user,
                      _id: new BSON.ObjectId(responseProduct.userId),
                    },
                    UpdateMode.Modified
                  );

                  if (responseProduct.address) {
                    realm.create(
                      "AddressSchema",
                      {
                        ...responseProduct.address,
                        // sid: responseProductsData[i].user.id,
                        _id: new BSON.ObjectId(responseProduct.address.id),
                      },
                      UpdateMode.Modified
                    );
                  }
                  // const offersProduct = responseProduct.offers;
                  // for (
                  //   let i = 0, total = offersProduct.length;
                  //   i < total;
                  //   i++
                  // ) {
                  //   const existLocalOffer = localOffersMap.get(
                  //     offersProduct[i].id
                  //   );
                  //   realm.create(
                  //     "OfferSchema",
                  //     {
                  //       ...offersProduct[i],
                  //       sid: offersProduct[i].id,
                  //       _id: existLocalOffer?._id || new BSON.ObjectId(),
                  //     },
                  //     UpdateMode.Modified
                  //   );
                  // }
                } catch (e) {
                  console.log("useProduct error: ", e);
                }
              });
              setProduct(responseProduct);

              // setTimeout(() => {
              //   setLoading(false);
              // }, 100);
              // console.log('activeMarker=', response);
              // dispatch(setActiveNode(responseNode));
            }
          })
          .catch((e) => {
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

    if (id && !ignore) {
      // setTimeout(onGetNodeInfo, 100);
      onFindProduct();
    } else if (!id) {
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }

    return () => {
      ignore = true;
    };
  }, [id]);

  return {
    isLoading,
    product,
    productFromRealm: productFromRealm || null,
    setProduct,
    error,
  };
};

export default useProduct;
