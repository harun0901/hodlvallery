import { Table } from "../../index"
import { Column } from "react-table";
import {useMemo} from "react";
import { TOKEN_DENY } from "../../../analytics/core/constants";
import {ethPriceQuery, tokensQuery} from "../../../analytics/core/queries/exchange";
import { useQuery } from "@apollo/client";
import { oneDayEthPriceQuery } from "../../../analytics/core/queries/exchange";
import { sevenDayEthPriceQuery } from "../../../analytics/core/queries/exchange";
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

interface TokensProps {
}
const TokensPage: React.FC<TokensProps> = () => {
  const { data } = useQuery(tokensQuery);

  const tokens = useMemo(() => data?.tokens || [], [data]);

  const columns: Column[] = useMemo(() => TOKEN_COLUMNS, []);

  const {
    data: { bundles },
  } = useQuery(ethPriceQuery, {
    pollInterval: 60000,
  });
  const { data: oneDayEthPriceData } = useQuery(oneDayEthPriceQuery);

  const { data: sevenDayEthPriceData } = useQuery(sevenDayEthPriceQuery);

  const tableData: TableTokenModel[] = tokens
      .filter(({ id }) => {
        return !TOKEN_DENY.includes(id);
      })
      .map((token)=>{
        const price =
            parseFloat(token.derivedETH) * parseFloat(bundles[0]?.ethPrice);

        const priceYesterday =
            parseFloat(token.oneDay?.derivedETH) *
            parseFloat(oneDayEthPriceData?.ethPrice);

        const priceChange = ((price - priceYesterday) / priceYesterday) * 100;

        const priceLastWeek =
            parseFloat(token.sevenDay?.derivedETH) *
            parseFloat(sevenDayEthPriceData?.ethPrice);

        const sevenDayPriceChange =
            ((price - priceLastWeek) / priceLastWeek) * 100;

        const liquidityUSD =
            parseFloat(token?.liquidity) *
            parseFloat(token?.derivedETH) *
            parseFloat(bundles[0]?.ethPrice);

        const volumeYesterday = token.volumeUSD - token.oneDay?.volumeUSD;

        return {
          ...token,
          price,
          priceYesterday: !Number.isNaN(priceYesterday) ? priceYesterday : 0,
          priceChange,
          liquidityUSD: liquidityUSD || 0,
          volumeYesterday: !Number.isNaN(volumeYesterday) ? volumeYesterday : 0,
          sevenDayPriceChange,
        };
  }).map((row)=>{
    return {
      ...row,
      name: row.name,
      liquidity: row.liquidityUSD,
      volume24h: row.volumeYesterday,
      price: row.price,
      change24h: row.priceChange,
      change7d: row.sevenDayPriceChange,

      symbol: row.symbol,

    }
      })


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
        noContentMessage={'No Tokens'}
      />
    </div>
  )
}

export default TokensPage;
