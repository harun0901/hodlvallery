import { createReducer } from '@reduxjs/toolkit'
import {
  setWeb3Provider,
  setAddress,
  setChainId,
  resetWeb3Provider
} from './actions'

export interface WalletState {
  readonly provider: any,
  readonly web3Provider: any,
  readonly address: string,
  readonly chainId: number,
  readonly balance: any
}

const initialState: WalletState = {
  provider: null,
  web3Provider: null,
  address: null,
  chainId: null,
  balance: null
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setWeb3Provider, (state, action) => {
      state.provider = action.payload.provider;
      state.web3Provider = action.payload.web3Provider;
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.balance = action.payload.balance;
    })
    .addCase(setAddress, (state, action) => {
      state.address = action.payload.address;
    })
    .addCase(setChainId, (state, action) => {
      state.chainId = action.payload.chainId
    })
    .addCase(resetWeb3Provider, (state, action) => {
      state.provider = initialState.provider;
      state.web3Provider = initialState.web3Provider;
      state.address = initialState.address;
      state.chainId = initialState.chainId;
      state.balance = initialState.balance;
    })
)
