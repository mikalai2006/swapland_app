import Realm, { BSON, ObjectSchema } from "realm";

export class OfferSchema extends Realm.Object<OfferSchema> {
  _id!: BSON.ObjectId;
  userId!: string;
  productId!: string;
  userProductId!: string;
  rejectUserId!: string;
  message?: string;
  status!: number;
  cost!: number;
  win!: number;
  take!: number;
  give!: number;
  roomId!: string;
  createdAt!: string;
  updatedAt!: string;

  static schema: ObjectSchema = {
    name: "OfferSchema",
    properties: {
      _id: "objectId",
      userId: "string",
      productId: "string",
      userProductId: "string",
      rejectUserId: "string",
      message: "string?",
      status: "int",
      cost: "int",
      win: "int",
      take: "int",
      give: "int",
      roomId: "string",
      createdAt: { type: "string", optional: true },
      updatedAt: { type: "string", optional: true },
    },
    primaryKey: "_id",
  };
}

export type OfferSchemaInput = {
  [Property in keyof OfferSchema]?: OfferSchema[Property];
};
