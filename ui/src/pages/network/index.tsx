import Head from 'next/head';
import { TokenListDropdown, SearchInput, TabList } from "../../components";
import styles from "./network.module.scss";
import {TabItemModel} from "../../components/TabList";
import {useState} from "react";
import {TokenModel} from "../../types/TokenModel";
import { getApollo } from "../../analytics/core/apollo";
import {getDayData, getTokens} from "../../analytics/core/api/exchange";
import {getEthPrice, getOneDayEthPrice, getPairs, getSevenDayEthPrice} from "../../analytics/core/api";
import {getPools} from "../../analytics/core/api/masterchef";
import BaseGraphics from "../../components/Analytics/baseGraphics";
import PairsPage from "../../components/Analytics/pairs/index";
import PoolsPage from "../../components/Analytics/pools/index";
import TokensPage from "../../components/Analytics/tokens/index";

enum Tabs {
  PAIRS = 'PAIRS',
  TOKENS = 'TOKENS',
  POOLS = 'POOLS'
}
const tabList: TabItemModel[] = [
  { label: Tabs.PAIRS, value: Tabs.PAIRS },
  { label: Tabs.TOKENS, value: Tabs.TOKENS },
  { label: Tabs.POOLS, value: Tabs.POOLS },
]

const tokenList: TokenModel[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'DAI', name: 'DAI', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'COIN', name: 'COIN', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
]

export default function AnalyticsPage () {
  const [activeTab, setActiveTab] = useState<TabItemModel>(tabList[0]);
  const [selectedToken, setSelectedToken] = useState<TokenModel>();
  const [search, setSearch] = useState<string>('');

  return (
    <>
      <Head>
        <title>HODL Valley - Analytics</title>
      </Head>
      <div className={`flex justify-center pt-80px`}>
        <div className={`${styles.wrapper} border-10 border-white rounded-80 overflow-hidden`}>
          <BaseGraphics />
          <div className={'flex items-start bg-white bg-opacity-80'}>
            <div className={'w-2/12 h-full h-10'}>

            </div>
            <div className={'w-10/12 pl-25px pt-50px'}>
              <div className={'flex justify-between items-top pr-77px'}>
                <TabList items={tabList} onSelect={(tab) => setActiveTab(tab)} activeItem={activeTab} />
                <div className={'flex justify-end items-center'}>
                  <div className={`${styles.searchWrapper}`}>
                    <SearchInput value={search} onChange={setSearch} />
                  </div>
                  <div className={`ml-25px rounded-full ${styles.tokenDropdownWrapper}`}>
                    <TokenListDropdown options={tokenList} onChange={setSelectedToken} value={selectedToken} />
                  </div>
                </div>
              </div>
              <h2 className={'uppercase font-medium text-40px text-gray-800 mt-59px mb-14px tracking-normal pl-7px leading-10'}>
                {activeTab.label}
              </h2>
              <div className={'pb-30px'}>
                {activeTab.value === Tabs.PAIRS && <PairsPage />}
                {activeTab.value === Tabs.POOLS && <PoolsPage />}
                {activeTab.value === Tabs.TOKENS && <TokensPage />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export async function getStaticProps({}) {
  const client = getApollo();

  getDayData(client);
  getEthPrice(client);
  getOneDayEthPrice(client);
  getSevenDayEthPrice(client);
  await getPairs(client);
  await getTokens(client);
  await getPools(client);

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}
