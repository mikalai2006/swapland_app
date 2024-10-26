import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  AppState,
  ICategory,
  IFilter,
  IFilterSort,
  TTokenInput,
} from "@/types";
// import {IMarkerConfig} from '~utils/markerdata';

const initialState: AppState = {
  appState: null,
  countryStat: [],
  modeTheme: "light",
  drawer: false,
  tokens: null,
  langCode: "",
  activeLanguage: null,
  languages: [],
  countries: [],
  currencies: [],
  user: null,
  maxDistance: 1,
  bounds: {
    _northEast: {
      lat: 0,
      lng: 0,
    },
    _southWest: {
      lng: 0,
      lat: 0,
    },
  },
  magnitData: {
    status: false,
    angle: 0,
  },
  zoom: 8,
  center: { lat: 50, lng: 30 },
  // feature: null,
  positions: [],
  activeNode: null,
  // markerConfig: null,
  filter: {
    categories: [],
    showLessBal: false,
    sort: {
      icon: "iSortDownAlt",
      key: "createdAt",
      value: 1,
    },
    numColumns: 1,
  },
  categories: [],
  tags: {},
  nodes: [],
  historyQuery: [],
};

// Приведенная ниже функция называется thunk и позволяет нам выполнять асинхронную логику. Это
// можно отправить как обычное действие: `dispatch(incrementAsync(10))`. Этот
// вызовет преобразователь с функцией `dispatch` в качестве первого аргумента. Асинхронный
// затем код может быть выполнен и другие действия могут быть отправлены. Преобразователи
// обычно используется для выполнения асинхронных запросов.
export const incrementAsync = createAsyncThunk(
  "counter/fetchCount",
  async (amount: number) => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export const storeSlice = createSlice({
  name: "store",
  initialState,
  // Поле `reducers` позволяет нам определять редьюсеры и генерировать связанные действия
  reducers: {
    // Используйте тип PayloadAction для объявления содержимого `action.payload`
    setTokens: (state, action: PayloadAction<TTokenInput | null>) => {
      if (action.payload) {
        state.tokens = Object.assign({}, state.tokens, action.payload);
      } else {
        state.tokens = null;
      }
      // if (!state.tokens.access_token || state.tokens.access_token === '') {
      //     state.tokens.expires_in =
      // }
      // console.log("setTokens:::", state.tokens);
    },
    setCountryStat: (state, action: PayloadAction<ICountryStat[]>) => {
      state.countryStat = action.payload;
    },
    setMagnitData: (state, action: PayloadAction<IMagnitData>) => {
      state.magnitData = action.payload;
    },
    setHistoryQuery: (state, action: PayloadAction<IHistoryQuery[]>) => {
      state.historyQuery = action.payload?.length ? action.payload : [];
    },
    setAppState: (state, action: PayloadAction<TAppStateInput | null>) => {
      if (action.payload) {
        state.appState = Object.assign({}, state.appState, action.payload);
      } else {
        state.appState = null;
      }
      console.log("setAppState:::", state.appState, action.payload);
    },
    setUser: (state, action: PayloadAction<IUser | null>) => {
      // console.log('setUser: ', JSON.stringify(action.payload)); // JSON.stringify(action.payload)
      state.user = action.payload ? { ...action.payload } : null;
      if (state.user?.md !== undefined) {
        state.maxDistance = state.user?.md || 1;
      }
    },
    // setFeature: (state, action: PayloadAction<IFeature | null>) => {
    //     console.log('setFeature: ', JSON.stringify(action?.payload?.osmId));
    //     state.feature = action.payload ? {...action.payload} : action.payload;
    // },
    setModeTheme: (
      state,
      action: PayloadAction<"light" | "dark" | "system">
    ) => {
      // console.log('setDark: ', action.payload);
      state.modeTheme = action.payload;
    },
    setBounds: (state, action: PayloadAction<IBounds>) => {
      state.bounds = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setCenter: (state, action: PayloadAction<ILatLng>) => {
      state.center = action.payload;
    },
    setFilter: (state, action: PayloadAction<IFilter>) => {
      state.filter = action.payload;
    },
    setFilterCategory: (state, action: PayloadAction<string[]>) => {
      state.filter.categories = action.payload;
    },
    setFilterLessBal: (state, action: PayloadAction<boolean>) => {
      state.filter.showLessBal = action.payload;
    },
    setFilterSort: (state, action: PayloadAction<IFilterSort>) => {
      state.filter.sort = action.payload;
    },
    setFilterTypeList: (state, action: PayloadAction<number>) => {
      state.filter.numColumns = action.payload;
    },
    setNodes: (state, action: PayloadAction<INode[]>) => {
      state.nodes = JSON.parse(JSON.stringify(action.payload));
    },
    setActiveNode: (state, action: PayloadAction<INode | null>) => {
      // console.log('setActiveNode', action.payload?.osmId);

      state.activeNode = action.payload;
    },
    // setActiveMarkerConfig: (state, action: PayloadAction<IMarkerConfig | null>) => {
    //     console.log('setActiveMarkerConfig', action.payload?.type);

    //     state.markerConfig = action.payload;
    // },
    setLangCode: (state, action: PayloadAction<string>) => {
      // console.log('setLangCode:::::', state.langCode, action.payload);
      let activeLanguage = state.languages.find(
        (x) => x.code === action.payload
      );
      if (!activeLanguage) {
        activeLanguage = state.languages.find((x) => x.code === "en");
        state.langCode = "en";
      } else {
        state.langCode = action.payload;
      }

      if (activeLanguage) {
        state.activeLanguage = activeLanguage;
      }

      // console.log('activeLanguage', state.activeLanguage);
    },
    setLanguages: (state, action: PayloadAction<ILang[]>) => {
      // console.log('setLanguages:::::::::::::::::::::', action.payload); //action.payload
      state.languages = action.payload;
    },
    setCurrencies: (state, action: PayloadAction<ICurrency[]>) => {
      // console.log('setCurrencies:::::::::::::::::::::', action.payload);
      state.currencies = action.payload;
    },
    setCountries: (state, action: PayloadAction<ICountry[]>) => {
      // console.log('setCountries: ', action.payload.length); //action.payload
      state.countries = action.payload;
    },
    setDrawer: (state, action: PayloadAction<boolean>) => {
      console.log("Set drawer: ", action.payload);

      state.drawer = action.payload;
    },
    setPositions: (state, action: PayloadAction<any>) => {
      console.log("Set positions: ", action.payload);

      state.positions = [...state.positions];
      state.positions.push(action.payload);
    },
    clearPositions: (state) => {
      console.log("clearPositions");
      state.positions = [];
    },
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
    },
    setTags: (state, action: PayloadAction<ITag[]>) => {
      // console.log('setTags');
      state.tags = Object.fromEntries(action.payload.map((x) => [x.id, x]));
    },
  },
  // Поле `extraReducers` позволяет срезу обрабатывать действия, определенные в другом месте,
  // включая действия, сгенерированные createAsyncThunk или другими слайсами.
  // extraReducers: builder => {
  //     // builder
  //     //   .addCase(incrementAsync.pending, state => {
  //     //     state.status = 'loading';
  //     //   })
  //     //   .addCase(incrementAsync.fulfilled, (state, action) => {
  //     //     state.status = 'idle';
  //     //     state.value += action.payload;
  //     //   })
  //     //   .addCase(incrementAsync.rejected, state => {
  //     //     state.status = 'failed';
  //     //   });
  // },
});

export const {
  setAppState,
  setCountryStat,
  setModeTheme,
  setDrawer,
  setTokens,
  setActiveNode,
  setCurrencies,
  setLangCode,
  setUser,
  // setFeature,
  setPositions,
  clearPositions,
  setCategories,
  setTags,
  setBounds,
  setZoom,
  setCenter,
  setLanguages,
  setCountries,
  setFilter,
  setFilterCategory,
  setFilterLessBal,
  setFilterTypeList,
  setFilterSort,
  setNodes,
  setHistoryQuery,
  setMagnitData,
} = storeSlice.actions;
// Функция ниже называется селектором и позволяет нам выбрать значение из
// штат. Селекторы также могут быть определены встроенными, где они используются вместо
// в файле среза. Например: `useSelector((состояние: RootState) => состояние.счетчик.значение)`
export const appState = (state: RootState) => state.store.appState;
export const isOpenDrawer = (state: RootState) => state.store.drawer;
export const countryStat = (state: RootState) => state.store.countryStat;
export const modeTheme = (state: RootState) => state.store.modeTheme;
export const maxDistance = (state: RootState) => state.store.maxDistance;
export const tokens = (state: RootState) => state.store.tokens;
export const langCode = (state: RootState) => state.store.langCode;
export const activeLanguage = (state: RootState) => state.store.activeLanguage;
export const languages = (state: RootState) => state.store.languages;
export const user = (state: RootState) => state.store.user;
export const magnitData = (state: RootState) => state.store.magnitData;
// export const feature = (state: RootState) => state.store.feature;
export const activeNode = (state: RootState) => state.store.activeNode;
export const positions = (state: RootState) => state.store.positions;
export const currencies = (state: RootState) => state.store.currencies;
export const categories = (state: RootState) => state.store.categories;
export const tags = (state: RootState) => state.store.tags;
export const bounds = (state: RootState) => state.store.bounds;
export const zoom = (state: RootState) => state.store.zoom;
export const center = (state: RootState) => state.store.center;
export const filter = (state: RootState) => state.store.filter;
export const countries = (state: RootState) => state.store.countries;
export const nodes = (state: RootState) => state.store.nodes;
export const historyQuery = (state: RootState) => state.store.historyQuery;

export default storeSlice.reducer;
