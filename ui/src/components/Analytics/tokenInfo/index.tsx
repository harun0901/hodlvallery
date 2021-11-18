/* eslint-disable jsx-a11y/alt-text */
import {ReactNode} from "react";
import Image from "next/image";
import styles from "./tokenInfo.module.scss"

interface TokenInfoProps {
  firstIconUrl: string;
  secondIconUrl?: string;
  text: string;
  children?: ReactNode;
}

const TokenInfo: React.FC<TokenInfoProps> = ({
                                               firstIconUrl,
                                               secondIconUrl,
                                               text,
                                               children}) => (
  <div className={'flex items-center'}>
    <div className={styles.tokenIconWrapper}>
      <Image src={firstIconUrl} width={50} height={50}/>
    </div>
    {secondIconUrl &&
      <div className={`${styles.tokenIconWrapper} -ml-13px`}>
        <Image src={secondIconUrl} width={50} height={50}/>
      </div>
    }
    <p className={'pl-9px font-medium text-46px text-gray-800 tracking-normal'}>{text}</p>
    {children}
  </div>
)

export default TokenInfo
