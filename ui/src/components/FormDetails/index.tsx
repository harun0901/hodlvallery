import { useState } from "react";
import Image from "next/image";
import styles from "./formDetails.module.scss"

export interface FormDetailsColumnModal {
  title: string;
  value: string;
}

export interface FormDetailsConfigModel {
  title: string;
  infoColumns: FormDetailsColumnModal[];
}

interface FormDetailsProps {
  config: FormDetailsConfigModel;
}

const FormDetails: React.FC<FormDetailsProps> = ({config}) => {
  const [expand, setExpand] = useState(false);

  const toggle = () => {
    setExpand(!expand)
  }

  return (
    <div className={`bg-blue-400 border-5 border-blue-500 border-t-0 flex items-center relative ${styles.wrapper} ${expand ? styles.wrapperOpen : ''}`}>
      <div className={`flex items-center w-full h-full absolute top-0 left-0 justify-center px-32px transition-opacity ${expand ? styles.hide : styles.show}`} onClick={toggle}>
        <p className={'text-base uppercase font-medium text-white'}>{config.title}</p>
      </div>
      <div className={`flex items-center w-full h-full absolute top-0 left-0 justify-between px-32px transition-opacity ${expand ? styles.show : styles.hide}`}>
        <p className={'text-base uppercase font-medium text-white'}>{config.title}</p>
        <hr className={`border-0 bg-white bg-opacity-20 w-5px ${styles.delimiter}`} />
        {config.infoColumns.map((column, index) => (
          <>
            <div className={`${styles.column} ${expand ? 'opacity-100' : 'opacity-0'}`} key={index}>
              <p className={'font-medium text-xs text-center text-white text-opacity-60 uppercase'}>{column.title}</p>
              <p className={'font-medium text-xs text-center text-white uppercase'}>{column.value}</p>
            </div>
            {index !== config.infoColumns.length - 1 &&
              <hr className={`border-0 bg-white bg-opacity-20 w-2px ${styles.delimiter}`} key={`${index}_split`} />
            }
          </>
        ))}
        <hr className={`border-0 bg-white bg-opacity-20 w-5px ${styles.delimiter}`} />
        <div className={styles.arrowWrapper} onClick={toggle}>
          <Image src={'/icons/arrowTop.svg'} alt="Arrow Up" width={24} height={16} />
        </div>
      </div>
    </div>
  )
}

export default FormDetails
