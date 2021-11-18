/* eslint-disable jsx-a11y/alt-text */
import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import styles from "./tokenDropdown.module.scss"
import { Sizes } from "../../types/Sizes";
import { TokenModel } from "../../types/TokenModel";
import AddToken from './addToken'
import SelectTokens from './selectTokens'
import ManageTokens from './manageTokens'
import ManageList from './manageList'

export enum TokenDropdownTypes {
  TOKEN,
  INPUT_STEPPER
}

interface TokenDropdownProps {
  selectedToken?: any;
  operation?: string;
  onSelectToken?: (token: TokenModel) => void;
  amount?: string;
  onChangeAmount?: (amount: string) => void;
  allowEditAmount?: boolean;
  readonly: boolean;
  size?: Sizes;
  suffix?: string;
  type?: TokenDropdownTypes;
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  selectedToken,
  operation,
  onSelectToken,
  amount,
  onChangeAmount,
  allowEditAmount = false,
  readonly,
  suffix = '',
  type = TokenDropdownTypes.TOKEN,
  size = Sizes.MEDIUM }) => {
  const [expand, setExpand] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showManageTokenForm, setShowManageTokenForm] = useState(false);
  const [showManageListForm, setShowManageListForm] = useState(false);
  const [addableToken, setAddableToken] = useState<TokenModel>();

  const inputRef = useRef();

  const toggle = useCallback(() => {
    if (expand) {
      setShowAddForm(false);
      setShowManageTokenForm(false);
      setShowManageListForm(false);
    }

    setExpand(!expand)
  }, [expand])

  const showBack = useMemo(() => {
    return showAddForm || showManageTokenForm || showManageListForm;
  }, [showAddForm, showManageTokenForm, showManageListForm]);

  const title = useMemo(() => {
    return showAddForm ? 'Add Token' : showManageTokenForm ? 'Manage tokens' : showManageListForm ? 'Manage Lists' : 'Select Token'
  }, [showAddForm, showManageTokenForm, showManageListForm])

  const toggleAddForm = useCallback((token?: TokenModel) => {
    if (!showAddForm && token) {
      setAddableToken(token);
    }
    setShowAddForm(!showAddForm);
  }, [showAddForm]);

  const goBack = useCallback(() => {
    if (showAddForm) {
      setShowAddForm(false);
    }

    if (showManageTokenForm) {
      setShowManageTokenForm(false);
    }

    if (showManageListForm) {
      setShowManageListForm(false);
    }
  }, [showAddForm, showManageTokenForm, showManageListForm]);

  const handleChangeAmount = useCallback((val: string): void => {
    onChangeAmount && onChangeAmount(val)
  }, [onChangeAmount])

  const handleSelectToken = useCallback((token: TokenModel): void => {
    onSelectToken && onSelectToken(token);
    setExpand(false)
  }, [onSelectToken])

  const increaseAmount = useCallback((val: number): void => {
    if (!isNaN(Number(amount))) {
      handleChangeAmount(`${Number(amount) + val}`);
    } else {
      handleChangeAmount(`0`);
    }
  }, [amount, handleChangeAmount])

  return (
    <div className={`relative z-20 ${styles.formWrapper} ${type === TokenDropdownTypes.TOKEN ? (selectedToken ? (readonly ? styles.formWrapperShortReadonly : styles.formWrapperShort) : styles.formWrapperLong) : ''} ${size === Sizes.SMALL ? styles.formWrapperSmall : ''}`}>
      <div className={`border-white w-full absolute top-0 left-0 overflow-hidden ${styles.form} ${expand ? styles.formOpened : ''} ${readonly ? 'bg-transparent border-0' : `border-3 bg-gray-220 ${styles.formShadowed}`}`}>
        <div className={`relative flex items-center justify-center w-full px-14px cursor-pointer ${styles.placeholderRow}`}>
          {(showBack && !readonly) &&
            <div className={`absolute h-full flex items-center pt-15px ${styles.backArrowWrapper}`} onClick={goBack}>
              <Image src={'/icons/arrowLeftTiny.svg'} width={12} height={20} />
            </div>
          }
          {selectedToken || type === TokenDropdownTypes.INPUT_STEPPER ? (
            <div className={`flex flex-col items-end w-full ${readonly ? 'pr-31px pt-13px' : 'pr-81px pt-6px'}`}>
              {operation &&
                <p className={'font-medium text-xl text-gray-400 uppercase text-opacity-60 tracking-normal'}>{operation}</p>
              }
              <div className={'flex items-baseline justify-end'}>
                <input className={`font-medium text-34px text-gray-400 text-right -mt-7px tracking-normal bg-transparent ${styles.amountInput}`}
                  readOnly={!allowEditAmount || readonly}
                  type="text"
                  value={amount || ''}
                  placeholder={'0'}
                  onChange={(e) => handleChangeAmount(e.target.value)} />
                {suffix &&
                  <span className={'font-medium text-34px text-gray-400 tracking-normal leading-8'}>{suffix}</span>
                }
              </div>
            </div>
          ) : (
            <p className={`uppercase font-medium text-gray-400 text-opacity-60 tracking-normal 
            ${expand ? `pt-21px ${styles.placeholderOpen}` : `pt-15px ${styles.placeholder}`}
            ${!showAddForm && !expand ? 'pr-17px' : ''}`}>
              {title}
            </p>
          )}
          {(!readonly && type === TokenDropdownTypes.TOKEN) &&
            <div className={`rounded-full absolute top-0 h-full mt-17px ${styles.arrowWrapper} ${expand ? `shadow-none ${styles.arrowWrapperExpanded}` : `bg-white ${styles.arrowWrapperDefault}`}`}
              onClick={toggle}>
              <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity pt-7px ${expand ? 'opacity-0' : 'opacity-1'}`}>
                <Image className={'-rotate-90'} src={'/icons/arrowLeft.svg'} width={24} height={24} />
              </div>
              <div className={`absolute top-0 left-0 w-full h-full flex items-center justify-center transition-opacity pt-16px pr-10px ${expand ? 'opacity-1' : 'opacity-0'}`}>
                <Image className={'-rotate-90'} src={'/icons/iconCrossTiny.svg'} width={21} height={21} />
              </div>
            </div>
          }
          {(!readonly && type === TokenDropdownTypes.INPUT_STEPPER) &&
            <div className={`absolute top-0 right-0 h-full mt-16px mr-33px bg-transparent flex flex-col items-center justify-between ${styles.arrowsWrapper}`}>
              <div onClick={() => increaseAmount(1)}>
                <Image className={'rotate-90'} src={'/icons/arrowLeft.svg'} width={24} height={24} />
              </div>
              <div onClick={() => increaseAmount(-1)}>
                <Image className={'-rotate-90'} src={'/icons/arrowLeft.svg'} width={24} height={24} />
              </div>
            </div>
          }
        </div>
        <div className={'w-full relative'}>
          <div className={`${styles.formBody} ${!showAddForm && !showManageTokenForm && !showManageListForm ? styles.formBodyShow : styles.formBodyHide}`}>
            <SelectTokens onAdd={toggleAddForm} onSelect={handleSelectToken} onManageTokens={() => setShowManageTokenForm(true)} />
          </div>
          <div className={`${styles.formBody} ${showAddForm ? styles.formBodyShow : styles.formBodyHide}`}>
            <AddToken token={addableToken} onAdd={toggleAddForm} />
          </div>
          <div className={`${styles.formBody} ${showManageTokenForm ? styles.formBodyShow : styles.formBodyHide}`}>
            <ManageTokens onManageList={() => {
              setShowManageTokenForm(false);
              setShowManageListForm(true);
            }} />
          </div>
          <div className={`${styles.formBody} ${showManageListForm ? styles.formBodyShow : styles.formBodyHide}`}>
            <ManageList onManageTokens={() => {
              setShowManageTokenForm(true);
              setShowManageListForm(false);
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenDropdown
