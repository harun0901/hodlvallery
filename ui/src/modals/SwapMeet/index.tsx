import {Modal, ModalMenuItem} from "../../components"
import {ApplicationModal} from "../../state/modals/actions";

import styles from './swapmeet.module.scss'
import {Sizes} from "../../types/Sizes";
import {useCallback, useMemo} from "react";
import useModals from "../../state/modals/hooks";
import {ModalPropsType} from "../../types/ModalPropsType";
import {SwapMeet} from "../index";
import {useRouter} from "next/router";
import {MenuItemTypeModel} from "../../components/Menu";

interface LinkItemModal {
  label: string;
  link?: ApplicationModal | string;
  type: MenuItemTypeModel;
}

interface SwapMeetModalProps {
  swapPageLink: string;
  pairsPageLink: string;
  poolsPageLink: string;
  tokensPageLink: string;
}

const SwapMeetModal: React.FC<SwapMeetModalProps> = ({swapPageLink, pairsPageLink, poolsPageLink, tokensPageLink  }) => {
  const router = useRouter();
  const { closeModals, openModal } = useModals();

  const list: LinkItemModal[] = useMemo(() => [
    { label: 'swap tokens', type: MenuItemTypeModel.LINK, link: swapPageLink },
    { label: 'view pairs', type: MenuItemTypeModel.LINK, link: pairsPageLink },
    { label: 'view tokens', type: MenuItemTypeModel.LINK, link: tokensPageLink },
    { label: 'view pools', type: MenuItemTypeModel.LINK, link: poolsPageLink },
    { label: 'property details', type: MenuItemTypeModel.LINK }
  ], [pairsPageLink, poolsPageLink, tokensPageLink])

  const selectSwapModal = useCallback((item: LinkItemModal): void => {
    closeModals();
    if (item.link) {
      if (item.type === MenuItemTypeModel.MODAL) {
        openModal(item.link as ApplicationModal);
      }
      if (item.type === MenuItemTypeModel.LINK) {
        router.push(`${item.link}`);
      }
    }
  }, [closeModals, openModal, router]);

  return (
    <Modal isOpen={true}
           title={{firstLine:'swap', secondLine: 'meet'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           size={Sizes.SMALL}
           mainIconName={"SwapMeet"}>
      <div className={`h-full flex flex-col ${styles.form}`}>
        {list.map((item, index) => (
          <div className={'mb-20px'} key={index}>
            <ModalMenuItem label={item.label} onSelect={() => selectSwapModal(item)} />
          </div>
        ))}
      </div>
    </Modal>
  )
}

export default SwapMeetModal
