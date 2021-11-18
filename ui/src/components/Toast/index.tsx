/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image'

import styles from "./toast.module.scss"

interface ToastProps {
  text: string;
}

const Toast: React.FC<ToastProps> = ({text}) => (
  <div className={`flex items-center rounded-full border-5 bg-red-400 border-red-300 pt-11px pb-8px px-30px w-full ${styles.wrapper}`}>
    <div className={'cursor-pointer pt-4px'}>
      <Image src={"/icons/iconWarning.svg"} width={48} height={42} />
    </div>
    <hr className={`${styles.delimiter} ml-24px`} />
    <p className={`text-base text-white font-medium tracking-wider pl-32px pr-22px ${styles.text}`}>{text}</p>
    <hr className={styles.delimiter} />
    <div className={'cursor-pointer'}>

    </div>
  </div>
);

export default Toast;
