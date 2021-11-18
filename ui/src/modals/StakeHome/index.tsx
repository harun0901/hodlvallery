import {Modal, ModalMenuItem} from "../../components"
import {ApplicationModal} from "../../state/modals/actions";

import styles from './stakeHome.module.scss'
import {Sizes} from "../../types/Sizes";
import {useCallback} from "react";
import useModals from "../../state/modals/hooks";
import {ModalPropsType} from "../../types/ModalPropsType";
import {useRouter} from "next/router";

interface LinkItemModal {
  label: string;
  link?: string;
}

const list: LinkItemModal[] = [
  { label: 'add stake', link: '/stake/add' },
  { label: 'remove stake', link: '/stake/remove' },
  { label: 'view staking stats' },
  { label: 'property details' }
]

const StakeHomeModal: React.FC = () => {
  const router = useRouter();
  const { closeModals, openModal } = useModals();

  const selectModal = useCallback((item: LinkItemModal): void => {
    closeModals();
    router.push(`${item.link}`);
    // openModal(item.link);
  }, [closeModals, openModal]);

  return (
    <Modal isOpen={true}
           title={{firstLine:'community', secondLine: 'mine'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           size={Sizes.SMALL}
           mainIconName={"Mine"}>
      <div className={`h-full flex flex-col justify-center ${styles.form}`}>
        {list.map((item, index) => (
          <div className={'mb-20px'} key={index}>
            <ModalMenuItem label={item.label} onSelect={() => selectModal(item)} />
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default StakeHomeModal;
