import { Table } from "../../index"
import { Column } from "react-table";
import { PAIR_DENY } from "../../../analytics/core/constants";
import {useMemo} from "react";

import { PAIR_COLUMNS } from "./config";
import {useQuery} from "@apollo/client";
import {pairsQuery} from "../../../analytics/core/queries/exchange";
import {useInterval} from "../../../analytics/core/hooks";
import {getPairs} from "../../../analytics/core/api";

export interface PairModel {
  fromTokenSymbol: string;
  toTokenSymbol: string;
  liquidity: number;
  volume24h: number;
  volume7d: number;
  fees24h: number;
  fees7d: number;
  feesYearly: number;
}

interface PairsProps {

}

const PairsPage: React.FC<PairsProps> = () => {
  const {
    data: { pairs },
  } = useQuery(pairsQuery);

  useInterval(
    () =>
      Promise.all([
        getPairs
      ]),
    60000
  );

  const columns: Column[] = useMemo(() => PAIR_COLUMNS, []);

  const tableData: PairModel[] = pairs
      .filter((row)=>{
        return !PAIR_DENY.includes(row.id);
      })
      .map((pair)=>{
        const volumeUSD =
            pair?.volumeUSD === "0" ? pair?.untrackedVolumeUSD : pair?.volumeUSD;

        const oneDayVolumeUSD =
            pair?.oneDay?.volumeUSD === "0"
                ? pair?.oneDay?.untrackedVolumeUSD
                : pair?.oneDay?.volumeUSD;

        const sevenDayVolumeUSD =
            pair?.sevenDay?.volumeUSD === "0"
                ? pair?.sevenDay?.untrackedVolumeUSD
                : pair?.sevenDay?.volumeUSD;

        const oneDayVolume = volumeUSD - oneDayVolumeUSD;
        const oneDayFees = oneDayVolume * 0.003;
        const oneYearFees = (oneDayVolume * 0.003 * 365 * 100) / pair.reserveUSD;
        const sevenDayVolume = volumeUSD - sevenDayVolumeUSD;
        return {
          ...pair,
          oneDayVolume: !Number.isNaN(oneDayVolume) ? oneDayVolume : 0,
          sevenDayVolume: !Number.isNaN(sevenDayVolume) ? sevenDayVolume : 0,
          oneDayFees: !Number.isNaN(oneDayFees) ? oneDayFees : 0,
          oneYearFees,
        }
      })
      .map((rawPair)=>{
    return {
      ...rawPair,
      fromTokenSymbol: rawPair.token0.symbol.replace("WETH", "ETH"),
      toTokenSymbol: rawPair.token1.symbol.replace("WETH", "ETH"),
      liquidity: rawPair.reserveUSD,
      volume24h: rawPair.oneDayVolume,
      volume7d: rawPair.sevenDayVolume,
      fees24h: rawPair.oneDayFees,
      fees7d: rawPair.sevenDayVolume * 0.003,
      feesYearly: rawPair.oneYearFees,
    }
  });
  return (
    <div className={'pr-100px'}>
      <Table
        columns={columns}
        data={tableData}
        loading={false}
        virtualized={true}
        rowHeight={54}
        // onClickRow={handleRowClick}
        // onScrollEnd={loadMore}
        noContentMessage={'No Pairs'}
      />
    </div>
  )
}

export default PairsPage
