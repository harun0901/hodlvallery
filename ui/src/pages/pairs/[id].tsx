/* eslint-disable jsx-a11y/alt-text */
import { Table } from "../../components"
import { Column } from "react-table";
import {useMemo, useState} from "react";
import TokenInfo from "../../components/Analytics/tokenInfo";
import LiquidityGraphic from "../../components/Analytics/LiquidityGraphic";
import VolumeGraphic from "../../components/Analytics/VolumeGraphic";
import FieldInfo from "../../components/Analytics/fieldInfo";
import styles from "./pairs.module.scss";
import { INFORMATION_COLUMNS, TRANSACTION_COLUMNS } from "../../components/Analytics/pairs/config";
import Image from "next/image";
import {formatNumber} from "../../functions";
import { getApollo } from "../../analytics/core/apollo";
import {formatCurrency, getTokenIconFromID} from "../../analytics/core/format";
import { formatDecimal } from "../../analytics/core/format";
import { shortenAddress } from "../../analytics/core/format";
import { ethPriceQuery } from "../../analytics/core/queries/exchange";
import { pairQuery } from "../../analytics/core/queries/exchange";
import { transactionsQuery } from "../../analytics/core/queries/exchange";
import { pairDayDatasQuery } from "../../analytics/core/queries/exchange";
import {getPair} from '../../analytics/core/api'
import IntoTheBlock from "../../components/Pairs/IntoTheBlock";
import {useRouter} from "next/router";
import { useQuery } from "@apollo/client";
import { useInterval } from "../../analytics/core/hooks";
import formatDistance from "date-fns/formatDistance";
import Head from "next/head";
import Layout from "../../layouts";


