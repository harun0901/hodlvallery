import { Table } from "../../components"
import { Column } from "react-table";
import {useMemo, useState} from "react";
import TokenInfo from "../../components/Analytics/tokenInfo";
import FieldInfo from "../../components/Analytics/fieldInfo";
import CompareGraphic from "../../components/Analytics/compareGraphic";
import styles from "./pools.module.scss";
import {poolHistoryQuery  } from "../../analytics/core/queries/masterchef";
import { getApollo } from "../../analytics/core/apollo";
import { poolQuery } from "../../analytics/core/queries/masterchef";
import { tokenQuery } from "../../analytics/core/queries/exchange";
import { ethPriceQuery } from "../../analytics/core/queries/exchange";
import { getEthPrice } from '../../analytics/core/api'
import {getSushiToken} from '../../analytics/core/api/exchange'
import {getPool, getPoolHistories} from '../../analytics/core/api/masterchef'
import { useQuery } from "@apollo/client";
import Layout from "../../layouts";

import { PROVIDER_COLUMNS } from "../../components/Analytics/pools/config";
import { useRouter } from "next/router";
import {getTokenIconFromID} from "../../analytics/core/format";
import Head from "next/head";

const Pools: React.FC = ({}) => {
    const router = useRouter();

    const { id } = router.query;

    const {
        data: { pool },
    } = useQuery(poolQuery, {
        variables: {
            id,
        },
        context: {
            clientName: "masterchef",
        },
    });
    const {
        data: { poolHistories },
    } = useQuery(poolHistoryQuery, {
        variables: {
            id,
        },
        context: {
            clientName: "masterchef",
        },
    });

    const {
        data: { bundles },
    } = useQuery(ethPriceQuery, {
        pollInterval: 60000,
    });

    const {
        data: { token },
    } = useQuery(tokenQuery, {
        variables: {
            id: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
        },
    });

    const sushiPrice =
        parseFloat(token?.derivedETH) * parseFloat(bundles[0].ethPrice);

    const {
        slpAge,
        slpAgeRemoved,
        userCount,
        slpDeposited,
        slpWithdrawn,
        slpAgeAverage,
        slpBalance,
        tvl,
    } = poolHistories.reduce(
        (previousValue, currentValue) => {
            const date = currentValue.timestamp * 1000;

            previousValue.slpAge.push({
                date,
                value: currentValue.slpAge,
            });

            const slpAgeAverage =
                parseFloat(currentValue.slpAge) / parseFloat(currentValue.slpBalance);

            previousValue.slpAgeAverage.push({
                date,
                value: !Number.isNaN(slpAgeAverage) ? slpAgeAverage : 0,
            });

            previousValue.slpAgeRemoved.push({
                date,
                value: currentValue.slpAgeRemoved,
            });

            previousValue.slpBalance.push({
                date,
                value: parseFloat(currentValue.slpBalance),
            });

            previousValue.slpDeposited.push({
                date,
                value: parseFloat(currentValue.slpDeposited),
            });

            previousValue.slpWithdrawn.push({
                date,
                value: parseFloat(currentValue.slpWithdrawn),
            });

            previousValue.tvl.push({
                date,
                value:
                    (parseFloat(pool.liquidityPair.reserveUSD) /
                        parseFloat(pool.liquidityPair.totalSupply)) *
                    parseFloat(currentValue.slpBalance),
            });

            previousValue.userCount.push({
                date,
                value: parseFloat(currentValue.userCount),
            });

            return previousValue;
        },
        {
            entries: [],
            exits: [],
            slpAge: [],
            slpAgeAverage: [],
            slpAgeRemoved: [],
            slpBalance: [],
            slpDeposited: [],
            slpWithdrawn: [],
            tvl: [],
            userCount: [],
        }
    );

    const pair = pool.liquidityPair;
    const shareValueUSD = pair.reserveUSD / pair.totalSupply;
    const users = pool.users.map((user)=>{
        return {
            ...user,
            preffix: user.address.substr(0, 3),
            poolShare: ((user.amount / pool.balance) * 100).toFixed(4),
            liquidityTokensStaked: (user.amount / 1e18),
            liquidityTokensStakedUSD: (user.amount / 1e18) * shareValueUSD
        }
    });

    const firstTokenIcon = getTokenIconFromID({id: pool?.liquidityPair?.token0?.id})
    const secondTokenIcon = getTokenIconFromID({id: pool?.liquidityPair?.token1?.id})


    const providerColumns: Column[] = useMemo(() => PROVIDER_COLUMNS, []);

    const [providerPage, setProviderPage] = useState(0);
    const [providerPageSize, setProviderPageSize] = useState(10);
    const [fakeProviderLoading, setFakeProviderLoading] = useState(false);

    if (router.isFallback) {
        return <h1>Loading...</h1>;
    }
    return (
      <>
        <Head>
          <title>HODL Valley - Analytics Pool {`${pool.liquidityPair.token0.symbol}-${pool.liquidityPair.token1.symbol} POOL`}</title>
        </Head>
        <Layout.Analytics pools>
          <div className={'pr-78px pl-8px'}>
            <div className={'mt-20px flex justify-between items-center'}>
              <TokenInfo firstIconUrl={firstTokenIcon} secondIconUrl={secondTokenIcon} text={`${pool.liquidityPair.token0.symbol}-${pool.liquidityPair.token1.symbol} POOL`} />
              <div className={'flex justify-end items-center'}>
                <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer'}>Stake SLP</p>
              </div>
            </div>
            <div className={'flex justify-between mt-60px'}>
              <div className={styles.fieldInfoWrapper}>
                <FieldInfo title={'~SLP Age'} value={`${(
                  parseFloat(pool.slpAge) / parseFloat((pool.balance / 1e18).toString())
                ).toFixed(2)} Days`} />
              </div>
              <div className={styles.fieldInfoWrapper}>
                <FieldInfo title={'Users'} value={pool.userCount} />
              </div>
              <div className={styles.fieldInfoWrapper}>
                <FieldInfo title={'Staked'} value={`${(pool.balance / 1e18).toFixed(4)} SLP`} />
              </div>
            </div>
            <div className={'mt-38px'}>
              <CompareGraphic
                rawData={[slpAge, slpAgeRemoved]}
                firstData={{color: '#0062FF', text: 'SLP Age',}}
                secondData={{color: '#F5A623', text: 'SLP Age Removed',}}
              />
            </div>
            <div className={'mt-50px'}>
              <CompareGraphic
                rawData={[slpDeposited, slpWithdrawn]}
                firstData={{color: '#0062FF', text: 'SLP Deposited'}}
                secondData={{color: '#F5A623', text: 'SLP Age Withdrawn'}} />
            </div>
            <div className={'mt-50px'}>
              <CompareGraphic
                rawData={[slpAgeAverage]}
                firstData={{color: '#0062FF', text: '- SLP Age (Days)'}} />
            </div>
            <div className={'mt-50px'}>
              <CompareGraphic
                rawData={[userCount]}
                firstData={{color: '#0062FF', text: 'Users'}} />
            </div>
            <div className={'mt-50px'}>
              <CompareGraphic
                rawData={[slpBalance]}
                firstData={{color: '#0062FF', text: 'SLP Balance'}} />
            </div>
            <div className={'mt-50px'}>
              <CompareGraphic
                rawData={[tvl]}
                firstData={{color: '#0062FF', text: 'TVL (USD)'}} />
            </div>
            <h4 className={`${styles.title} mt-65px mb-20px`}>Top Liquidity Providers</h4>
            <Table
              columns={providerColumns}
              data={users}
              loading={fakeProviderLoading}
              virtualized={true}
              rowHeight={54}
              height={380}
              noContentMessage={'No Information'}
              paginationConfig={{
                currentPage: providerPage,
                defaultPageSize: 10,
                totalCount: users.length,
                onChangePageSize: (val) => {
                  setProviderPageSize(isNaN(Number(val)) ? users.length : Number(val))
                  setProviderPage(0);
                }
              }}
              onScrollEnd={() => {
                if (providerPage * providerPageSize < users.length) {
                  setFakeProviderLoading(true);
                  setProviderPage(providerPage + 1);
                  setTimeout(() => {
                    setFakeProviderLoading(false);
                  }, 1000);
                }
              }}
            />
          </div>
        </Layout.Analytics>
      </>
    )
}
export const  getStaticProps = async ({ params: { id } }) =>{
    const client = getApollo();

    await getEthPrice(client);
    await getSushiToken(client);
    await getPool(id, client);
    await getPoolHistories(id, client);

    return {
        props: {
            initialApolloState: client.cache.extract(),
        },
        revalidate: 1,
    };
}

export async function getStaticPaths() {
    // const client = getApollo();
    // const { pools } = await getPoolIds(client);
    // const paths = pools.map((pool) => ({
    //   params: { id: pool.id },
    // }));
    return { paths: [], fallback: true };
}
export default Pools
