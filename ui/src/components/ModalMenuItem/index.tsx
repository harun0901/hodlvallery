import styles from './modalMenuItem.module.scss'
import {ReactNode, useCallback} from "react";

interface ModalMenuItemProps {
  label: string;
  onSelect?: () => void;
  disabled?: boolean;
  suffix?: ReactNode;
}

const ModalMenuItem: React.FC<ModalMenuItemProps> = ({label, onSelect, disabled = false, suffix}) => {
  const handleSelect = useCallback(() => {
    onSelect && onSelect();
  }, [onSelect]);

  return (
    <div className={`border-bg-white rounded-full flex items-center cursor-pointer transition-opacity text-opacity-60 text-gray-400 hover:text-opacity-100 hover:bg-white hover:border-white ${disabled ? 'bg-gray-250 border-0' : 'bg-gray-50 border-3'} ${styles.btn}`}
         onClick={handleSelect}>
      <p className={'uppercase text-xl font-medium'}>{label}</p>
      {suffix}
    </div>
  )
}

export default ModalMenuItem
