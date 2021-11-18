import { combineReducers } from '@reduxjs/toolkit'
import modals from './modals/reducer'
import pool from './pool/reducer'
import wallet from './wallet/reducer'
import application from './application/reducer'
import lists from './lists/reducer'
import multicall from './multicall/reducer'
import swap from './swap/reducer'
import user from './user/reducer'
import transactions from './transactions/reducer'
import create from './create/reducer'
import farm from './farm/reducer'
import limitOrder from './limit-order/reducer'

const reducer = combineReducers({
    modals,
    pool,
    wallet,
    application,
    lists,
    multicall,
    swap,
    user,
    transactions,
    create,
    farm,
    limitOrder
})

export default reducer