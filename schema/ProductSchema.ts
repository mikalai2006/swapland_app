import Realm, { BSON, ObjectSchema } from "realm";
import { ImageSchema } from "./ImageSchema";

export class ProductSchema extends Realm.Object<ProductSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  categoryId!: string;
  title!: string;
  description!: string;
  status!: number;
  cost!: number;
  lat!: number;
  lon!: number;
  addressId?: string;
  actions?: Realm.List<number>;
  images?: Realm.List<ImageSchema>;
  // user!: UserSchema;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "ProductSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      categoryId: "string",
      title: "string",
      description: "string",
      status: "int",
      cost: "int",
      lat: "float",
      lon: "float",
      addressId: "string?",
      actions: "int[]",
      images: "ImageSchema[]",
      // user: {
      //   type: "linkingObjects",
      //   objectType: "UserSchema",
      //   property: "products",
      // },
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type ProductSchemaInput = {
  [Property in keyof ProductSchema]?: ProductSchema[Property];
};
