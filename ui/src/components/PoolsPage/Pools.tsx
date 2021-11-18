import { Table } from "../index"
import { Column } from "react-table";
import {useMemo} from "react";

import { POOL_COLUMNS } from "./config";

interface TablePoolModel {
  baseSymbol: string;
  quoteSymbol: string;
  quoteName: string;
  volume24h: number;
  rewards: number;
  ROI: number;
  baseSupply: number;
  quoteSupply: number;
  totalLocked: number;
}

const poolList: TablePoolModel[] = [
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  },
  {
    baseSymbol: 'BTC',
    quoteSymbol: 'ETH',
    quoteName: 'Ethereum',
    volume24h: 324123343.93,
    rewards: 0.93,
    ROI: 123,
    baseSupply: 4123343,
    quoteSupply: 123123.123,
    totalLocked: 324123343.93
  }
]

const Pools: React.FC = ({}) => {
  const columns: Column[] = useMemo(() => POOL_COLUMNS, []);

  return (
    <div className={'pr-100px'}>
      <Table
        columns={columns}
        data={poolList}
        loading={false}
        virtualized={true}
        rowHeight={54}
        // onClickRow={handleRowClick}
        // onScrollEnd={loadMore}
        noContentMessage={'No Tokens'}
      />
    </div>
  )
}

export default Pools
