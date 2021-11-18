import {Button, Modal} from "../../components"
import {DateTime} from "luxon";

import styles from './poolDetails.module.scss'
import {useCallback, useEffect, useState} from "react";
import usePool from "../../state/pool/hooks";
import {PoolModel} from "../../types/PoolModel";
import useModals from "../../state/modals/hooks";
import {ApplicationModal} from "../../state/modals/actions";
import {ModalPropsType} from "../../types/ModalPropsType";
import {useRouter} from "next/router";

const PoolDetailsModal: React.FC = () => {
  const router = useRouter();
  const { getCurrentPool } = usePool();
  const { closeModals, openModal } = useModals();
  const [isUserPool, setIsUserPool] = useState(false);
  const [poolData, setPoolData] = useState<PoolModel>();

  useEffect(() => {
    const data = getCurrentPool();
    setPoolData(data.pool);
    setIsUserPool(data.isUserPool);
  }, [getCurrentPool])

  const handleAddPool = useCallback(() => {
    closeModals();
    router.push(`/pool/add`)
  }, [closeModals, router]);

  const handleDeletePool = useCallback(() => {
    closeModals();
    router.push(`/pool/remove/${poolData.fromToken.address}`)
  }, [closeModals, router, poolData]);

  return (
    <Modal isOpen={true}
           title={{firstLine: `${isUserPool ? 'my' : ''} pool`, secondLine: 'details'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           mainIconName={"PoolOne"}>
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
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Rates</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.value}>1 {poolData.fromToken.symbol} = {poolData.rate} {poolData.toToken.symbol}</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.title}>Rates</p>
                  </div>
                  <div className={styles.infoRow}>
                    <p className={styles.value}>{poolData.rate} {poolData.toToken.symbol} = 1 {poolData.fromToken.symbol}</p>
                  </div>
                </div>
              </div>
            }
          </div>
          <div className={`w-full relative z-10 ${styles.receiveForm}`}>
            <div className={'flex flex-col items-center'}>
              <p className={'text-40px text-gray-400 font-medium tracking-normal'}>{poolData?.quantity}</p>
              <p className={'text-xl text-gray-400 font-medium tracking-normal -mt-2px'}>{poolData?.fromToken?.symbol}/{poolData?.toToken?.symbol} POOL TOKENS</p>
            </div>
            <div className={'flex justify-between items-center mt-45px'}>
              <Button onClick={handleAddPool}>
                <p className={'tracking-normal'}>ADD LIQUIDITY</p>
              </Button>
              <Button disabled={!isUserPool} onClick={handleDeletePool}>
                <p className={`tracking-normal ${!isUserPool ? 'text-gray-750' : 'text-white'}`}>Remove Pool</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default PoolDetailsModal;
