import { View } from "react-native";
import React, { useMemo, useState } from "react";

import { setTokens, tokens, user } from "@/store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTranslation } from "react-i18next";
import UIButton from "../ui/UIButton";
import { hostAPI } from "@/utils/global";
import useAuth from "@/hooks/useAuth";
import Card from "../Card";
import UIInput from "../ui/UIInput";

const UserSettingForm = () => {
  const { t } = useTranslation();

  const { onGetIam, onSyncToken: onCheckAuth } = useAuth();

  const dispatch = useAppDispatch();
  const userFromStore = useAppSelector(user);
  const tokensFromStore = useAppSelector(tokens);

  // const [login, setLogin] = useState(userFromStore?.login);
  const [myName, setMyName] = useState(userFromStore?.name);
  const disabledSave = useMemo(
    () => userFromStore?.name === myName || myName === "",
    [myName, userFromStore?.name]
  );
  const [loading, setLoading] = useState(false);
  const createFormData = (body: any = {}) => {
    const data = new FormData();

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };
  const onPatchUser = async () => {
    setLoading(true);

    await onCheckAuth();

    if (!tokensFromStore) {
      return;
    }

    return await fetch(hostAPI + `/user/${userFromStore?.id}`, {
      method: "PATCH",
      headers: {
        "Access-Control-Allow-Origin-Type": "*",
        Authorization: `Bearer ${tokensFromStore.access_token}`,
      },
      body: createFormData({ name: myName }),
    })
      .then((r) => r.json())
      .then(async (response) => {
        if (response.message && response?.code === 401) {
          dispatch(setTokens({ access_token: "" }));
        }

        if (response.id) {
          const result = await onGetIam();
          console.log("result: ", result, userFromStore);

          setMyName(result?.name);
          return response;
        }
      })
      .catch((e) => {
        console.log("e=", e);

        throw e;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Card>
        {/* <Text>{JSON.stringify(userFromStore?.name)}</Text> */}
        <UIInput
          value={myName}
          onChangeText={setMyName}
          keyboardType="default"
          title="Имя"
        />
        {/* <View className="mt-4">
                    <UIInput title="Логин" text={userFromStore?.login} />
                  </View> */}
        <View className="mt-4">
          <UIButton
            type="primary"
            text="Сохранить изменения"
            loading={loading}
            disabled={disabledSave}
            onPress={onPatchUser}
          />
        </View>
      </Card>
    </>
  );
};

export default UserSettingForm;
