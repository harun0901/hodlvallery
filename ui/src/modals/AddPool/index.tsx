import { Button, FormDetailsConfigModel, Modal, TokenForm } from "../../components"
import Image from 'next/image'

import styles from './addPool.module.scss'
// import { showToast } from "../../hooks/useToast";
import { useCallback, useMemo, useState } from "react";
import { TokenModel } from "../../types/TokenModel";
import { ModalPropsType } from "../../types/ModalPropsType";

const formDetailsConfig: FormDetailsConfigModel = {
  title: 'POOL DETAILS',
  infoColumns: [
    { title: 'DATE ADDED', value: '12/1/2020' },
    { title: 'POOL SHARE', value: '23%' },
    { title: 'RATE', value: '1 ETH = .0592 DAI' },
    { title: 'RATE', value: '.0592 DAI = 1 ETH' }
  ]
}

const AddPoolModal: React.FC = () => {
  // const [fromToken, setFromToken] = useState<TokenModel>({
  //   name: 'Ethereum',
  //   symbol: 'ETH',
  //   price: 5182,
  //   icon: '/icons/assets/eth.svg',
  //   balance: 238.21,
  //   address: 'test'
  // })
  const [fromToken, setFromToken] = useState<TokenModel>()
  const [toToken, setToToken] = useState<TokenModel>()
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')

  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const [showSettings, setShowSettings] = useState(false);
  const [tolerance, setTolerance] = useState('.3');
  const [maxSwapTime, setMaxSwapTime] = useState('120');
  const [disableMultiSwaps, setDisableMultiSwaps] = useState(true);

  const filled = useMemo(() => {
    return fromAmount && fromToken && toToken;
  }, [fromToken, toToken, fromAmount]);

  const ctaText = useMemo(() => {
    if (reviewed) {
      return 'Confirm'
    }
    if (approved) {
      return 'Review';
    }
    if (!approved && filled && !approving) {
      return 'Approve';
    }
    if (approving) {
      return 'Approving...';
    }
    return 'enter details';
  }, [approved, approving, filled, reviewed])

  // showToast('Insufficient funds! Please enter an amount that is less than your balance.');

  const switchTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
  }, [fromToken, toToken]);

  const handleAction = useCallback(() => {
    if (filled) {
      if (!approving && !approved) {
        setApproving(true);

        setTimeout(() => {
          setApproving(false);
          setApproved(true);
        }, 3000);
      }
    }

    if (!reviewed && approved) {
      setReviewed(true)
    }

    if (reviewed) {
      // CONFIRM!!!
    }
  }, [filled, approving, approved, reviewed]);

  const toggleSettings = useCallback(() => {
    setShowSettings(!showSettings);
  }, [showSettings]);

  return (
    <Modal isOpen={true}
      title={{ firstLine: 'add', secondLine: 'pool' }}
      description={''}
      formDetailsConfig={formDetailsConfig} >
      <div className={`h-full relative`}>
        <div className={`${styles.body} ${showSettings ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`h-full flex flex-col`}>
            <div className={`w-full bg-gray-200 border-b-10 border-gray-100 p-10px relative p-20px rounded-tr-60 ${styles.assetForm}`}>
              {/* <TokenForm operationTitle={'add'} selectedToken={fromToken} onChangeToken={setFromToken} amount={fromAmount} onChangeAmount={setFromAmount} allowEditAmount={true} readonly={approved} /> */}
              <div className={`absolute bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border-10 border-gray-100 ${styles.swapForm}`}
                onClick={switchTokens}>
                <Image src={'/icons/plusSign.svg'} width={44} height={44} alt={'Plus'} />
              </div>
            </div>
            <div className={`w-full relative z-10 ${styles.receiveForm}`}>
              {/* <TokenForm operationTitle={'add'} selectedToken={toToken} onChangeToken={setToToken} amount={toAmount} onChangeAmount={setToAmount} allowEditAmount={true} readonly={approved} /> */}
            </div>
            <div className={'flex justify-end items-center mt-10px px-40px'}>
              {!reviewed &&
                <div className={'cursor-pointer mr-74px flex items-center'}>
                  {(!approved && !approving) ? (
                    <div onClick={toggleSettings}>
                      <Image src={'/icons/iconGear.svg'} width={33} height={33} alt={'Settings'} />
                    </div>
                  ) : (
                    <div className={'flex items-center mr-22px'}>
                      <p className={'uppercase text-xl text-green-350 font-medium tracking-normal mr-10px'}>Approved</p>
                      <Image src={'/icons/iconSuccessDark.svg'} width={25} height={25} alt={'Success'} />
                    </div>
                  )}
                </div>
              }
              <Button disabled={!filled} onClick={handleAction} notClickable={approving}>
                <p className={approving ? 'text-opacity-50' : ''}>{ctaText}</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal >
  )
}

export default AddPoolModal
