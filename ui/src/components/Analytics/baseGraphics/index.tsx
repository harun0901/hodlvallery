import {useMemo, useState} from "react";
import { useQuery } from "@apollo/client";
import { useInterval } from "../../../analytics/core/hooks";
import {getDayData} from "../../../analytics/core/api/exchange";
import {getOneDayEthPrice, getSevenDayEthPrice} from "../../../analytics/core/api";
import {currencyFormatter, decimalFormatter} from "../../../analytics/core/format";
import Graphic from "../Graphic";
import {dayDatasQuery} from "../../../analytics/core/queries/exchange";
import {oneMonth} from "../../../analytics/core/timestamps";

import styles from "./baseGraphics.module.scss";

const BaseGraphics: React.FC = ({}) => {
  const { data } = useQuery(dayDatasQuery);
  const dayDatas = useMemo(() => data?.dayDatas || [], [data])

  useInterval(
    () =>
      Promise.all([
        getDayData,
        getOneDayEthPrice,
        getSevenDayEthPrice,
      ]),
    60000
  );

  const [timespan, setTimespan] = useState(oneMonth());

  const [liquidity, volume, fees] = dayDatas
    .filter((d) => d.liquidityUSD !== "0")
    .reduce(
      (previousValue, currentValue, currentIndex) => {
        previousValue[0].unshift({
          date: currentValue.date,
          // value: parseFloat(currentValue.liquidityUSD),
          name: currentIndex+1,
          pv: parseFloat(currentValue.liquidityUSD),
        });
        previousValue[1].unshift({
          date: currentValue.date,
          // value: parseFloat(currentValue.volumeUSD),
          name: currentIndex+1,
          pv: parseFloat(currentValue.volumeUSD),
        });
        previousValue[2].unshift({
          date: currentValue.date,
          // value: parseFloat(currentValue.volumeUSD),
          name: currentIndex+1,
          pv: parseFloat(currentValue.volumeUSD)*0.003,
        });
        return previousValue;
      },
      [[], [], []]
    );

  const dataDayChange = (dataPoint)=>{
    if (dataPoint.length > 0) {
      const oldVal = dataPoint[dataPoint.length - 2].pv
      const newVal = dataPoint[dataPoint.length - 1].pv

      const increase = newVal - oldVal
      const percentageIncrease = (increase/oldVal)*100

      return percentageIncrease
    }
    return 0
  }

  const orderGraphPoints = (singleGraphPoint, index) => {
    return {
      ...singleGraphPoint,
      name: index
    }
  }

  const setGraphRange = (data) => {
    return  data.filter((d) => timespan <= d.date);
  }

  return (
    <div className={'border-b-10 border-white flex bg-gray-200'}>
      <div className={`${styles.topColumn} border-r-10`}>
        <div className={'flex justify-between items-center'}>
          <p className={`${styles.topColumnVal} text-gray-400`}>{volume[volume.length - 1]?.pv? currencyFormatter.format(volume[volume.length - 1].pv): 0}</p>
          <p className={`${styles.topColumnVal} ${dataDayChange(volume)>0?'text-green-360': 'text-red-400'  }`}>{decimalFormatter.format(Math.abs(dataDayChange(volume)))} %</p>
        </div>
        <p className={styles.topColumnSubtitle}>VOLUME (1M)</p>
        <div className={'py-20px'}>
          <Graphic data={setGraphRange(volume).map(orderGraphPoints)} />
        </div>
      </div>
      <div className={`${styles.topColumn} border-r-10`}>
        <div className={'flex justify-between items-center'}>
          <p className={`${styles.topColumnVal} text-gray-400`}>{volume[volume.length - 1]?.pv?currencyFormatter.format(volume[volume.length - 1].pv*0.003): 0}</p>
          <p className={`${styles.topColumnVal} ${dataDayChange(fees)>0?'text-green-360': 'text-red-400'  }`}>{decimalFormatter.format(Math.abs(dataDayChange(fees)))} %</p>
        </div>
        <p className={styles.topColumnSubtitle}>FEES (1M)</p>
        <div className={'py-20px'}>
          <Graphic data={setGraphRange(fees).map(orderGraphPoints)} />
        </div>
      </div>
      <div className={`${styles.topColumn}`}>
        <div className={'flex justify-between items-center'}>
          <p className={`${styles.topColumnVal} text-gray-400`}>{liquidity[liquidity.length - 1]?.pv ? currencyFormatter.format(liquidity[liquidity.length - 1].pv): 0}</p>
          <p className={`${styles.topColumnVal}  ${dataDayChange(liquidity)>0?'text-green-360': 'text-red-400'}`}>{decimalFormatter.format(Math.abs(dataDayChange(liquidity)))} %</p>
        </div>
        <p className={styles.topColumnSubtitle}>TVL</p>
        <div className={'py-20px'}>
          <Graphic data={setGraphRange(liquidity).map(orderGraphPoints)} />
        </div>
      </div>
    </div>
  )
};

export default BaseGraphics;
