import styles from './notification.module.scss'
import {useCallback} from "react";
import Image from 'next/image'

export enum NotificationType {
  NORMAL = "NORMAL",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR"
}

export interface NotificationModel {
  id?: string,
  text: string,
  linkText: {
    text: string,
    link: string
  },
  progress?: number;
  type: NotificationType;
}

interface Props {
  item: NotificationModel,
  onClose?: (id?: string) => {}
}

const Notification: React.FC<Props> = ({item, onClose}) => {
  const handleClose = useCallback(() => {
    onClose && onClose(item?.id)
  }, [onClose, item]);

  return (
    <div className={`${styles.wrapper} border-4 flex items-center ${item.type === NotificationType.SUCCESS ? 'bg-green-400 border-green-500' : item.type === NotificationType.ERROR ? 'bg-red-400 border-red-300' : 'bg-transparent border-white border-opacity-40'}`}>
      <div className={`flex justify-center items-center ${styles.notificationIcon}`}>
        {item.type !== NotificationType.ERROR &&
          <Image src={'/icons/iconSuccess.svg'} alt="Success" width={49} height={49} />
        }
        {item.type === NotificationType.ERROR &&
          <Image src={'/icons/iconWarning.svg'} alt="Warning" width={49} height={49} />
        }
      </div>
      <hr className={`h-full bg-white bg-opacity-20 border-0 ${styles.delimiter}`}/>
      <div className={`flex flex-col space-between w-1/2 ${styles.body}`}>
        <p className={`font-bold text-sm text-white uppercase ${styles.title}`}>{item.text}</p>
        <p className={`font-bold text-sm text-white text-opacity-70 cursor-pointer ${styles.link}`}>{item.linkText.text}</p>
        {item.progress &&
          <div className={`relative w-full bg-white bg-opacity-20 rounded ${styles.progress}`}>
            <div className={`absolute top-0 left-0 h-full bg-white rounded h-full`} style={{width: `${item.progress}%`}} />
          </div>
        }
      </div>
      <div className={`flex justify-center items-center cursor-pointer ${styles.closeWrapper}`} onClick={handleClose}>
        <Image src={'/icons/iconCross.svg'} alt="Close" width={24} height={40} />
      </div>
    </div>
  )
}

export default Notification
