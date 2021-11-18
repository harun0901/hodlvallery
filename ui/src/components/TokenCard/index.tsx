import styles from './tokenCard.module.scss'
import Image from "next/image";
import {TokenModel} from "../../types/TokenModel";
import {useCallback} from "react";
import {formatNumber} from "../../functions";

interface TokenCardProps {
  firstToken?: TokenModel;
  secondToken?: TokenModel;
  emptyLineConfig?: {
    firstLine: string;
    secondLine: string;
  },
  onAdd?: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ firstToken, secondToken, emptyLineConfig, onAdd}) => {
  const handleAdd = useCallback(() => {
    !firstToken && onAdd && onAdd();
  }, [onAdd, firstToken]);

  return (
    <div className={`border-3 rounded-full flex items-center px-17px ${styles.wrapper} ${!firstToken ? 'border-gray-800' : 'bg-white border-gray-260'}`} onClick={handleAdd}>
      {firstToken && secondToken &&
        <>
          <div className={'w-4/12 flex justify-center'}>
            <Image src={firstToken.icon} alt="Token" width={32} height={32} />
            <Image src={secondToken.icon} alt="Token" width={32} height={32}/>
          </div>
          <div className={'w-8/12 flex flex-col'}>
            <p className={styles.text}>{firstToken.symbol} / {secondToken.symbol}</p>
            <p className={''}>8.93%</p>
          </div>
        </>
      }
      {firstToken && !secondToken &&
        <>
          <div className={'w-3/12 flex justify-start'}>
            <Image src={firstToken.icon} alt="Token" width={32} height={32} />
          </div>
          <div className={'w-9/12 flex flex-col'}>
            <p className={styles.text}>{firstToken.name}</p>
            <div className={'flex mt-3px'}>
              <p className={styles.text}>{firstToken.symbol}</p>
              <p className={'font-medium text-15px text-blue-400 pl-8px'}>{formatNumber(firstToken.balance)}</p>
            </div>
          </div>
        </>
      }
      {!firstToken && !secondToken &&
        <>
          <div className={'w-3/12 flex justify-start'}>
            <div className={`${styles.circle} ml-1px`}>
              <Image src={'/icons/plusWhite.svg'} alt="Plus" width={14} height={14} />
            </div>
          </div>
          <div className={'w-9/12 flex flex-col pl-1px'}>
            <p className={styles.text}>{emptyLineConfig?.firstLine}</p>
            <p className={`mt-4px ${styles.text}`}>{emptyLineConfig?.secondLine}</p>
          </div>
        </>
      }
    </div>
)}

export default TokenCard
