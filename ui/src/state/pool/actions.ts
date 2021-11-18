import { createAction } from '@reduxjs/toolkit'
import { PoolModel } from "../../types/PoolModel";

export const setPoolData = createAction<{pool: PoolModel | null, isUserPool}>('pool/setPoolData')
