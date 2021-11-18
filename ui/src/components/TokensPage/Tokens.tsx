import { Table } from "../index"
import { Column } from "react-table";
import {useMemo} from "react";

import { TOKEN_COLUMNS } from "./config";

interface TableTokenModel {
  symbol: string;
  name: string;
  liquidity: number;
  volume24h: number;
  price: number;
  change24h: number;
  change7d: number;
}

const pairList: TableTokenModel[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    liquidity: 324123343.93,
    volume24h: 324123343.93,
    price: 1800.20,
    change24h: -9.86,
    change7d: 8.93
  }
]

const Tokens: React.FC = ({}) => {
  const columns: Column[] = useMemo(() => TOKEN_COLUMNS, []);

  return (
    <div className={'pr-100px'}>
      <Table
        columns={columns}
        data={pairList}
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

export default Tokens
