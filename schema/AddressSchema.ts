import Realm, { BSON, ObjectSchema } from "realm";

export class AddressObjectSchema extends Realm.Object<AddressObjectSchema> {
  city_district?: string;
  country?: string;
  country_code?: string;
  house_number?: string;
  postcode?: string;
  state?: string;
  city?: string;
  village?: string;
  town?: string;
  road?: string;

  static schema: ObjectSchema = {
    name: "AddressObjectSchema",
    properties: {
      city_district: "string?",
      country: "string?",
      country_code: "string?",
      house_number: "string?",
      postcode: "string?",
      state: "string?",
      city: "string?",
      village: "string?",
      town: "string?",
      road: "string?",
    },
  };
}

export class AddressSchema extends Realm.Object<AddressSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  osmId!: string;
  address!: AddressObjectSchema;
  dAddress!: string;
  lat!: number;
  lon!: number;
  lang?: string;
  props?: any;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "AddressSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      osmId: "string",
      address: "AddressObjectSchema?",
      dAddress: "string",
      lat: "float",
      lon: "float",
      lang: "string?",
      props: "mixed?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type AddressSchemaInput = {
  [Property in keyof AddressSchema]?: AddressSchema[Property];
};
