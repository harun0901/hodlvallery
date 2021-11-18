import {TokenModel} from "./TokenModel";

export interface PoolModel {
  fromToken: TokenModel;
  toToken: TokenModel;
  rate: number;
  share: number;
  fromAdded: number;
  toAdded: number;
  addedAt: Date;
  quantity: number;
}