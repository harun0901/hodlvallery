import { createReducer } from '@reduxjs/toolkit'
import {
  setFarmData
} from './actions'
import {FarmModel} from "../../types/FarmModel";

export interface FarmState {
  readonly farmData: FarmModel | null
}

const initialState: FarmState = {
  farmData: null
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setFarmData, (state, action) => {
      state.farmData = action.payload.farm;
    })
)
