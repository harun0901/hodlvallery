import { createAction } from '@reduxjs/toolkit'
import { FarmModel } from "../../types/FarmModel";

export const setFarmData = createAction<{farm: FarmModel | null}>('pool/setFarmData')
