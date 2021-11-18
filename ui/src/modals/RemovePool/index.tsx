import {Button, FormDetailsConfigModel, Modal, TokenDropdown} from "../../components"
import Image from 'next/image'
import {DateTime} from "luxon";

import styles from './removePool.module.scss'
import {useCallback, useEffect, useMemo, useState} from "react";
import usePool from "../../state/pool/hooks";
import {PoolModel} from "../../types/PoolModel";
import {Sizes} from "../../types/Sizes";
import {TokenDropdownTypes} from "../../components/TokenDropdown";
import {ModalPropsType} from "../../types/ModalPropsType";

const formDetailsConfig: FormDetailsConfigModel = {
  title: 'POOL DETAILS',
  infoColumns: [
    {title: 'DATE ADDED', value: '12/1/2020'},
    {title: 'POOL SHARE', value: '23%'},
    {title: 'RATE', value: '1 ETH = .0592 DAI'},
    {title: 'RATE', value: '.0592 DAI = 1 ETH'}
  ]
}

const RemovePoolModal: React.FC = () => {
  const { getCurrentPool } = usePool();
  const [poolData, setPoolData] = useState<PoolModel>();

  const [removePercent, setRemovePercent] = useState('0');
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    const data = getCurrentPool();
    setPoolData(data.pool);
  }, [getCurrentPool])

  const ctaText = useMemo(() => {
    if (reviewed) {
      return 'Confirm'
    }
    if (approved) {
      return 'Review';
    }
    if (!approved && Number(removePercent) > 0 && !approving) {
      return 'Approve';
    }
    if (approving) {
      return 'Approving...';
    }
    if (Number(removePercent) > 0) {
      return 'Approve';
    }
    return 'enter percentage';
  }, [removePercent, approving, approved, reviewed])

  const handleAction = useCallback(() => {
    if (Number(removePercent) > 0) {
      if (!approving && !approved) {
        setApproving(true);

        setTimeout(() => {
          setApproving(false);
          setApproved(true);
        }, 3000);
      }
    }

    if (!reviewed && approved) {
      setReviewed(true)
    }

    if (reviewed) {
      // CONFIRM!!!
    }
  }, [removePercent, approving, approved, reviewed]);

  return (
    <Modal isOpen={true}
           title={{firstLine:'remove', secondLine: 'pool'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           formDetailsConfig={formDetailsConfig}>
      <div className={`h-full relative`}>
        <div className={`h-full flex flex-col`}>
          <div className={`w-full bg-gray-200 border-b-10 border-gray-100 p-10px relative p-20px rounded-tr-60 ${styles.assetForm}`}>
            {poolData &&
              <div className={'flex'}>
                <div className={styles.leftColumn}>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Pool Share</p>
                    <p className={styles.value}>{poolData.share}%</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>{poolData.fromToken.symbol} ADDED</p>
                    <p className={styles.value}>{poolData.fromAdded}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>{poolData.toToken.symbol} ADDED</p>
                    <p className={styles.value}>{poolData.toAdded}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>DATE ADDED</p>
                    <p className={styles.value}>{DateTime.fromJSDate(poolData.addedAt).toFormat('LL/d/yyyy')}</p>
                  </div>
                </div>
                <div className={styles.rightColumn}>
                  <div className={'-mt-9px'}>
                    <TokenDropdown operation={'Remove'}
                                   selectedToken={poolData?.fromToken}
                                   amount={removePercent}
                                   onChangeAmount={setRemovePercent}
                                   allowEditAmount={true}
                                   size={Sizes.SMALL}
                                   type={TokenDropdownTypes.INPUT_STEPPER}
                                   suffix={'%'}
                                   readonly={false}/>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className={`w-full ${styles.receiveForm}`}>
            {poolData &&
              <div className={'flex items-center justify-end'}>
                <div className={`${styles.calcColumn} items-end`}>
                  <p className={'font-medium text-right text-gray-400 text-35px tracking-normal leading-8'}>{poolData.fromToken.balance * Number(removePercent) || 0}</p>
                  <p className={'font-medium text-right text-gray-400 text-35px tracking-normal leading-10'}>{poolData.fromToken.symbol}</p>
                </div>
                <div className={'flex items-center justify-center px-72px'}>
                  <Image src={'/icons/plus.svg'} width={44} height={44} alt={'Plus'} />
                </div>
                <div className={`${styles.calcColumn} items-start`}>
                  <p className={'font-medium text-right text-gray-400 text-35px tracking-normal leading-8'}>{poolData.toToken.balance * Number(removePercent) || 0}</p>
                  <p className={'font-medium text-right text-gray-400 text-35px tracking-normal leading-10'}>{poolData.toToken.symbol}</p>
                </div>
              </div>
            }
            <div className={'flex justify-end items-center mt-53px'}>
              {!reviewed &&
              <div className={'cursor-pointer mr-74px flex items-center'}>
                {(!approved) ? (
                  <div>
                    <Image src={'/icons/iconGear.svg'} width={33} height={33} alt={'Settings'} />
                  </div>
                ) : (
                  <div className={'flex items-center mr-22px'}>
                    <p className={'uppercase text-xl text-green-350 font-medium tracking-normal mr-10px'}>Approved</p>
                    <Image src={'/icons/iconSuccessDark.svg'} width={25} height={25} alt={'Success'} />
                  </div>
                )}
              </div>
              }
              <Button disabled={!Number(removePercent)} onClick={handleAction} notClickable={approving}>
                <p className={approving ? 'text-opacity-50' : 'tracking-normal'}>{ctaText}</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default RemovePoolModal;
