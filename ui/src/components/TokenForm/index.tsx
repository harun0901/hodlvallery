import { TokenModel } from "../../types/TokenModel";
import Image from 'next/image'
import { TokenDropdown } from "../index";

import styles from "./tokenForm.module.scss"
import CurrencyLogo from "../CurrencyLogo";
import Balance from "../CurrencyBalance";
import { useActiveWeb3React } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import { Currency } from '@sushiswap/sdk'
import useUSDCValue from "../../hooks/useUSDCPrice";
import Typography from "../Typography";
import React from "react";


interface TokenFormProps {
  operationTitle?: string;
  selectedToken?: Currency;
  onChangeToken: (token: TokenModel) => void;
  amount?: string;
  onChangeAmount?: (amount: string) => void;
  allowEditAmount?: boolean;
  readonly?: boolean;
  onMax?: () => void
}

const TokenForm: React.FC<TokenFormProps> = ({
  operationTitle,
  selectedToken,
  onChangeToken,
  amount,
  onChangeAmount,
  onMax,
  allowEditAmount = false,
  readonly = false }) => {
  const { account } = useActiveWeb3React();
  const balance = useCurrencyBalance(account ?? undefined, selectedToken)
  const balanceUSDCValue = useUSDCValue(selectedToken)

  return (
    <div className={`w-full flex items-center ${selectedToken ? 'justify-between' : 'justify-end'}`}>
      {selectedToken && balance ? <div className={'flex flex-col'}>
        <div className={'flex items-center'}>
          <CurrencyLogo currency={selectedToken} size={32} />
          {/* <Image src={selectedToken!.icon} width={28} height={43} alt={'Asset Icon'} /> */}
          <div className={'flex flex-col pl-25px relative'}>
            <p className={'uppercase font-medium text-34px text-gray-400 text-opacity-60 tracking-normal'}>{selectedToken.symbol}</p>
            <p className={'uppercase font-medium text-34px text-gray-400 tracking-normal -mt-14px'}>{selectedToken.name}</p>
          </div>
        </div>
        <div className={`flex items-center pl-56px -mt-4px`}>
          <p className={'uppercase font-medium text-xs text-gray-350 tracking-normal'}>BALANCE</p>
          <p className={'uppercase font-medium text-xs text-gray-350 tracking-normal pl-11px whitespace-nowrap'}>{balance.toSignificant(4)} {selectedToken.symbol} = {(parseFloat(balance.toString()) * 0).toFixed(2)} USD</p>
        </div>
      </div>: null
      }
      <div className={'relative z-50 -mt-6px -mr-5px'}>
        <TokenDropdown operation={operationTitle}
          selectedToken={selectedToken}
          onSelectToken={onChangeToken}
          amount={amount}
          onChangeAmount={onChangeAmount}
          allowEditAmount={allowEditAmount}
          readonly={readonly} />
        {(allowEditAmount && !readonly) &&
          <div className={`absolute flex justify-center items-center z-10 ${styles.maxBtnWrapper}`}>
            <button onClick={onMax} className={`bg-yellow-400 text-white text-sm uppercase font-medium tracking-normal ${styles.maxBtn}`}>MAX</button>
          </div>
        }
      </div>
    </div>
  )
}

export default TokenForm