const Pairs: React.FC = ({}) => {
    const router = useRouter();

    const { id } = router.query;

    const {
        data: { bundles },
    } = useQuery(ethPriceQuery, {
        pollInterval: 60000,
    });


    const {
        data: { pair },
    } = useQuery(pairQuery, {
        query: pairQuery,
        variables: { id },
    });

    useInterval(async () => {
        await getPair(id);
    }, 60000);

    const { data: transactions } = useQuery(transactionsQuery, {
        variables: { pairAddresses: [id] },
        pollInterval: 60000,
    });

    const {
        data: { pairDayDatas },
    } = useQuery(pairDayDatasQuery, {
        variables: {
            pairs: [id],
        },
        pollInterval: 60000,
    });

    const volumeUSD =
        pair?.volumeUSD === "0" ? pair?.untrackedVolumeUSD : pair?.volumeUSD;

    const oneDayVolumeUSD =
        pair?.oneDay?.volumeUSD === "0"
            ? pair?.oneDay?.untrackedVolumeUSD
            : pair?.oneDay?.volumeUSD;

    const twoDayVolumeUSD =
        pair?.twoDay?.volumeUSD === "0"
            ? pair?.twoDay?.untrackedVolumeUSD
            : pair?.twoDay?.volumeUSD;

    const volume = volumeUSD - oneDayVolumeUSD;

    const volumeYesterday = oneDayVolumeUSD - twoDayVolumeUSD;

    const volumeChange = ((volume - volumeYesterday) / volumeYesterday) * 100;

    const fees = volume * 0.003;

    const feesYesterday = volumeYesterday * 0.003;

    const avgTradePrice = volume / (pair?.txCount - pair?.oneDay?.txCount);

    const avgTradePriceYesturday =
        volumeYesterday / (pair?.oneDay?.txCount - pair?.twoDay?.txCount);

    const avgTradePriceChange =
        ((avgTradePrice - avgTradePriceYesturday) / avgTradePriceYesturday) * 100;

    const utilisation = (volume / pair.reserveUSD) * 100;

    const utilisationYesterday = (volumeYesterday / pair.oneDay.reserveUSD) * 100;

    const utilisationChange =
        ((utilisation - utilisationYesterday) / utilisationYesterday) * 100;

    const tx = pair.txCount - pair.oneDay.txCount;

    const txYesterday = pair.oneDay.txCount - pair.twoDay.txCount;

    const txChange = ((tx - txYesterday) / txYesterday) * 100;

    const chartDatas = pairDayDatas.reduce(
        (previousValue, currentValue) => {
            const untrackedVolumeUSD =
                currentValue?.token0.derivedETH * currentValue?.volumeToken0 +
                currentValue?.token1.derivedETH *
                currentValue?.volumeToken1 *
                bundles[0].ethPrice;

            const volumeUSD =
                currentValue?.volumeUSD === "0"
                    ? untrackedVolumeUSD
                    : currentValue?.volumeUSD;

            previousValue["liquidity"].unshift({
                date: currentValue.date,
                value: parseFloat(currentValue.reserveUSD),

                name: currentValue.date,
                pv: parseFloat(currentValue.reserveUSD),
            });
            previousValue["volume"].unshift({
                date: currentValue.date,
                value: parseFloat(volumeUSD),

                name: currentValue.date,
                pv: parseFloat(volumeUSD),
                uv: parseFloat(volumeUSD),
            });
            return previousValue;
        },
        { liquidity: [], volume: [] }
    );



    const firstTokenIcon = useMemo(()=> getTokenIconFromID({id: pair?.token0?.id}), [])
    const secondTokenIcon = useMemo(()=> getTokenIconFromID({id: pair?.token1?.id}), [])


    const informationColumns: Column[] = useMemo(() => INFORMATION_COLUMNS, []);
    const transactionColumns: Column[] = useMemo(() => TRANSACTION_COLUMNS, []);
    const now = new Date();
    let rows = []
    if (transactions?.swaps) {
        rows = rows.concat(...transactions.swaps)
    }
    if (transactions?.mints) {
        rows = rows.concat(...transactions.mints)
    }
    if (transactions?.burns) {
        rows = rows.concat(...transactions.burns)
    }
    rows = rows.map((transaction) => {
        if (transaction.__typename === "Swap") {
            return {
                ...transaction,
                amount0:
                    transaction.amount0In === "0"
                        ? transaction.amount1In
                        : transaction.amount0In,
                amount1:
                    transaction.amount1Out === "0"
                        ? transaction.amount0Out
                        : transaction.amount1Out,
            };
        }

        return transaction;
    }).map((row)=>{
        return {
            ...row,
            type: row.__typename,
            fromToken: {
                symbol: row?.pair?.token0?.symbol,
            },
            toToken: {
                symbol: row?.pair?.token1?.symbol,
            },
            value: row.amountUSD,
            in: row.amount0,
            out: row.amount1,
            hash: row.to,
            timestamp:     `${formatDistance(now, new Date(row.timestamp * 1000))} ago`
        }
    });
    const [transactionPage, setTransactionPage] = useState(0);
    const [transactionPageSize, setTransactionPageSize] = useState(10);
    const [fakeTransactionLoading, setFakeTransactionLoading] = useState(false);



    if (router.isFallback) {
        return <h1>Loading...</h1>;
    }

    return (
      <>
        <Head>
          <title>HODL Valley - Analytics Pair {`${pair.token0.symbol}-${pair.token1.symbol}`}</title>
        </Head>
        <Layout.Analytics pairs>
            <div className={'pr-78px pl-8px'}>
                <div className={'mt-20px flex justify-between items-center'}>
                    <TokenInfo firstIconUrl={firstTokenIcon} secondIconUrl={secondTokenIcon} text={`${pair.token0.symbol}-${pair.token1.symbol}`} />
                    <div className={'flex justify-end items-center'}>
                        <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer mr-31px'}>Add Liquidity</p>
                        <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer'}>Trade</p>
                    </div>
                </div>
                <div className={'mt-60px mb-40px flex items-top justify-between'}>
                    <div className={`${styles.tokenWrapper}`}>
                        <div className={'w-1/12 flex justify-start items-center'}>
                            <Image src={firstTokenIcon} width={40} height={40}/>
                        </div>
                        <div className={'w-11/12 flex flex-col justify-center pl-8px pt-6px'}>
                            <div className={'flex items-end'}>
                                <p className={'font-bold text-3xl text-gray-400 leading-8'}>{formatDecimal(pair.reserve0)}</p>
                                <span className={'font-bold text-sm text-gray-400 pl-5px'}>{pair.token0.symbol}</span>
                            </div>
                            <p className={'font-medium text-sm text-gray-150 uppercase mt-2px'}>{`1 ${pair.token0.symbol} = ${formatDecimal(pair.reserve1 / pair.reserve0)} ${pair.token1.symbol} (${formatCurrency(pair.token0?.derivedETH * bundles[0].ethPrice)})`}</p>
                        </div>
                    </div>
                    <div className={`${styles.tokenWrapper}`}>
                        <div className={'w-1/12 flex justify-start items-center'}>
                            <Image src={secondTokenIcon} width={40} height={40}/>
                        </div>
                        <div className={'w-11/12 flex flex-col justify-center pl-8px pt-6px'}>
                            <div className={'flex items-end'}>
                                <p className={'font-bold text-3xl text-gray-400 leading-8'}>{formatNumber(pair.reserve1)}</p>
                                <span className={'font-bold text-sm text-gray-400 pl-5px'}>{pair.token1.symbol}</span>
                            </div>
                            <p className={'font-medium text-sm text-gray-150 uppercase mt-2px'}>
                                {`1 ${pair.token1.symbol} = ${formatDecimal(pair.reserve0 / pair.reserve1)} ${pair.token0.symbol} (${formatCurrency(pair.token1?.derivedETH * bundles[0].ethPrice)})`}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={'mb-48px flex items-top justify-between'}>
                    {chartDatas?.liquidity?.length > 1 ? <div className={`${styles.graphicFormWrapper}`}>
                        <LiquidityGraphic
                          data={chartDatas.liquidity}
                        />
                    </div>: null}
                    {chartDatas?.volume?.length > 1 ? <div className={`${styles.graphicFormWrapper}`}>
                        <VolumeGraphic data={chartDatas.volume} />
                    </div>: null}
                </div>
                <div className={'flex justify-between mb-36px'}>
                    <div className={styles.fieldInfoWrapper}>
                        <FieldInfo title={'Liquidity (24h)'} value={`$${formatNumber(pair?.reserveUSD)}`} percent={
                            ((pair?.reserveUSD - pair?.oneDay?.reserveUSD) /
                              pair?.oneDay?.reserveUSD) *
                            100
                        } />
                    </div>
                    <div className={styles.fieldInfoWrapper}>
                        <FieldInfo title={'Volume (24h)'} value={`$${formatNumber(volume)}`} percent={volumeChange} />
                    </div>
                    <div className={styles.fieldInfoWrapper}>
                        <FieldInfo title={'Fees (24h)'} value={`$${formatNumber(fees)}`} percent={((fees - feesYesterday) / feesYesterday) * 100} />
                    </div>
                </div>
                <div className={'flex justify-between'}>
                    <div className={styles.fieldInfoWrapper}>
                        <FieldInfo title={'Tx (24h)'} value={`${formatNumber(tx)}`} percent={txChange} />
                    </div>
                    <div className={styles.fieldInfoWrapper}>
                        <FieldInfo title={'Avg. Trade (24h)'} value={`$${formatNumber(avgTradePrice)}`} percent={avgTradePriceChange} />
                    </div>
                    <div className={styles.fieldInfoWrapper}>
                        <FieldInfo title={'UtiliZation (24h)'} value={`${formatNumber(utilisation)}%`} percent={utilisationChange} />
                    </div>
                </div>
                <h4 className={`${styles.title} mt-71px mb-20px`}>Information</h4>
                <Table
                  columns={informationColumns}
                  data={[{
                      contractAddress: shortenAddress(pair.id),
                      firstTokenAddress: shortenAddress(pair.token0.id),
                      secondTokenAddress: shortenAddress(pair.token1.id),
                      link: `https://etherscan.io/address/${pair.id}`
                  }]}
                  loading={false}
                  virtualized={true}
                  rowHeight={54}
                  noContentMessage={'No Information'}
                />
                <h4 className={`${styles.title} mt-71px`}>Analytics</h4>
                <IntoTheBlock  pairAddress={pair.id}/>
                <h4 className={`${styles.title} mt-76px mb-20px`}>transactions</h4>
                <Table
                  columns={transactionColumns}
                  data={rows}
                  loading={fakeTransactionLoading}
                  virtualized={true}
                  rowHeight={54}
                  height={380}
                  noContentMessage={'No Information'}
                  paginationConfig={{
                      currentPage: transactionPage,
                      defaultPageSize: 10,
                      totalCount: transactions.length,
                      onChangePageSize: (val) => {
                          setTransactionPageSize(isNaN(Number(val)) ? transactions.length : Number(val))
                          setTransactionPage(0);
                      }
                  }}
                  onScrollEnd={() => {
                      if (transactionPage * transactionPageSize < transactions.length) {
                          setFakeTransactionLoading(true);
                          setTransactionPage(transactionPage + 1);
                          setTimeout(() => {
                              setFakeTransactionLoading(false);
                          }, 1000);
                      }
                  }}
                />
            </div>
        </Layout.Analytics>
      </>
    )
}


export async function getStaticProps({ params }) {
    const client = getApollo();

    const id = params.id.toLowerCase()

    // EthPrice
    await client.query({
        query: ethPriceQuery,
    });

    await getPair(id, client);

    await client.query({
        query: pairDayDatasQuery,
        variables: {
            pairs: [id],
        },
    });

    await client.query({
        query: transactionsQuery,
        variables: {
            pairAddresses: [id],
        },
    });

    return {
        props: {
            initialApolloState: client.cache.extract(),
        },
        revalidate: 1,
    };
}

export async function getStaticPaths() {
    // const apollo = getApollo();

    // const { data } = await apollo.query({
    //   query: pairIdsQuery,
    // });

    // const paths = data.pairs.map((pair) => ({
    //   params: { id: pair.id },
    // }));

    return { paths: [], fallback: true };
}

export default Pairs
