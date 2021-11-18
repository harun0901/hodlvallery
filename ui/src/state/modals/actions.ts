import { createAction } from '@reduxjs/toolkit'

export enum ApplicationModal {
  HOME,
  SWAP_MEET,
  SWAP_TOKENS,
  COMMUNITY_POOL,
  ADD_POOL,
  VIEW_MY_POOL,
  VIEW_ALL_POOL,
  VIEW_MY_FARM,
  VIEW_ALL_FARM,
  POOL_DETAILS,
  REMOVE_POOL,
  STAKE_HOME,
  ADD_STAKE,
  REMOVE_STAKE,
  COMMUNITY_FARM,
  FARM_DETAILS,
  CONNECT_WALLET,
  CONFIRMATION
}

export const setOpenModal = createAction<ApplicationModal | null>('modals/setOpenModal')
