import { Table } from "../../index"
import { Column } from "react-table";
import {useMemo, useState} from "react";

import { COLUMNS } from "./config";
import {useQuery} from "@apollo/client";
import {gainersQuery, losersQuery} from "../../../analytics/core/queries/pages";
import {useInterval} from "../../../analytics/core/hooks";
import {getGainers, getLosers} from "../../../analytics/core/api/pages";

interface GainerLoserProps {
  gainer?: boolean;
}

const GainerLoser: React.FC<GainerLoserProps> = ({gainer = false}) => {
  const columns: Column[] = useMemo(() => COLUMNS(gainer), [gainer]);

  const [tokenPage, setTokenPage] = useState(0);
  const [tokenPageSize, setTokenPageSize] = useState(10);
  const [fakeTokenLoading, setFakeTokenLoading] = useState(false);

  useInterval(() => {
    !gainer && getLosers();
    gainer && getGainers();
  }, 60000);

  const losersQueryData = useQuery(losersQuery);
  const losersPairs = useMemo(() => {
    return (losersQueryData?.data?.pairs || []).filter((pair) => {
      const negativeFees = Math.sign(pair.feesUSDLost - pair.feesUSDLostYesterday) < 0;
      const negativeReserve = Math.sign(pair.reserveUSDLost) < 0;

      return negativeReserve && negativeFees;
    })
  }, [losersQueryData]);

  const gainersQueryData = useQuery(gainersQuery);
  const gainersPair = useMemo(() => {
    return (gainersQueryData?.data?.pairs || []).filter((pair) => {
      const positiveFees = Math.sign(pair.feesUSDGained - pair.feesUSDGainedYesterday) > 0;
      const positiveReserve = Math.sign(pair.reserveUSDGained) > 0;

      return positiveReserve && positiveFees;
    })
  }, [gainersQueryData]);

  const data = useMemo(() =>
    gainer ? gainersPair || [] : losersPairs || [],
    [gainer, gainersPair, losersPairs]
  )

  return (
    <div className={'pr-78px pl-8px'}>
      <Table
        columns={columns}
        data={data}
        loading={fakeTokenLoading}
        virtualized={true}
        rowHeight={54}
        height={380}
        noContentMessage={'No Information'}
        paginationConfig={{
          currentPage: tokenPage,
          defaultPageSize: 10,
          totalCount: data.length,
          onChangePageSize: (val) => {
            setTokenPageSize(isNaN(Number(val)) ? data.length : Number(val))
            setTokenPage(0);
          }
        }}
        onScrollEnd={() => {
          if (tokenPage * tokenPageSize < data.length) {
            setFakeTokenLoading(true);
            setTokenPage(tokenPage + 1);
            setTimeout(() => {
              setFakeTokenLoading(false);
            }, 1000);
          }
        }}
      />
    </div>
  )
}

export default GainerLoser
