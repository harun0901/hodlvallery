import {Button, Modal, TokenDropdown} from "../../components"
import Image from 'next/image'
import {DateTime} from "luxon";

import styles from './addRemoveStake.module.scss'
import {useCallback, useMemo, useState} from "react";
import {Sizes} from "../../types/Sizes";
import {TokenDropdownTypes} from "../../components/TokenDropdown";
import {ModalPropsType} from "../../types/ModalPropsType";

interface StakeModel {
  stakingApr: number;
  balance: number;
  unstaked: number;
  addedAt: Date;
  money: number;
}

const stakeData: StakeModel = {
  stakingApr: 4.09,
  balance: 23423.52,
  unstaked: 23423.52,
  addedAt: new Date(),
  money: 1000000
}

interface AddRemoveStakeModalProps {
  isRemove: boolean;
}

const AddRemoveStakeModal: React.FC<AddRemoveStakeModalProps> = ({isRemove}) => {
  const [stakePercent, setStakePercent] = useState('0');
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const ctaText = useMemo(() => {
    if (reviewed) {
      return 'Confirm'
    }
    if (approved) {
      return 'Review';
    }
    if (!approved && Number(stakePercent) > 0 && !approving) {
      return 'Approve';
    }
    if (approving) {
      return 'Approving...';
    }
    if (Number(stakePercent) > 0) {
      return 'Approve';
    }
    return 'enter percentage';
  }, [stakePercent, approving, approved, reviewed])

  const handleAction = useCallback(() => {
    if (Number(stakePercent) > 0) {
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
  }, [stakePercent, approving, approved, reviewed]);

  const handleChangePercent = useCallback((val: string) => {
    const correctVal = val.replace(/[^\d.-]/g, '');
    const num = isNaN(Number(correctVal)) ? 0 : Number(correctVal);
    const correctNum = num < 0 ? 0 : num > 100 ? 100 : num;
    setStakePercent(`${correctNum}`);
  }, []);

  return (
    <Modal isOpen={true}
           title={{firstLine: isRemove ? 'remove' : 'add', secondLine: 'stake'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}>
      <div className={`h-full relative`}>
        <div className={`h-full flex flex-col`}>
          <div className={`w-full bg-gray-200 border-b-10 border-gray-100 p-10px relative p-20px rounded-tr-60 ${styles.assetForm}`}>
            {stakeData &&
              <div className={'flex'}>
                <div className={styles.leftColumn}>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>STAKING APR</p>
                    <p className={styles.value}>{stakeData.stakingApr}%</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>BALANCE</p>
                    <p className={styles.value}>{stakeData.balance}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>UNSTAKED</p>
                    <p className={styles.value}>{stakeData.unstaked}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>DATE ADDED</p>
                    <p className={styles.value}>{DateTime.fromJSDate(stakeData.addedAt).toFormat('LL/d/yyyy')}</p>
                  </div>
                </div>
                <div className={styles.rightColumn}>
                  <div className={'-mt-9px'}>
                    <TokenDropdown operation={isRemove ? 'unstake' : 'stake'}
                                   amount={stakePercent}
                                   onChangeAmount={handleChangePercent}
                                   allowEditAmount={true}
                                   size={Sizes.SMALL}
                                   type={TokenDropdownTypes.INPUT_STEPPER}
                                   suffix={'%'}
                                   readonly={false}/>
                  </div>
                  <div className={'flex justify-end mt-7px mr-10px'}>
                    <button className={`${styles.yellowBtn}`}>MAX</button>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className={`w-full ${styles.receiveForm}`}>
            {stakeData &&
              <div className={`${styles.calcColumn} items-center w-full justify-center`}>
                <p className={'font-medium text-gray-400 text-40px tracking-normal leading-8'}>{stakeData.money * Number(stakePercent) || 0}</p>
                <p className={'font-medium text-gray-400 text-xl tracking-normal leading-10 mt-6px'}>MONEY</p>
              </div>
            }
            <div className={'flex justify-end items-center mt-38px'}>
              {!reviewed &&
              <div className={'cursor-pointer mr-74px flex items-center'}>
                {(!approved) ? (
                  <div className={'flex items-center'}>
                    <p className={'font-medium text-xl text-black tracking-normal mr-22px'}>SETTINGS</p>
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
              <Button disabled={!Number(stakePercent)} onClick={handleAction} notClickable={approving}>
                <p className={`${approving ? 'text-opacity-50' : 'tracking-normal'} ${!Number(stakePercent) ? 'text-gray-750' : 'text-white'}`}>{ctaText}</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default AddRemoveStakeModal;
