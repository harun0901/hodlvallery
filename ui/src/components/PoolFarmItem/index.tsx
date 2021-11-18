import styles from './poolFarmItem.module.scss'
import {useCallback} from "react";
import {PoolModel} from "../../types/PoolModel";
import Image from 'next/image'
import {FarmModel} from "../../types/FarmModel";

interface PoolItemProps {
  item: PoolModel | FarmModel;
  onSelect?: () => void;
  isFarm?: boolean;
}

const PoolItem: React.FC<PoolItemProps> = ({item, onSelect, isFarm = false}) => {
  const handleSelect = useCallback(() => {
    onSelect && onSelect();
  }, [onSelect]);

  return (
    <div className={`bg-gray-50 h-66px border-3 border-bg-white rounded-full flex items-center cursor-pointer ${styles.btn} transition-opacity text-opacity-60 text-gray-400 hover:text-opacity-100 hover:bg-white`}
         onClick={handleSelect}>
      <div>
        <Image src={isFarm ? (item as FarmModel).stakeToken.icon : (item as PoolModel).fromToken.icon} width={25} height={25} alt={'Token'} />
      </div>
      <div className={'ml-10px'}>
        <Image src={isFarm ? (item as FarmModel).rewardToken.icon : (item as PoolModel).toToken.icon} width={25} height={25} alt={'Token'} />
      </div>
      <p className={'ml-14px uppercase font-medium text-xl text-gray-400 text-opacity-60'}>
        {isFarm ? (item as FarmModel).stakeToken.symbol : (item as PoolModel).fromToken.symbol} / {isFarm ? (item as FarmModel).rewardToken.symbol : (item as PoolModel).toToken.symbol}</p>
      <p className={'ml-22px font-medium text-xl text-blue-400'}>{isFarm ? (item as FarmModel).apr : (item as PoolModel).rate}</p>
    </div>
  )
}

export default PoolItem
