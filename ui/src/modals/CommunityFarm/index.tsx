import {Modal, ModalMenuItem} from "../../components"

import styles from './communityFarm.module.scss'
import {Sizes} from "../../types/Sizes";
import {useCallback} from "react";
import useModals from "../../state/modals/hooks";
import {useRouter} from "next/router";

import { useActiveWeb3React } from "../../hooks";
interface LinkItemModal {
  label: string;
  link?: string;
}

interface FarmLinkItem extends LinkItemModal {
  count?: number;
}

const list: FarmLinkItem[] = [
  { label: 'view my farms', link: '/farm/myfarm', count: 0 },
  { label: 'view all farms', link: '/farm/allfarm', count: 4 },
  { label: 'property details' }
]

const CommunityFarmModal: React.FC = () => {
  const router = useRouter();
  const { closeModals, openModal } = useModals();

  const { chainId, account, connector } = useActiveWeb3React();


  const selectModal = useCallback((item: LinkItemModal): void => {
    closeModals();
    if (item.link) {
      router.push(item.link)
    }
  }, [closeModals, openModal, router]);

  return (
    <Modal isOpen={true}
           title={{firstLine:'community', secondLine: 'farm'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'} size={Sizes.SMALL}>
      <div className={`h-full flex flex-col justify-center ${styles.form}`}>
        { account }
        {list.map((item, index) => (
          <div className={'mb-20px'} key={index}>
            <ModalMenuItem label={item.label} onSelect={() => selectModal(item)}
                           suffix={item.hasOwnProperty('count')
                             ? <p className={"ml-11px text-blue-400 text-opacity-60 tracking-normal font-medium text-xl"}>{item.count}</p>
                             : undefined} />
          </div>
          
        ))}
      </div>
    </Modal>
  )
}

export default CommunityFarmModal;
