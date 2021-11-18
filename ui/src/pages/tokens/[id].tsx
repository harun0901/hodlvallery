import { Table } from "../../components"
import { Column } from "react-table";
import {useMemo, useState} from "react";
import TokenInfo from "../../components/Analytics/tokenInfo";
import LiquidityGraphic from "../../components/Analytics/LiquidityGraphic";
import VolumeGraphic from "../../components/Analytics/VolumeGraphic";
import FieldInfo from "../../components/Analytics/fieldInfo";
import styles from "./tokens.module.scss";
import {currencyFormatter, getTokenIconFromID} from "../../analytics/core/format";
import { INFORMATION_COLUMNS, PAIR_COLUMNS, TRANSACTION_COLUMNS } from "../../components/Analytics/tokens/config";
import {formatNumber} from "../../functions";
import {useRouter} from "next/router";
import { useQuery } from "@apollo/client";
import { tokenQuery } from "../../analytics/core/queries/exchange";
import { ethPriceQuery } from "../../analytics/core/queries/exchange";
import { oneDayEthPriceQuery } from "../../analytics/core/queries/exchange";
import { useInterval } from "../../analytics/core/hooks";
import { getOneDayEthPrice } from "../../analytics/core/api";
import { tokenDayDatasQuery } from "../../analytics/core/queries/exchange";
import { tokenPairsQuery } from "../../analytics/core/queries/exchange";
import {transactionsQuery } from "../../analytics/core/queries/exchange";
import {getToken } from '../../analytics/core/api/exchange'
import { getApollo } from "../../analytics/core/apollo";
import { getTokenPairs } from "../../analytics/core/api";
import formatDistance from "date-fns/formatDistance";
import Layout from "../../layouts";
import Head from "next/head";


