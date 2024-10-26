import Realm, { BSON, ObjectSchema } from "realm";
import { ImageSchema } from "./ImageSchema";

export class LocationSchema extends Realm.Object<LocationSchema> {
  lon?: number;
  lat?: number;
  osmId?: string;
  address?: any;

  static schema: ObjectSchema = {
    name: "LocationSchema",
    properties: {
      lon: "float",
      lat: "float",
      osmId: "string",
      address: "mixed",
    },
  };
}

export class UserSchema extends Realm.Object<UserSchema> {
  _id!: BSON.ObjectId;
  name!: string;
  login!: string;
  currency?: string;
  lang?: string;
  online?: boolean;
  verify?: boolean;
  location?: LocationSchema;
  images?: Realm.List<ImageSchema>;
  // products?: Realm.List<ProductSchema>;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "UserSchema",
    properties: {
      _id: "objectId",
      name: "string",
      login: "string",
      currency: "string?",
      lang: "string?",
      online: "bool?",
      verify: "bool?",
      location: "LocationSchema?",
      images: "ImageSchema[]",
      // products: "ProductSchema[]?",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type UserSchemaInput = {
  [Property in keyof UserSchema]?: UserSchema[Property];
};
