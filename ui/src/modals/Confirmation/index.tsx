import {Modal} from "../../components"
import Image from 'next/image'

import styles from "./confirmation.module.scss"
import {Sizes} from "../../types/Sizes";
import {ModalPropsType} from "../../types/ModalPropsType";
import {useEffect, useState} from "react";

const ConfirmationModal: React.FC<ModalPropsType> = ({isOpen}) => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSubmitted(true);
    }, 3000);
  }, [open])

  return (
    <Modal isOpen={isOpen}
           title={{firstLine: submitted ? 'SUBMITTED!' : 'waiting...'}}
           firstLineClassname={'mt-48px'}
           headBlock={submitted
             ? <p className={'font-medium text-25px text-center text-gray-400 opacity-60 tracking-normal mt-9px mb-65px'}>Your request has been submitted to the blockchain!</p>
             : <p className={'font-medium text-sm text-center text-gray-400 opacity-60 tracking-normal mt-1px mb-27px'}>Please confirm this liquidity transaction in your wallet.</p>}
           isConfirmation={true}
           size={Sizes.EXTRA_SMALL}>
      {submitted ? (
          <div className={'flex justify-center items-center pt-52px'}>
            <p className={'font-bold text-xl text-blue-400 cursor-pointer uppercase tracking-normal'}>VIEW TRANSACTION</p>
          </div>
        ) : (
          <div className={`h-full relative px-50px pt-36px`}>
            <div className={'flex justify-center items-center border-b-4 border-gray-100 pb-33px'}>
              <div className={'flex flex-col items-end pt-4px'}>
                <p className={styles.value}>1245.40</p>
                <p className={`${styles.value} mt-4px`}>ETH</p>
              </div>
              <div className={`${styles.plusWrapper} bg-gray-200 border-8 border-gray-100 flex items-center justify-center rounded-full mx-22px`}>
                <Image src={'/icons/plus.svg'} alt={'Plus'} width={28} height={28} />
              </div>
              <div className={'flex flex-col items-start pt-4px'}>
                <p className={styles.value}>1245.40</p>
                <p className={`${styles.value} mt-4px`}>DAI</p>
              </div>
            </div>
            <div className={'flex justify-center items-center pt-37px'}>
              <p className={'font-bold text-xl text-blue-400 cursor-pointer uppercase tracking-normal'}>Close</p>
            </div>
          </div>
      )}
    </Modal>
  )
}

export default ConfirmationModal;
