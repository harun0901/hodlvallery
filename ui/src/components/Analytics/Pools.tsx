import { Table } from "../index"
import { Column } from "react-table";
import {useMemo, useState} from "react";
import TokenInfo from "./tokenInfo";
import FieldInfo from "./fieldInfo";
import CompareGraphic from "./compareGraphic";
import styles from "../../pages/analytics/pools/pools.module.scss";
import { PROVIDER_COLUMNS } from "./pools/config";

const Pools: React.FC = ({}) => {

    return  <h1>Pools Component</h1>
   // const id = 21;
   //
   //  const providerColumns: Column[] = useMemo(() => PROVIDER_COLUMNS, []);
   //
   //  const [providerPage, setProviderPage] = useState(0);
   //  const [providerPageSize, setProviderPageSize] = useState(10);
   //  const [fakeProviderLoading, setFakeProviderLoading] = useState(false);
   //
   //  const {loading, data, errorMessage} = useGetPool({id});
   //  const {
   //      pool,
   //      users,
   //      slpAge,
   //      slpAgeRemoved,
   //      slpDeposited,
   //      slpWithdrawn,
   //      slpAgeAverage,
   //      userCount,
   //      slpBalance,
   //      tvl
   //  } = data;
   //
   //  const firstTokenIcon = useTokenIcon({id: pool?.liquidityPair?.token0?.id})
   //  const secondTokenIcon = useTokenIcon({id: pool?.liquidityPair?.token1?.id})
   //
   //  if (errorMessage) {
   //      return  <h1>{errorMessage}</h1>
   //  }
   //  if (loading) {
   //      return  <h1>Loading...</h1>
   //  }
   //
   //  return (
   //      <div className={'pr-78px pl-8px'}>
   //          <div className={'mt-20px flex justify-between items-center'}>
   //              <TokenInfo firstIconUrl={firstTokenIcon} secondIconUrl={secondTokenIcon} text={`${pool.liquidityPair.token0.symbol}-${pool.liquidityPair.token1.symbol} POOL`} />
   //              <div className={'flex justify-end items-center'}>
   //                  <p className={'uppercase font-medium tracking-normal text-base text-blue-400 cursor-pointer'}>Stake SLP</p>
   //              </div>
   //          </div>
   //          <div className={'flex justify-between mt-60px'}>
   //              <div className={styles.fieldInfoWrapper}>
   //                  <FieldInfo title={'~SLP Age'} value={`${(
   //                      parseFloat(pool.slpAge) / parseFloat((pool.balance / 1e18).toString())
   //                  ).toFixed(2)} Days`} />
   //              </div>
   //              <div className={styles.fieldInfoWrapper}>
   //                  <FieldInfo title={'Users'} value={pool.userCount} />
   //              </div>
   //              <div className={styles.fieldInfoWrapper}>
   //                  <FieldInfo title={'Staked'} value={`${(pool.balance / 1e18).toFixed(4)} SLP`} />
   //              </div>
   //          </div>
   //          <div className={'mt-38px'}>
   //              <CompareGraphic
   //                  rawData={[slpAge, slpAgeRemoved]}
   //                  firstData={{color: '#0062FF', text: 'SLP Age',}}
   //                  secondData={{color: '#F5A623', text: 'SLP Age Removed',}}
   //              />
   //          </div>
   //          <div className={'mt-50px'}>
   //              <CompareGraphic
   //                  rawData={[slpDeposited, slpWithdrawn]}
   //                  firstData={{color: '#0062FF', text: 'SLP Deposited'}}
   //                  secondData={{color: '#F5A623', text: 'SLP Age Withdrawn'}} />
   //          </div>
   //          <div className={'mt-50px'}>
   //              <CompareGraphic
   //                  rawData={[slpAgeAverage]}
   //                  firstData={{color: '#0062FF', text: '- SLP Age (Days)'}} />
   //          </div>
   //          <div className={'mt-50px'}>
   //              <CompareGraphic
   //                  rawData={[userCount]}
   //                  firstData={{color: '#0062FF', text: 'Users'}} />
   //          </div>
   //          <div className={'mt-50px'}>
   //              <CompareGraphic
   //                  rawData={[slpBalance]}
   //                  firstData={{color: '#0062FF', text: 'SLP Balance'}} />
   //          </div>
   //          <div className={'mt-50px'}>
   //              <CompareGraphic
   //                  rawData={[tvl]}
   //                  firstData={{color: '#0062FF', text: 'TVL (USD)'}} />
   //          </div>
   //          <h4 className={`${styles.title} mt-65px mb-20px`}>Top Liquidity Providers</h4>
   //          <Table
   //              columns={providerColumns}
   //              data={users}
   //              loading={fakeProviderLoading}
   //              virtualized={true}
   //              rowHeight={54}
   //              height={380}
   //              noContentMessage={'No Information'}
   //              paginationConfig={{
   //                  currentPage: providerPage,
   //                  defaultPageSize: 10,
   //                  totalCount: users.length,
   //                  onChangePageSize: (val) => {
   //                      setProviderPageSize(isNaN(Number(val)) ? users.length : Number(val))
   //                      setProviderPage(0);
   //                  }
   //              }}
   //              onScrollEnd={() => {
   //                  if (providerPage * providerPageSize < users.length) {
   //                      setFakeProviderLoading(true);
   //                      setProviderPage(providerPage + 1);
   //                      setTimeout(() => {
   //                          setFakeProviderLoading(false);
   //                      }, 1000);
   //                  }
   //              }}
   //          />
   //      </div>
   //  )
}
export default Pools
