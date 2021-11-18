import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { setFarmData } from './actions'
import {FarmModel} from "../../types/FarmModel";

const useFarm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const selector = useSelector((state: AppState) => state.farm);

  const methods = useMemo(
    () => ({
      setFarm: (farm: FarmModel): void => {
        dispatch(setFarmData({farm}));
      },
      getCurrentFarm: (): FarmModel => {
        return selector.farmData;
      },
    }),
    [dispatch, selector]
  );

  return useMemo(
    () => ({
      ...methods
    }),
    [methods]
  );
};

export default useFarm;
