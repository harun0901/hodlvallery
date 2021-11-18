/* eslint-disable jsx-a11y/alt-text */
import { Button, ButtonType, Modal } from "../../components"
import NetworkStatus from "./networkStatus";
import Image from 'next/image'

import styles from "./home.module.scss"
import { shortenAddress } from "../../functions";
import React, { useCallback, useMemo, useState } from "react";
import { Sizes } from "../../types/Sizes";
import Transaction from '../../components/AccountDetails/Transaction'

import { useActiveWeb3React } from "../../hooks";
import { useAllTransactions, isTransactionRecent } from "../../state/transactions/hooks";
import { TransactionDetails } from '../../state/transactions/reducer'
import { useETHBalances } from "../../state/wallet/hooks";
import { NATIVE } from "@sushiswap/sdk";
import { NETWORK_LABEL, NETWORK_NET, NETWORK_TYPE } from "../../constants/networks";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FixedSizeList} from "react-window";

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

const HomeModal: React.FC = () => {
  const [showDetail, setShowDetail] = useState(false);
  const { chainId, account, connector } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pendingTransactions = sortedRecentTransactions.filter((tx) => !tx.receipt).map((tx) => tx.hash)
  const confirmedTransactions = sortedRecentTransactions.filter((tx) => tx.receipt).map((tx) => tx.hash)

  const toggleDetails = useCallback(() => {
    setShowDetail(!showDetail);
  }, [showDetail]);

  const copyAddress = useCallback(() => {
    navigator.clipboard.writeText(account);
  }, [account])

  const RenderRow = React.useCallback(
    ({ index, style, data }) => (
        <div key={index} style={style}>
          <Transaction hash={data[index]} />
        </div>
      ),
    []
  );

  return (
    <Modal isOpen={true}
           title={{ firstLine: 'my', secondLine: 'home' }}
           description={""}
           mainIconName={"UserHomeOne"}>
      <div className={`h-full relative`}>
        <div className={`${styles.body} ${showDetail ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`flex justify-between items-end ${styles.infoRow}`}>
            <p className='text-gray-400 text-opacity-60 font-medium text-40px uppercase tracking-normal'>{NETWORK_TYPE[chainId]}</p>
            {/* <p className='text-gray-400 text-opacity-60 font-medium text-xl mb-6px tracking-normal'>$0</p> */}
          </div>
          <div className={`flex justify-between -mt-14px ${styles.infoRow}`}>
            <p className='text-40px uppercase tracking-normal'>{NATIVE[chainId].symbol}</p>
            <p className='text-40px tracking-normal'>{userEthBalance && (userEthBalance).toFixed(4)}</p>
          </div>
          <hr className={'w-full h-3px bg-gray-600 rounded bg-opacity-20 border-0 mt-19px mb-27px'} />
          <div className='flex justify-between items-center pl-2px pr-17px'>
            <p className='text-base text-gray-300 tracking-normal'>WALLET ADDRESS</p>
            <div className='flex items-center' onClick={copyAddress}>
              <p className='mr-27px text-gray-400 text-base tracking-normal mr-30px'>{account && shortenAddress(account)}</p>
              <Image src='/icons/copy.svg' width={24} height={24} />
            </div>
          </div>
          <hr className={'w-full h-3px bg-gray-600 rounded bg-opacity-20 border-0 mt-27px'} />
          <p className='text-gray-400 text-sm mt-28px pl-2px'>RECENT TRANSACTIONS</p>
          <div className='mt-20px'>
            {(!pendingTransactions.length && !confirmedTransactions.length) ?
              <p className='text-gray-300 text-sm pl-2px'>SWAP A TOKEN TO SEE YOUR TRANSACTION HERE! 😊</p>
              :
              <FixedSizeList
                outerElementType={(props) => <PerfectScrollbar {...props} />}
                height={100}
                itemData={pendingTransactions.concat(confirmedTransactions)}
                itemCount={pendingTransactions.length + confirmedTransactions.length}
                itemSize={30}
                width={"100%"}
              >
                {RenderRow}
              </FixedSizeList>
            }
          </div>
          <div className={`flex justify-between absolute w-full left-0 bottom-35px pr-40px ${styles.manageRow}`}>
            <NetworkStatus networkName={NETWORK_LABEL[chainId]} network={NETWORK_NET[chainId]} />
            <Button onClick={toggleDetails}>Details</Button>
          </div>
        </div>

        <div className={`${styles.body} ${styles.bodyDetails} ${showDetail ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <Button type={ButtonType.GHOST}
            size={Sizes.SMALL}
            leftIcon={<Image src={'/icons/arrowLeft.svg'} alt={'Back'} width={16} height={24} />}
            onClick={toggleDetails}>
            <p className={'pl-16px'}>BACK</p>
          </Button>
          <div className={styles.detailsForm}>
            <p className='text-gray-400 text-xl uppercase text-opacity-60'>NAME</p>
            <p className='text-gray-400 text-xl tracking-normal mt-8px'>My Home</p>
            <hr className={'w-full h-3px bg-gray-600 rounded bg-opacity-20 border-0 my-27px'} />
            <p className='text-gray-400 text-xl uppercase text-opacity-60'>DESCRIPTION</p>
            <p className={`text-gray-400 text-xl tracking-normal mt-8px ${styles.detailDescription}`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. </p>
            <hr className={'w-full h-3px bg-gray-600 rounded bg-opacity-20 border-0 my-27px'} />
            <p className='text-gray-400 text-xl uppercase text-opacity-60'>AVAILABLE FOR PURCHASE</p>
            <p className='text-gray-400 text-xl tracking-normal mt-8px'>No</p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default HomeModal
