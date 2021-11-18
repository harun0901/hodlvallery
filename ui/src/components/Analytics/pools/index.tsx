import { Table } from "../../index"
import { Column } from "react-table";
import { formatDecimal } from "../../../analytics/core/format";
import {useMemo} from "react";

import { POOL_COLUMNS } from "./config";
import {useQuery} from "@apollo/client";
import {poolsQuery} from "../../../analytics/core/queries/masterchef";
import {getPools} from "../../../analytics/core/api/masterchef";
import {useInterval} from "../../../analytics/core/hooks";

interface TablePoolModel {
  baseSymbol: string;
  quoteSymbol: string;
  quoteName: string;
  rewards: string;
  ROI: string;
  baseSupply: string;
  quoteSupply: string;
  totalLocked: string;
}


interface PoolsProps {
}

const PoolsPage: React.FC<PoolsProps> = () => {
  const { data } = useQuery(poolsQuery, {
    context: {
      clientName: "masterchef",
    },
  });

  useInterval(
    () =>
      Promise.all([
        getPools
      ]),
    60000
  );

  const pools = useMemo(() => data?.pools || [], [data]);

  const columns: Column[] = useMemo(() => POOL_COLUMNS, []);

  const tableData: TablePoolModel[] = useMemo(() => {
    return pools.map((row) => {
      return {
        ...row,
        baseSymbol: row.liquidityPair?.token0?.symbol,
        quoteSymbol: row.liquidityPair?.token1?.symbol,
        quoteName: row.liquidityPair?.token1?.name,
        rewards: Number(row.rewardPerThousand).toFixed(2),
        ROI: Number(row.roiPerDay * 100).toFixed(2),
        baseSupply: formatDecimal(row.liquidityPair?.reserve0),
        quoteSupply: formatDecimal(row.liquidityPair?.reserve1),
        totalLocked: row.tvl
      }
    });
  }, [pools])

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
        noContentMessage={'No Pools'}
      />
    </div>
  )
}

export default PoolsPage;
