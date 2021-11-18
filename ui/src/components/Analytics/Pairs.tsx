/* eslint-disable jsx-a11y/alt-text */
import { Table } from "../index"
import { Column } from "react-table";
import {useMemo, useState} from "react";
import TokenInfo from "./tokenInfo";
import LiquidityGraphic from "./LiquidityGraphic";
import VolumeGraphic from "./VolumeGraphic";
import FieldInfo from "./fieldInfo";
import styles from "../../pages/analytics/pairs/pairs.module.scss";
import CompareGraphicProf from "./compareGraphicProf";
import ImpermanentGraphic from "./impermanentGraphic";
import { INFORMATION_COLUMNS, TRANSACTION_COLUMNS } from "./pairs/config";
import Image from "next/image";
import { formatCurrency, formatDecimal } from "../../analytics/core/format";
import { shortenAddress } from "../../analytics/core/format";
import IntoTheBlock from "../Pairs/IntoTheBlock";
import {formatNumber} from "../../functions";

const Pairs: React.FC = ({}) => {
  // const id = '0xceff51756c56ceffca006cd410b03ffc46dd3a58'
  //
  //
  // const firstTokenIcon = useTokenIcon({id: pair?.token0?.id})
  // const secondTokenIcon = useTokenIcon({id: pair?.token1?.id})
  //
  //
  // const informationColumns: Column[] = useMemo(() => INFORMATION_COLUMNS, []);
  // const transactionColumns: Column[] = useMemo(() => TRANSACTION_COLUMNS, []);
  //
  // const [transactionPage, setTransactionPage] = useState(0);
  // const [transactionPageSize, setTransactionPageSize] = useState(10);
  // const [fakeTransactionLoading, setFakeTransactionLoading] = useState(false);

  return  <h1>Pairs Component</h1>

  // return (
  //   <div className={'pr-78px pl-8px'}>
  //     <div className={'mt-20px flex justify-between items-center'}>
  //       <TokenInfo firstIconUrl={firstTokenIcon} secondIconUrl={secondTokenIcon} text={`${pair.token0.symbol}-${pair.token1.symbol}`} />
  //       <div className={'flex justify-end items-center'}>
  //         <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer mr-31px'}>Add Liquidity</p>
  //         <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer'}>Trade</p>
  //       </div>
  //     </div>
  //     <div className={'mt-60px mb-40px flex items-top justify-between'}>
  //       <div className={`${styles.tokenWrapper}`}>
  //         <div className={'w-1/12 flex justify-start items-center'}>
  //           <Image src={firstTokenIcon} width={40} height={40}/>
  //         </div>
  //         <div className={'w-11/12 flex flex-col justify-center pl-8px pt-6px'}>
  //           <div className={'flex items-end'}>
  //             <p className={'font-bold text-3xl text-gray-400 leading-8'}>{formatDecimal(pair.reserve0)}</p>
  //             <span className={'font-bold text-sm text-gray-400 pl-5px'}>{pair.token0.symbol}</span>
  //           </div>
  //           <p className={'font-medium text-sm text-gray-150 uppercase mt-2px'}>{`1 ${pair.token0.symbol} = ${formatDecimal(pair.reserve1 / pair.reserve0)} ${pair.token1.symbol} (${formatCurrency(pair.token0?.derivedETH * bundles[0].ethPrice)})`}</p>
  //         </div>
  //       </div>
  //       <div className={`${styles.tokenWrapper}`}>
  //         <div className={'w-1/12 flex justify-start items-center'}>
  //           <Image src={secondTokenIcon} width={40} height={40}/>
  //         </div>
  //         <div className={'w-11/12 flex flex-col justify-center pl-8px pt-6px'}>
  //           <div className={'flex items-end'}>
  //             <p className={'font-bold text-3xl text-gray-400 leading-8'}>{formatNumber(pair.reserve1)}</p>
  //             <span className={'font-bold text-sm text-gray-400 pl-5px'}>{pair.token1.symbol}</span>
  //           </div>
  //           <p className={'font-medium text-sm text-gray-150 uppercase mt-2px'}>
  //             {`1 ${pair.token1.symbol} = ${formatDecimal(pair.reserve0 / pair.reserve1)} ${pair.token0.symbol} (${formatCurrency(pair.token1?.derivedETH * bundles[0].ethPrice)})`}
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //     <div className={'mb-48px flex items-top justify-between'}>
  //       {chartDatas?.liquidity?.length > 1 ? <div className={`${styles.graphicFormWrapper}`}>
  //         <LiquidityGraphic
  //             data={chartDatas.liquidity}
  //         />
  //       </div>: null}
  //       {chartDatas?.volume?.length > 1 ? <div className={`${styles.graphicFormWrapper}`}>
  //         <VolumeGraphic data={chartDatas.volume} />
  //       </div>: null}
  //     </div>
  //     <div className={'flex justify-between mb-36px'}>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Liquidity (24h)'} value={`$${formatNumber(pair?.reserveUSD)}`} percent={
  //           ((pair?.reserveUSD - pair?.oneDay?.reserveUSD) /
  //               pair?.oneDay?.reserveUSD) *
  //           100
  //         } />
  //       </div>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Volume (24h)'} value={`$${formatNumber(volume)}`} percent={volumeChange} />
  //       </div>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Fees (24h)'} value={`$${formatNumber(fees)}`} percent={((fees - feesYesterday) / feesYesterday) * 100} />
  //       </div>
  //     </div>
  //     <div className={'flex justify-between'}>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Tx (24h)'} value={`${formatNumber(tx)}`} percent={txChange} />
  //       </div>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'Avg. Trade (24h)'} value={`$${formatNumber(avgTradePrice)}`} percent={avgTradePriceChange} />
  //       </div>
  //       <div className={styles.fieldInfoWrapper}>
  //         <FieldInfo title={'UtiliZation (24h)'} value={`${formatNumber(utilisation)}%`} percent={utilisationChange} />
  //       </div>
  //     </div>
  //     <h4 className={`${styles.title} mt-71px mb-20px`}>Information</h4>
  //     <Table
  //       columns={informationColumns}
  //       data={[{
  //         contractAddress: shortenAddress(pair.id),
  //         firstTokenAddress: shortenAddress(pair.token0.id),
  //         secondTokenAddress: shortenAddress(pair.token1.id),
  //         link: `https://etherscan.io/address/${pair.id}`
  //       }]}
  //       loading={false}
  //       virtualized={true}
  //       rowHeight={54}
  //       noContentMessage={'No Information'}
  //     />
  //     <h4 className={`${styles.title} mt-71px`}>Analytics</h4>
  //       <IntoTheBlock  pairAddress={pair.id}/>
  //     <div className={'mt-18px'}>
  //       <ImpermanentGraphic />
  //     </div>
  //     <div className={'flex justify-between items-start mt-40px'}>
  //       <div className={styles.compareGraphicFormWrapper}>
  //         <CompareGraphicProf title={'Fees per Liquidity'} dataConfig={[{color: '#FF3434', text: '1-Hour APY'}, {color: '#0062FF', text: '12-hour Average APY'}, {color: '#40B700', text: '12-hour Average APY'}]} />
  //       </div>
  //       <div className={styles.compareGraphicFormWrapper}>
  //         <CompareGraphicProf title={'TRANSACTIONS BREAKDOWN'} dataConfig={[{color: '#FF3434', text: 'SWAP WBTC for ETHC'}, {color: '#0062FF', text: '12-hour Average APY'}]} />
  //       </div>
  //     </div>
  //     <div className={'flex justify-between items-start mt-42px'}>
  //       <div className={styles.compareGraphicFormWrapper}>
  //         <CompareGraphicProf title={'WBTC LIQUIDITY VARIATION'} dataConfig={[{color: '#FF3434', text: 'Added'}, {color: '#0062FF', text: 'Removed'}, {color: '#40B700', text: 'Netflow'}]} allowConvert />
  //       </div>
  //       <div className={styles.compareGraphicFormWrapper}>
  //         <CompareGraphicProf title={'WBTC LIQUIDITY VARIATION'} dataConfig={[{color: '#FF3434', text: 'Added'}, {color: '#0062FF', text: 'Removed'}, {color: '#40B700', text: 'Netflow'}]} allowConvert />
  //       </div>
  //     </div>
  //     <h4 className={`${styles.title} mt-76px mb-20px`}>transactions</h4>
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

export default Pairs
