import {TokenModel} from "./TokenModel";

export interface FarmModel {
  tvl: number;
  rewards: number;
  staked: number;
  apr: number;
  harvesting: boolean;
  rewardToken: TokenModel;
  stakeToken: TokenModel;
}