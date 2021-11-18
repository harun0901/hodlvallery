import Image from 'next/image'
import {Menu, Notification, Map, Popups} from "../../components"

import styles from './default.module.scss'
import {NotificationModel, NotificationType} from "../../components/Notification";
import {ReactNode} from "react";
import {useRouter} from "next/router";

const notificationExample: NotificationModel = {
  text: 'SWAPPED .002 ETH FOR 1,234.5 DAI.',
  linkText: {
    text: 'View Transaction',
    link: '#'
  },
  progress: 20,
  type: NotificationType.NORMAL
}

interface LayoutProps {
  blurBg?: boolean;
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, blurBg }) => {
  const router = useRouter();

  return (
    <div className={`z-0 flex flex-col items-center w-full min-h-screen overflow-x-hidden overflow-y-auto bg-valley-pattern bg-no-repeat bg-cover bg-center relative`}>
      <div className={`absolute overflow-visible z-50 ${styles.logoWrapper}`} onClick={() => router.push("/")}>
        <Image src={'/icons/HodlLogo.svg'} alt="HODL Valley" layout={'fill'} />
      </div>
      <div className={`absolute z-50 ${styles.menuWrapper}`}>
        <Menu />
      </div>
      <div className={`absolute ${styles.notificationWrapper}`}>
        <Notification item={notificationExample} />
      </div>
      <div className={`absolute ${styles.mapWrapper}`}>
        <Map />
      </div>
      <Popups />
      <main className={`w-full min-h-screen pb-50px ${blurBg ? 'blurWrapper' : ''} ${styles.contentWrapper}`}>
        {children}
      </main>
    </div>
  )
}

export default Layout
