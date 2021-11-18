import { createReducer } from '@reduxjs/toolkit'
import {
  setPoolData
} from './actions'
import {PoolModel} from "../../types/PoolModel";

export interface PoolState {
  readonly poolData: PoolModel | null
  readonly isUserPool: boolean
}

const initialState: PoolState = {
  poolData: null,
  isUserPool: false
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setPoolData, (state, action) => {
      state.poolData = action.payload.pool;
      state.isUserPool = action.payload.isUserPool;
    })
)
