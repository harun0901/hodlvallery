import { createAction } from '@reduxjs/toolkit'

export const setWeb3Provider = createAction<{
  provider: any
  web3Provider: any
  address: string
  chainId: number
  balance: any
}>('wallet/setWeb3Provider')
export const setAddress = createAction<{ address: string }>('wallet/setAddress')
export const setChainId = createAction<{ chainId: number }>('wallet/setChainId')
export const resetWeb3Provider = createAction<{}>('wallet/resetWeb3Provider')