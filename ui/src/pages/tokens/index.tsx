import Layout from '../../layouts';
import Head from 'next/head';
import Tokens from "../../components/TokensPage/Tokens";
import { TokenListDropdown, SearchInput, TokenCard } from "../../components";
import styles from "./tokens.module.scss";
import {useState} from "react";
import {TokenModel} from "../../types/TokenModel";

const tokenList: TokenModel[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 24325.92, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'DAI', name: 'DAI', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 32.15, price: 1000, icon: '/icons/assets/btc.svg', address: 'testBTC' },
  { symbol: 'COIN', name: 'COIN', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
]

export default function TokensPage() {
  const [selectedToken, setSelectedToken] = useState<TokenModel>();
  const [search, setSearch] = useState<string>('');

  return (
    <>
      <Head>
        <title>HODL Valley - Tokens</title>
      </Head>
      <div className={`flex justify-center pt-80px`}>
        <div className={`${styles.wrapper} border-10 border-white rounded-80 overflow-hidden`}>
          <div className={'flex items-start bg-white bg-opacity-60'}>
            <div className={'w-2/12 h-full h-10'}>

            </div>
            <div className={'w-10/12 pl-20px pt-48px'}>
              <div className={styles.form}>
                <h4 className={'font-bold text-xl text-gray-800 uppercase tracking-normal'}>Your tokens</h4>
                <div className={'pt-30px'}>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard emptyLineConfig={{firstLine: 'Swap', secondLine: 'Tokens'}} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                </div>
                <h4 className={'font-bold text-xl text-gray-800 uppercase tracking-normal mt-89px'}>Popular tokens</h4>
                <div className={'pt-30px'}>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                  <div className={styles.tokenCardWrapper}>
                    <TokenCard firstToken={tokenList[0]} />
                  </div>
                </div>
                <div className={`flex justify-between items-center pr-67px ${styles.tableForm}`}>
                  <h2 className={'uppercase font-medium text-40px text-gray-800 tracking-normal leading-10'}>All tokens</h2>
                  <div className={'flex justify-end items-center'}>
                    <div className={`${styles.searchWrapper}`}>
                      <SearchInput value={search} onChange={setSearch} />
                    </div>
                    <div className={`ml-25px rounded-full ${styles.tokenDropdownWrapper}`}>
                      <TokenListDropdown options={tokenList} onChange={setSelectedToken} value={selectedToken} />
                    </div>
                  </div>
                </div>
              </div>
              <div className={'pb-30px'}>
                <Tokens />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
