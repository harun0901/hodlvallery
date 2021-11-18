import {Modal, PoolFarmItem} from "../../components"
import Image from 'next/image'

import styles from './searchPoolOrFarm.module.scss'
import {Sizes} from "../../types/Sizes";
import React, {useCallback, useState} from "react";
import useModals from "../../state/modals/hooks";
import {PoolModel} from "../../types/PoolModel";
import usePool from "../../state/pool/hooks";
import {FarmModel} from "../../types/FarmModel";
import useFarm from "../../state/farm/hooks";
import {useRouter} from "next/router";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FixedSizeList} from "react-window";
import Transaction from "../../components/AccountDetails/Transaction";

const poolList: PoolModel[] = [
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  },
  {
    fromToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    toToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    rate: 0.0592,
    share: 23,
    fromAdded: 0.002,
    toAdded: 1245.3,
    addedAt: new Date(),
    quantity: 941245.40
  }
]

const farmList: FarmModel[] = [
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  },
  {
    rewardToken: {
      name: 'Ethereum',
      symbol: 'ETH',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    stakeToken: {
      name: 'DAI',
      symbol: 'DAI',
      price: 100,
      icon: '/icons/assets/eth.svg',
      balance: 100,
      address: '12t6gh81273tgq123'
    },
    tvl: 548381.34,
    rewards: 15.34,
    staked: 12215.34,
    apr: 13.24,
    harvesting: false
  }
]

interface SearchPoolOrFarmModalProps {
  isMyPool?: boolean;
  isFarmView?: boolean;
}

const SearchPoolOrFarmModal: React.FC<SearchPoolOrFarmModalProps> = ({isMyPool = false, isFarmView = false}) => {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const { closeModals, openModal } = useModals();
  const { setPool } = usePool();
  const { setFarm } = useFarm();

  const selectItem = useCallback((item: PoolModel | FarmModel): void => {
    closeModals();
    if (isFarmView) {
      setFarm(item as FarmModel);
      router.push(`/farm/${isMyPool ? 'myfarm' : 'allfarm'}/${(item as FarmModel).rewardToken.symbol}${(item as FarmModel).stakeToken.symbol}`);
      // openModal(ApplicationModal.FARM_DETAILS);
    } else {
      setPool(item as PoolModel, isMyPool);
      router.push(`/pool/${isMyPool ? 'myview' : 'allview'}/${(item as PoolModel).fromToken.symbol}${(item as PoolModel).toToken.symbol}`);
      // openModal(ApplicationModal.POOL_DETAILS);
    }
  }, [closeModals, isMyPool, isFarmView, router]);

  const RenderRow = React.useCallback(
    ({ index, style, data }) => (
      <div key={index} style={style} className={'px-10px'}>
        <PoolFarmItem item={data[index]} isFarm={isFarmView} onSelect={() => selectItem(data[index])} />
      </div>
    ),
    [selectItem, isFarmView]
  );

  return (
    <Modal isOpen={true}
           title={{firstLine: isMyPool ? 'view my' : 'view all', secondLine: isFarmView ? 'farms' : isMyPool ? 'pool' : 'pools'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           size={Sizes.SMALL}>
      <div className={`h-full flex flex-col ${styles.form}`}>
        <div className={'px-10px'}>
          <div className={'w-full h-66px bg-gray-220 border-3 border-white bg-opacity-60 border-opacity-60 rounded-full flex justify-between items-center pl-43px pr-26px pt-2px'}>
            <input className={'bg-transparent font-medium text-xl text-gray-700 placeholder-gray-700'}
                   placeholder={'SEARCH...'}
                   type="text"
                   value={searchVal}
                   onChange={(e) => setSearchVal(e.target.value)} />
            <div className={'mt-5px'}>
              <Image src={'/icons/iconMagnifier.svg'} width={25} height={25} />
            </div>
          </div>
        </div>
        <div className={`mt-20px ${styles.listWrapper}`}>
          <FixedSizeList
            outerElementType={(props) => <PerfectScrollbar {...props} />}
            height={400}
            itemData={isFarmView ? farmList : poolList}
            itemCount={isFarmView ? farmList.length : poolList.length}
            itemSize={86}
            width={"100%"}
          >
            {RenderRow}
          </FixedSizeList>

          {/*{(isFarmView ? farmList : poolList).map((item, index) => (*/}
          {/*  <div className={'mb-20px'} key={index}>*/}
          {/*    <PoolFarmItem item={item} isFarm={isFarmView} onSelect={() => selectItem(item)} />*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>
      </div>
    </Modal>
  )
}

export default SearchPoolOrFarmModal
