import {useCallback} from "react";
import styles from "./swaptokens.module.scss"

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
                                         enabled,
                                         onChange}) => {

  const handleChange = useCallback(() => {
    onChange(!enabled);
  }, [onChange, enabled]);

  return (
    <div className={`rounded-full bg-transparent bg-opacity-40 border-3 border-gray-310 relative flex justify-between items-center px-11px ${styles.toggleWrapper}`}>
      <span className={'uppercase font-medium text-sm text-gray-310'}>ON</span>
      <span className={'uppercase font-medium text-sm text-gray-310'}>OFF</span>
      <div className={`absolute top-0 left-0 h-full rounded-full bg-gray-400 ${styles.toggleClicker} ${enabled ? styles.toggleClickerOn : styles.toggleClickerOff}`}
           onClick={handleChange}>
        <div className={`flex justify-center items-center absolute top-0 left-0 w-full h-full transition-opacity ${enabled ? 'opacity-100' : 'opacity-0'}`}>
          <span className={'uppercase font-medium text-sm text-white'}>ON</span>
        </div>
        <div className={`flex justify-center items-center absolute top-0 left-0 w-full h-full transition-opacity ${enabled ? 'opacity-0' : 'opacity-100'}`}>
          <span className={'uppercase font-medium text-sm text-white'}>OFF</span>
        </div>
      </div>
    </div>
  )
}

export default Toggle;
