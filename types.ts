import * as icons from "@/utils/icons";

export interface IWsMessage {
  type: string;
  sender: string;
  recipient: string;
  content: any;
  id: string;
  service: string;
}

export interface ILang {
  id: string;
  locale: string;
  code: string;
  name: string;
  localization: {
    [key: string]: any;
  };
  flag: string;
  publish: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: string;
}
export interface IProduct {
  id: string;
  title: string;
  description: string;
  userId: string;
  categoryId: string;
  localization: {
    [key: string]: any;
  };
  cost: number;
  actions: number[];
  status: number;
  images: IImage[];
  user: IUser;
  offers: IOffer[];
  createdAt: Date;
  updatedAt: string;
}
export interface ICategory {
  id: string;
  userId: string;
  seo: string;
  title: string;
  description: string;
  props: { [key: string]: string };
  locale: { [key: string]: string };
  parent: string;
  status: number;

  createdAt: Date;
  updatedAt: string;
}

export type TCategoryInput = {
  [Property in keyof ICategory]?: ICategory[Property];
};

export interface ICurrency {
  id: string;
  status: boolean;
  title: string;
  code: string;
  symbolLeft: string;
  symbolRight: string;
  decimalPlaces: number;
  value: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITokens {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: number;
  expires_in_r: number;
}
export type TTokenInput = {
  [Property in keyof ITokens]?: ITokens[Property];
};
export type ITokenResponse = {
  token: string;
  rt: string;
  exp: number;
  expr: number;
};

export interface IResponseData<T> {
  data: T[];
  limit: number;
  total: number;
  skip: number;
}

export interface IUserStat {
  addProduct: number;
  takeProduct: number;
  giveProduct: number;
  addOffer: number;
  takeOffer: number;
  addMessage: number;
  takeMessage: number;
  addReview: number;
  takeReview: number;
  warning: number;
  request: number;
  subscribe: number;
  subscriber: number;
  lastRequest: Date;
}

export interface IAddress {
  poscode: string;
  country: string;
  house_number: string;
  road: string;
  city: string;
  state: string;
  city_district: string;
  "ISO3166-2-lvl4": string;
  country_code: string;
}

export interface IUserLocation {
  lat: number;
  lon: number;
  osmId: string;
  address: IAddress;
}

export interface IUser {
  id: string;
  userId: string;
  name: string;
  login: string;
  lang: string;
  avatar: string;
  roles: ["admin", "user"];
  md: number;
  bal: number;
  images: IImage[];
  online: boolean;
  location: IUserLocation;
  userStat: IUserStat;
  createdAt: string;
  updatedAt: string;
}
export interface IFeature {
  type: string;
  id: string;
  osmId: string;
  properties: Properties;
  geometry: Geometry;
}
export interface Properties {
  amenity?: string;
  [key: string]: any;
  id: string;
}
export interface Geometry {
  type: string;
  coordinates?: number[] | null;
}
export type TFeatureInput = {
  [Property in keyof IFeature]?: IFeature[Property];
};

export interface IPoint {
  lat: string;
  lon: string;
}

export interface ITagData {
  id: string;
  nodeId: string;
  tagId: string;
  tagoptId: string;
  value: string;
  tag: ITag;
  updatedAt: string;
  createdAt: string;
}

export interface ITag {
  id: string;
  userId: string;
  key: string;
  title: string;
  type: string;
  description: string;
  props: { [key: string]: any };
  // options: ITagopt[];
  multiopt: number;
  isFilter: boolean;
  // tagoptId: string[];
  createdAt: Date;
  updatedAt: string;
}

export interface IAddressProps {
  title: string;
  subtitle: string;
  name: string;
  lat: string;
  lon: string;
  class: string;
  addresstype: string;
}

export interface IReviewsInfo {
  count: number;
  value: number;
  ratings: {
    _id: number;
    count: number;
  }[];
}

export interface IReview {
  id: string;
  userId: string;
  nodeId: string;
  rate: number;
  review: string;
  user: IUser;
  updatedAt: string;
  createdAt: string;
}
export type TReviewInput = {
  [Property in keyof IReview]?: IReview[Property];
};

export interface ILike {
  _id: string;
  nodeId: string;
  userId: string;
  status: number;
  updatedAt: string;
  createdAt: string;
}

export interface ILikeNode {
  like: number;
  dlike: number;
  ilike: ILike;
}

// export interface IActiveNode {
//     _id: string;
//     osmId: string;
//     type: string;
//     lat: number;
//     lon: number;
//     props: any;
//     address: IAddress;
//     data: ITagData[];
//     reviews: IReview[];
//     reviewsInfo: IReviewsInfo;
//     like: ILikeNode;

//     updatedAt: string;
//     createdAt: string;
// }
export interface IQuestion {
  id: string;
  userId: string;
  productId: string;
  question: string;
  answer: string;
  status: number;
  createdAt: Date;
  updatedAt: string;
}

export type TIQuestionInput = {
  [Property in keyof IQuestion]?: IQuestion[Property];
};

export interface INodedataVote {
  id: string;
  userId: string;
  nodeId: string;
  nodedataId: string;
  nodedataUserId: string;
  value: number;
  user?: IUser;
  owner?: IUser;
  createdAt: string;
  updatedAt: string;
}
export type TNodedataVoteInput = {
  [Property in keyof INodedataVote]?: INodedataVote[Property];
};

export interface ICountryStat {
  idCountry: string;
  code: string;
  count: number;
  size: number;
  lastUpdatedAt: string;
  createdAt: string;
}

export interface ICountry {
  id: string;
  code: string;
  name: string;
  flag: string;
  image: string;
  publish: boolean;
  sortOrder: number;
  stat: ICountryStat;
  createdAt: string;
  updatedAt: string;
}

export type TCountryInput = {
  [Property in keyof ICountry]?: ICountry[Property];
};

export type IMessageGroup = {
  productId: string;
  count: number;
  product?: IProduct;
};

export interface IMessage {
  id: string;
  userId: string;
  productId: string;
  roomId: string;
  message: string;
  status: number;
  // user: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IMessageRoom {
  id: string;
  userId: string;
  productId: string;
  takeUserId: string;
  status: number;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}

export type TIMessageInput = {
  [Property in keyof IMessage]?: IMessage[Property];
};

export interface IOffer {
  id: string;
  userId: string;
  productId: string;
  message: string;
  cost: number;
  status: number;
  win: number;
  give: number;
  take: number;
  roomId: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}

export type TIOfferInput = {
  [Property in keyof IOffer]?: IOffer[Property];
};

// export interface IReviewsInfo {
//     count: number;
//     value: number;
// }
export interface IImage {
  id: string;
  userId: string;
  service: string;
  serviceId: string;
  ext: string;
  path: string;
  dir: string;
  user: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface INodeAudit {
  id: string;
  userId: string;
  user: IUser;
  message: string;
  status: number;
  props: any;
}
export interface INodeVote {
  id: string;
  userId: string;
  nodeId: string;
  nodeUserId: string;
  user: IUser;
  owner: IUser;
  value: number;
  createdAt: string;
  updatedAt: string;
}
export type TNodeVoteInput = {
  [Property in keyof INodeVote]?: INodeVote[Property];
};

export interface IMagnitData {
  angle: number;
  status: boolean;
}

export interface INode {
  id: string;
  userId: string;
  user: IUser;
  tags: string[];
  data: INodedata[];
  type: string;
  name: string;
  osmId: string;
  ccode: string;
  reviews: IReview[];
  reviewsInfo: IReviewsInfo;
  address: IAddress;
  images: IImage[];
  audits: INodeAudit[];
  // votes: INodeVote[];
  nodeLike: ILikeNode;
  props: any;
  lon: number;
  lat: number;
  createdAt: Date;
  updatedAt: string;
}

export type TNodeInput = {
  [Property in keyof INode]?: INode[Property];
};

export interface ILatLng {
  lat: number;
  lng: number;
}

export type IBounds = {
  _northEast: ILatLng;
  _southWest: ILatLng;
};

export interface ISort {
  key: string;
  title: string;
  icon: keyof typeof icons;
  value: number;
}

export type IFilterSort = {
  key: string;
  value: number;
  icon?: keyof typeof icons;
};

export type IFilter = {
  categories: string[];
  showLessBal: boolean;
  numColumns: number;
  sort: IFilterSort;
};

export interface IAppState {}
export type TAppStateInput = {
  [Property in keyof IAppState]?: IAppState[Property];
};

export interface IHistoryQuery {
  query: string;
  createdAt: string;
}

export interface AppState {
  appState: IAppState | null;
  modeTheme: "dark" | "light" | "system";
  drawer: boolean;
  tokens: ITokens | null;
  langCode: string;
  countryStat: ICountryStat[];
  activeLanguage: null | ILang;
  languages: ILang[];
  currencies: ICurrency[];
  countries: ICountry[];
  user: IUser | null;
  // feature: IFeature | null;
  positions: any[];
  activeNode: INode | null;
  maxDistance: number;
  // markerConfig: IMarkerConfig | null;
  bounds: IBounds;
  zoom: number;
  center: ILatLng;
  filter: IFilter;
  categories: ICategory[];
  tags: {
    [key: string]: ITag;
  };
  nodes: INode[];
  historyQuery: IHistoryQuery[];
  magnitData: IMagnitData;
}