const Tokens: React.FC = ({}) => {
    const router = useRouter();
    const { id } = router.query;

    const informationColumns: Column[] = useMemo(() => INFORMATION_COLUMNS, []);
    const pairColumns: Column[] = useMemo(() => PAIR_COLUMNS, []);
    const transactionColumns: Column[] = useMemo(() => TRANSACTION_COLUMNS, []);

    const [pairPage, setPairPage] = useState(0);
    const [pairPageSize, setPairPageSize] = useState(10);
    const [fakePairLoading, setFakePairLoading] = useState(false);

    const [transactionPage, setTransactionPage] = useState(0);
    const [transactionPageSize, setTransactionPageSize] = useState(10);
    const [fakeTransactionLoading, setFakeTransactionLoading] = useState(false);

    const now = new Date();

    const {
        data: { token },
    } = useQuery(tokenQuery, {
        variables: { id },
    });

    const {
        data: { bundles },
    } = useQuery(ethPriceQuery, {
        pollInterval: 60000,
    });



    const { data: oneDayEthPriceData } = useQuery(oneDayEthPriceQuery);

    useInterval(async () => {
        await getToken(id);
        await getOneDayEthPrice();
    }, 60000);

    const {
        data: { tokenDayDatas },
    } = useQuery(tokenDayDatasQuery, {
        variables: {
            tokens: [id],
        },
        pollInterval: 60000,
    });

    const {
        data: { pairs0, pairs1 },
    } = useQuery(tokenPairsQuery, {
        variables: { id },
    });

    const pairs = [...pairs0, ...pairs1].map((pair)=>{

        // const volumeUSD = pair?.volumeUSD === "0" ? pair?.untrackedVolumeUSD : pair?.volumeUSD
        // const oneDayVolumeUSD = pair?.oneDay?.volumeUSD === "0" ? pair?.oneDay?.untrackedVolumeUSD : pair?.oneDay?.volumeUSD
        // const twoDayVolumeUSD = pair?.twoDay?.volumeUSD === "0" ? pair?.twoDay?.untrackedVolumeUSD : pair?.twoDay?.volumeUSD

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
            displayName: `${pair.token0.symbol.replace(
                "WETH",
                "ETH"
            )}-${pair.token1.symbol.replace("WETH", "ETH")}`,
            oneDayVolume: !Number.isNaN(oneDayVolume) ? oneDayVolume : 0,
            sevenDayVolume: !Number.isNaN(sevenDayVolume) ? sevenDayVolume : 0,
            oneDayFees: !Number.isNaN(oneDayFees) ? oneDayFees : 0,
            oneYearFees,
        };
    })
        .map((pair)=>{
            return {
                ...pair,
                firstToken: {
                    name: pair?.token0?.name,
                    symbol:  pair?.token0?.symbol.replace("WETH", "ETH"),
                    price: 5182,
                    icon: getTokenIconFromID(pair?.token0?.id),
                    balance: 6698,
                    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
                },
                secondToken: {
                    name: pair?.token1?.name,
                    symbol:  pair?.token1?.symbol.replace("WETH", "ETH"),
                    price: 5182,
                    icon: getTokenIconFromID(pair?.token1?.id),
                    balance: 6698,
                    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
                },
                liquidity: pair.reserveUSD,
                volume24h: pair.oneDayVolume,
                volume7d: pair.sevenDayVolume,
                fees24h: pair.oneDayFees,
                fees7h: pair.sevenDayVolume * 0.003,
                feesYearly: pair.oneYearFees,
            }
        });

    const { data: transactions } = useQuery(transactionsQuery, {
        variables: {
            pairAddresses: pairs.map((pair) => pair.id).sort(),
        },
        pollInterval: 60000,
    });

    const chartDatas = tokenDayDatas.reduce(
        (previousValue, currentValue) => {
            previousValue["liquidity"].unshift({
                date: currentValue.date,
                value: parseFloat(currentValue.liquidityUSD),

                name: currentValue.date,
                pv: parseFloat(currentValue.liquidityUSD),
            });
            previousValue["volume"].unshift({
                date: currentValue.date,
                value: parseFloat(currentValue.volumeUSD),

                name: currentValue.date,
                pv: parseFloat(currentValue.volumeUSD),
                uv: parseFloat(currentValue.volumeUSD),
            });
            return previousValue;
        },
        { liquidity: [], volume: [] }
    );
    const totalLiquidityUSD =
        parseFloat(token?.liquidity) *
        parseFloat(token?.derivedETH) *
        parseFloat(bundles[0].ethPrice);

    const totalLiquidityUSDYesterday =
        parseFloat(token.oneDay?.liquidity) *
        parseFloat(token.oneDay?.derivedETH) *
        parseFloat(oneDayEthPriceData?.ethPrice);

    const price = parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

    const priceYesterday =
        parseFloat(token.oneDay?.derivedETH) *
        parseFloat(oneDayEthPriceData?.ethPrice);

    const priceChange = ((price - priceYesterday) / priceYesterday) * 100;

    const volume = token?.volumeUSD - token?.oneDay?.volumeUSD;
    const volumeYesterday = token?.oneDay?.volumeUSD - token?.twoDay?.volumeUSD;

    const txCount = token?.txCount - token?.oneDay?.txCount;
    const txCountYesterday = token?.oneDay?.txCount - token?.twoDay?.txCount;

    const fees = volume * 0.003;
    const feesYesterday = volumeYesterday * 0.003;

    const firstTokenIcon = getTokenIconFromID({id: token?.id})

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

    return (
      <>
          <Head>
              <title>HODL Valley - Analytics Token {`${token.name} (${token.symbol})`}</title>
          </Head>
          <Layout.Analytics tokens>
              <div className={'pr-78px pl-8px'}>
                  <div className={'mt-20px flex justify-between items-center'}>
                      <TokenInfo firstIconUrl={firstTokenIcon} text={`${token.name} (${token.symbol})`}>
                          <p className={'font-medium text-32px text-greay-800 tracking-normal pl-18px'}>{currencyFormatter.format(price || 0)}</p>
                          <p className={'font-medium text-xl text-green-200 tracking-normal pl-20px'}>{priceChange}</p>
                      </TokenInfo>
                      <div className={'flex justify-end items-center'}>
                          <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer mr-31px'}>Add Liquidity</p>
                          <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer'}>Trade</p>
                      </div>
                  </div>
                  <div className={'mt-52px mb-58px flex items-top justify-between'}>
                      <div className={`${styles.graphicFormWrapper}`}>
                          {chartDatas?.liquidity?.length > 1 ? <LiquidityGraphic data={chartDatas.liquidity} />: null}
                      </div>
                      <div className={`${styles.graphicFormWrapper}`}>
                          {chartDatas?.volume?.length > 1 ? <VolumeGraphic data={chartDatas.volume} />: null}
                      </div>
                  </div>
                  <div className={'flex justify-between'}>
                      <div className={styles.fieldInfoWrapper}>
                          <FieldInfo title={'Liquidity (24h)'} value={`$${formatNumber(totalLiquidityUSD || 0)}`} percent={
                              ((totalLiquidityUSD - totalLiquidityUSDYesterday) /
                                totalLiquidityUSDYesterday) *
                              100
                          } />
                      </div>
                      <div className={styles.fieldInfoWrapper}>
                          <FieldInfo title={'Volume (24h)'} value={`$${formatNumber(volume || 0)}`} percent={((volume - volumeYesterday) / volumeYesterday) * 100} />
                      </div>
                      <div className={styles.fieldInfoWrapper}>
                          <FieldInfo title={'Fees (24h)'} value={`$${formatNumber(fees)}`} percent={((fees - feesYesterday) / feesYesterday) * 100} />
                      </div>
                  </div>
                  <h4 className={`${styles.title} mt-65px mb-20px`}>Information</h4>
                  <Table
                    columns={informationColumns}
                    data={[{
                        name: token.name,
                        symbol: token.symbol,
                        address: token.id
                    }]}
                    loading={false}
                    virtualized={true}
                    rowHeight={54}
                    noContentMessage={'No Information'}
                  />
                  <h4 className={`${styles.title} mt-65px mb-20px`}>Pairs</h4>
                  <Table
                    columns={pairColumns}
                    data={pairs}
                    loading={fakePairLoading}
                    virtualized={true}
                    rowHeight={54}
                    height={380}
                    noContentMessage={'No Information'}
                    paginationConfig={{
                        currentPage: pairPage,
                        defaultPageSize: 10,
                        totalCount: pairs.length,
                        onChangePageSize: (val) => {
                            setPairPageSize(isNaN(Number(val)) ? pairs.length : Number(val))
                            setPairPage(0);
                        }
                    }}
                    onScrollEnd={() => {
                        if (pairPage * pairPageSize < pairs.length) {
                            setFakePairLoading(true);
                            setPairPage(pairPage + 1);
                            setTimeout(() => {
                                setFakePairLoading(false);
                            }, 1000);
                        }
                    }}
                  />
                  <h4 className={`${styles.title} mt-65px mb-20px`}>transactions</h4>
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

    const id = params.id.toLowerCase();

    await client.query({
        query: ethPriceQuery,
    });

    await getToken(id, client);

    await client.query({
        query: tokenDayDatasQuery,
        variables: {
            tokens: [id],
        },
    });

    const { pairs0, pairs1 } = await getTokenPairs(id, client);

    const pairAddresses = [
        ...pairs0.map((pair) => pair.id),
        ...pairs1.map((pair) => pair.id),
    ].sort();

    // Transactions
    await client.query({
        query: transactionsQuery,
        variables: {
            pairAddresses,
        },
    });

    await getOneDayEthPrice(client);

    return {
        props: {
            initialApolloState: client.cache.extract(),
        },
        revalidate: 1,
    };
}

export async function getStaticPaths() {
    // Call an external API endpoint to get posts
    // const apollo = getApollo();

    // const { data } = await apollo.query({
    //   query: tokenIdsQuery,
    // });

    // const paths = data.tokens.map(({ id }) => ({
    //   params: { id },
    // }));

    return { paths: [], fallback: true };
}
export default Tokens
