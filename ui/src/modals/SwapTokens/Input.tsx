import {ChangeEvent, ReactNode, useCallback, useEffect, useRef} from "react";
import styles from "./swaptokens.module.scss"

interface InputProps {
  title: string;
  value: string;
  onChange?: (val: string) => void;
  suffix?: string;
  manageBlock?: ReactNode;
  placeholder?: string;
  readonly?: boolean;
}

const Input: React.FC<InputProps> = ({
                                       title,
                                       value,
                                       onChange,
                                       suffix,
                                       manageBlock,
                                       placeholder= '',
                                       readonly = false}) => {
  const inputRef = useRef();

  const handleChange = useCallback((e?: ChangeEvent<HTMLInputElement>) => {
    const val = e ? e.target.value : value;
    if (inputRef.current) {
      const tempDiv = document.createElement('div');
      tempDiv.innerText = val;
      // tempDiv.style.cssText = window.getComputedStyle(inputRef.current, "").cssText;
      const styles = window.getComputedStyle(inputRef.current);
      if (styles.cssText !== '') {
        tempDiv.style.cssText = styles.cssText;
      } else {
        tempDiv.style.cssText = Object.values(styles).reduce(
          (css, propertyName) =>
            `${css}${propertyName}:${styles.getPropertyValue(
              propertyName
            )};`
        );
      }
      tempDiv.style.opacity = '0';
      tempDiv.style.overflow = 'hidden';
      tempDiv.style.maxHeight = '0';
      tempDiv.style.width = 'fit-content';
      document.body.appendChild(tempDiv);
      (inputRef.current as HTMLInputElement).style.width = `${tempDiv.clientWidth + 5}px`;
      document.body.removeChild(tempDiv);
    }

    onChange && onChange(val);
  }, [onChange, value]);

  useEffect(() => {
    handleChange();
  }, [handleChange]);

  return (
    <div className={`bg-white border-3 border-gray-220 h-100px rounded-full overflow-hidden bg-opacity-60 border-opacity-60 flex justify-between items-center pl-60px pt-8px pr-51px ${styles.inputBlock}`}>
      <div className={'flex flex-col'}>
        <p className={'capitalize font-medium text-xl text-gray-400 text-opacity-60 tracking-normal'}>{title}</p>
        <div className={'flex items-center -mt-2px pl-2px'}>
          <input type="text"
                 readOnly={readonly}
                 ref={inputRef}
                 className={`font-medium text-28px tracking-normal text-gray-400 bg-transparent ${styles.settingsInput}`}
                 value={value}
                 placeholder={placeholder}
                 onChange={handleChange}/>
          <span className={'font-medium text-28px text-gray-400 text-opacity-60 tracking-normal'}>{suffix}</span>
        </div>
      </div>
      {manageBlock &&
        <div className={'pb-8px'}>
          {manageBlock}
        </div>
      }
    </div>
  )
}

export default Input
