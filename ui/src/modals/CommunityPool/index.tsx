import {Modal, ModalMenuItem} from "../../components"
import {ApplicationModal} from "../../state/modals/actions";

import styles from './communityPool.module.scss'
import {Sizes} from "../../types/Sizes";
import {useCallback} from "react";
import useModals from "../../state/modals/hooks";
import {MenuItemTypeModel} from "../../components/Menu";
import {useRouter} from "next/router";

interface LinkItemModal {
  label: string;
  link?: ApplicationModal | string;
  type: MenuItemTypeModel;
}

const list: LinkItemModal[] = [
  { label: 'add pool', type: MenuItemTypeModel.LINK, link: '/pool/add' },
  { label: 'view my pools', type: MenuItemTypeModel.LINK, link: '/pool/myview' },
  { label: 'view all pools', type: MenuItemTypeModel.LINK, link: '/pool/allview' },
  { label: 'property details', type: MenuItemTypeModel.LINK }
]

const CommunityPoolModal: React.FC = () => {
  const { closeModals, openModal } = useModals();
  const router = useRouter();

  const selectModal = useCallback((item: LinkItemModal): void => {
    closeModals();
    if (item.type === MenuItemTypeModel.LINK) {
      router.push(`${item.link}`);
    }
  }, [closeModals, openModal]);

  return (
    <Modal isOpen={true} title={{firstLine:'community', secondLine: 'pool'}} description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'} size={Sizes.SMALL}>
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

export default CommunityPoolModal;
