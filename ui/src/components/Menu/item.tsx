import styles from './menu.module.scss'
import {MenuItemModel, MenuItemTypeModel} from "./index";
import {useCallback, useState} from "react";
import useModals from '../../state/modals/hooks'
import {ApplicationModal} from "../../state/modals/actions";
import { useRouter } from 'next/router'

const Item: React.FC<{item: MenuItemModel}> = ({item}) => {
  const router = useRouter();

  const [showDropdown, setShowDropdown] = useState(false);
  const { openModal } = useModals();

  const showMenu = useCallback(() => {
    setShowDropdown(!showDropdown);
  }, [showDropdown]);

  const handleItemClick = useCallback((item: MenuItemModel): void => {
    setShowDropdown(false);

    if (item.type && item.link !== undefined) {
      if (item.type === MenuItemTypeModel.EXTERNAL_LINK) {
        window.open(item.link.toString(), '_blank');
      }

      if (item.type === MenuItemTypeModel.MODAL) {
        openModal(item.link as ApplicationModal);
      }

      if (item.type === MenuItemTypeModel.LINK) {
        router.push(`${item.link}`);
      }
    }
  }, [openModal, router]);

  return (
    <div className={'relative'}
         onMouseEnter={ ()=> setShowDropdown(true) }
         onMouseLeave={ ()=> setShowDropdown(false) }>
      <p className={`${styles.menuLink} cursor-pointer`} onClick={() => handleItemClick(item)}>{item.label}</p>
      {!!item?.subItems?.length &&
        <div className={'absolute top-0 left-50 inset-x-2/4 z-10'}>
          <div className={`${styles.menuDropdown} px-9px absolute border-white flex flex-col justify-end items-center bg-opacity-100 transition-all overflow-hidden duration-500 ease-in-out ${showDropdown ? `${styles.menuDropdownActive} max-h-screen border-4` : 'border-0 max-h-0 py-0'}`}>
            {item.subItems.map((subitem, index) => (
              <div className={`${styles.menuSubLinkWrapper} w-full bg-transparent transition cursor-pointer last:mb-0`} key={index} onClick={() => handleItemClick(subitem)}>
                <p className={styles.menuLink}>{subitem.label}</p>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default Item
