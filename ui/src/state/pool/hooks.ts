import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import { setPoolData } from './actions'
import {PoolModel} from "../../types/PoolModel";

const usePool = () => {
  const dispatch = useDispatch<AppDispatch>()
  const selector = useSelector((state: AppState) => state.pool);

  const methods = useMemo(
    () => ({
      setPool: (pool: PoolModel, isUserPool: boolean): void => {
        dispatch(setPoolData({pool, isUserPool}));
      },
      getCurrentPool: (): {pool: PoolModel, isUserPool: boolean} => {
        return {
          pool: selector.poolData,
          isUserPool: selector.isUserPool
        };
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

export default usePool;
