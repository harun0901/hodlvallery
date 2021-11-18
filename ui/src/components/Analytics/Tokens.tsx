import { Table } from "../index"
import { Column } from "react-table";
import {useMemo, useState} from "react";
import TokenInfo from "./tokenInfo";
import LiquidityGraphic from "./LiquidityGraphic";
import VolumeGraphic from "./VolumeGraphic";
import FieldInfo from "./fieldInfo";
import styles from "../../pages/analytics/tokens/tokens.module.scss";
import { currencyFormatter } from "../../analytics/core/format";
import { INFORMATION_COLUMNS, PAIR_COLUMNS, TRANSACTION_COLUMNS } from "./tokens/config";
import {formatNumber} from "../../functions";

const Tokens: React.FC = ({}) => {
    return  <h1>Tokens Component</h1>
  // const informationColumns: Column[] = useMemo(() => INFORMATION_COLUMNS, []);
  // const pairColumns: Column[] = useMemo(() => PAIR_COLUMNS, []);
  // const transactionColumns: Column[] = useMemo(() => TRANSACTION_COLUMNS, []);
  //
  // const [pairPage, setPairPage] = useState(0);
  // const [pairPageSize, setPairPageSize] = useState(10);
  // const [fakePairLoading, setFakePairLoading] = useState(false);
  //
  // const [transactionPage, setTransactionPage] = useState(0);
  // const [transactionPageSize, setTransactionPageSize] = useState(10);
  // const [fakeTransactionLoading, setFakeTransactionLoading] = useState(false);
  //   const id = '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2';
  //
  //   const  {data, errorMessage, loading} = useGetToken({id});
  //
  //   const {chartDatas, token, price, priceChange, totalLiquidityUSD,
  //       totalLiquidityUSDYesterday,
  //       volume,
  //       volumeYesterday,
  //       fees,
  //       feesYesterday,
  //       pairs,
  //       transactions
  //   } = data
  //
  //   const firstTokenIcon = useTokenIcon({id: token?.id})
  //
  //   if (errorMessage) {
  //       return  <h1>{errorMessage}</h1>
  //   }
  //   if (loading) {
  //       return  <h1>Loading...</h1>
  //   }
  // return (
  //   <div className={'pr-78px pl-8px'}>
  //     <div className={'mt-20px flex justify-between items-center'}>
  //       <TokenInfo firstIconUrl={firstTokenIcon} text={`${token.name} (${token.symbol})`}>
  //         <p className={'font-medium text-32px text-greay-800 tracking-normal pl-18px'}>{currencyFormatter.format(price || 0)}</p>
  //         <p className={'font-medium text-xl text-green-200 tracking-normal pl-20px'}>{priceChange}</p>
  //       </TokenInfo>
  //       <div className={'flex justify-end items-center'}>
  //         <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer mr-31px'}>Add Liquidity</p>
  //         <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer'}>Trade</p>
  //       </div>
  //     </div>
  //     <div className={'mt-52px mb-58px flex items-top justify-between'}>
  //       <div className={`${styles.graphicFormWrapper}`}>
  //           {chartDatas?.liquidity?.length > 1 ? <LiquidityGraphic data={chartDatas.liquidity} />: null}
  //       </div>
  //       <div className={`${styles.graphicFormWrapper}`}>
  //           {chartDatas?.volume?.length > 1 ? <VolumeGraphic data={chartDatas.volume} />: null}
  //       </div>
  //     </div>
  //     <div className={'flex justify-between'}>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Liquidity (24h)'} value={`$${formatNumber(totalLiquidityUSD || 0)}`} percent={
  //             ((totalLiquidityUSD - totalLiquidityUSDYesterday) /
  //                 totalLiquidityUSDYesterday) *
  //             100
  //         } />
  //       </div>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Volume (24h)'} value={`$${formatNumber(volume || 0)}`} percent={((volume - volumeYesterday) / volumeYesterday) * 100} />
  //       </div>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Fees (24h)'} value={`$${formatNumber(fees)}`} percent={((fees - feesYesterday) / feesYesterday) * 100} />
  //       </div>
  //     </div>
  //     <h4 className={`${styles.title} mt-65px mb-20px`}>Information</h4>
  //     <Table
  //       columns={informationColumns}
  //       data={[{
  //           name: token.name,
  //           symbol: token.symbol,
  //           address: token.id
  //       }]}
  //       loading={false}
  //       virtualized={true}
  //       rowHeight={54}
  //       noContentMessage={'No Information'}
  //     />
  //     <h4 className={`${styles.title} mt-65px mb-20px`}>Pairs</h4>
  //     <Table
  //       columns={pairColumns}
  //       data={pairs}
  //       loading={fakePairLoading}
  //       virtualized={true}
  //       rowHeight={54}
  //       height={380}
  //       noContentMessage={'No Information'}
  //       paginationConfig={{
  //         currentPage: pairPage,
  //         defaultPageSize: 10,
  //         totalCount: pairs.length,
  //         onChangePageSize: (val) => {
  //           setPairPageSize(isNaN(Number(val)) ? pairs.length : Number(val))
  //           setPairPage(0);
  //         }
  //       }}
  //       onScrollEnd={() => {
  //         if (pairPage * pairPageSize < pairs.length) {
  //           setFakePairLoading(true);
  //           setPairPage(pairPage + 1);
  //           setTimeout(() => {
  //             setFakePairLoading(false);
  //           }, 1000);
  //         }
  //       }}
  //     />
  //     <h4 className={`${styles.title} mt-65px mb-20px`}>transactions</h4>
  //     <Table
  //       columns={transactionColumns}
  //       data={transactions}
  //       loading={fakeTransactionLoading}
  //       virtualized={true}
  //       rowHeight={54}
  //       height={380}
  //       noContentMessage={'No Information'}
  //       paginationConfig={{
  //         currentPage: transactionPage,
  //         defaultPageSize: 10,
  //         totalCount: transactions.length,
  //         onChangePageSize: (val) => {
  //           setTransactionPageSize(isNaN(Number(val)) ? transactions.length : Number(val))
  //           setTransactionPage(0);
  //         }
  //       }}
  //       onScrollEnd={() => {
  //         if (transactionPage * transactionPageSize < transactions.length) {
  //           setFakeTransactionLoading(true);
  //           setTransactionPage(transactionPage + 1);
  //           setTimeout(() => {
  //             setFakeTransactionLoading(false);
  //           }, 1000);
  //         }
  //       }}
  //     />
  //   </div>
  // )
}

export default Tokens
