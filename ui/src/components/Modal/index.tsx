import {ReactNode, useEffect, useRef} from "react";
import Image from 'next/image'

import styles from "./modal.module.scss"
import useModals from "../../state/modals/hooks";
import {Sizes} from "../../types/Sizes";
import {FormDetailsConfigModel} from "../FormDetails";
import {FormDetails} from "../index";
import {useRouter} from "next/router";

interface ModalProps {
  isOpen: boolean;
  title: {
    firstLine: string;
    secondLine?: string;
    secondLineSize?: Sizes;
  },
  description?: string;
  children: ReactNode;
  size?: Sizes;
  formDetailsConfig?: FormDetailsConfigModel;
  headBlock?: ReactNode;
  isConfirmation?: boolean;
  firstLineClassname?: string;
  mainIconName?: string;
}

const Modal: React.FC<ModalProps> = ({
                                       isOpen,
                                       title,
                                       description = '',
                                       children,
                                       size = Sizes.NORMAL,
                                       formDetailsConfig,
                                       headBlock,
                                       isConfirmation = false,
                                       mainIconName= "Factory",
                                       firstLineClassname = ''}) => {
  const router = useRouter();
  const { closeModals } = useModals();

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeModals();
        router.push('/');
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, closeModals, isOpen, router]);

  return (
    <div className={`w-screen h-screen top-0 left-0 flex justify-center items-center blurWrapper z-40 ${isOpen ? 'fixed' : 'hidden'}`}>
      {isConfirmation ? (
        <div className={`relative bg-white bg-opacity-50 border-10 border-grey-100 flex flex-col rounded-80 ${styles.form} 
            ${size === Sizes.EXTRA_SMALL ? styles.formExtraSmall : ''}`}
             ref={wrapperRef}>
          <div className={`relative border-b-10 border-white rounded-tl-70 rounded-tr-70 bg-gray-200 ${styles.leftPanel} ${size === Sizes.EXTRA_SMALL ? `${styles.noBottomPadding} ${styles.panelFull} ${styles.confirmationTopPanel}` : ''}`}>
            <div className={'relative z-10'}>
              <div className={`relative  ${styles.confirmationWalletWrapper}`}>
                <div className={`absolute pointer-events-none ${styles.confirmationImageWrapper}`}>
                  <Image src={"/images/walletConfirmation.png"} alt={'Wallet'} width={592} height={592} />
                </div>
              </div>
              <p className={`uppercase font-medium text-gray-400 tracking-normal text-center text-60px mt-18px leading-14 ${firstLineClassname}`}>{title.firstLine}</p>
              {headBlock}
            </div>
          </div>
          <div
            className={`rounded-tr-70 rounded-br-70 ${styles.rightPanel} ${size === Sizes.EXTRA_SMALL ? styles.panelFull : ''}`}>
            {children}
          </div>
          {formDetailsConfig &&
          <div className={`absolute top-full left-0 flex justify-center w-full ${styles.formDetailsWrapper}`}>
            <FormDetails config={formDetailsConfig}/>
          </div>
          }
        </div>
      ) : (
          <div className={`relative bg-white bg-opacity-50 border-10 border-grey-100 flex rounded-80 ${styles.form} 
            ${size === Sizes.SMALL ? styles.formSmall : size === Sizes.MEDIUM ? styles.formMiddle : ''}`}
               ref={wrapperRef}>
            <div className={`relative overflow-hidden border-r-10 border-white rounded-tl-70 rounded-bl-70 ${styles.leftPanel} 
          ${size === Sizes.SMALL ? styles.leftPanelSmall : size === Sizes.MEDIUM ? styles.leftPanelMedium : ''}`}>
              <div className={'relative z-10'}>
                <p
                  className={`uppercase font-medium text-gray-400 tracking-normal ${styles.firstLine}`}>{title.firstLine}</p>
                <p
                  className={`uppercase font-medium text-gray-400 tracking-normal mt-2px ${title?.secondLineSize === Sizes.SMALL ? styles.secondLineSmall : styles.secondLine}`}>
                  {title.secondLine}
                </p>
                <p className={`font-medium text-gray-400 opacity-60 text-sm tracking-normal`}>{description}</p>
              </div>
              <div className={styles.mainIconWrapper}>
                <Image src={`/images/modals/${mainIconName}.png`} alt={'Icon'} layout='fill' objectFit='contain'/>
              </div>
            </div>
            <div
              className={`rounded-tr-70 rounded-br-70 ${styles.rightPanel} ${size === Sizes.SMALL ? styles.rightPanelSmall : size === Sizes.MEDIUM ? styles.rightPanelMedium : ''}`}>
              {children}
            </div>
            {formDetailsConfig &&
            <div className={`absolute top-full left-0 flex justify-center w-full ${styles.formDetailsWrapper}`}>
              <FormDetails config={formDetailsConfig}/>
            </div>
            }
          </div>
        )}
    </div>
  )
}

export default Modal
