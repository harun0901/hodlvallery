import { Button, ButtonType, FormDetailsConfigModel, Modal, TokenForm } from "../../components"
import Image from 'next/image'

import styles from './swaptokens.module.scss'
// import { showToast } from "../../hooks/useToast";
import { useCallback, useMemo, useState } from "react";
import { TokenModel } from "../../types/TokenModel";
import { Sizes } from "../../types/Sizes";
import Input from "./Input"
import Toggle from "./toggle"
import { ModalPropsType } from "../../types/ModalPropsType";

import { BottomGrouping, SwapCallbackError } from '../../features/swap/styleds'
import { useIsSwapUnsupported } from '../../hooks/useIsSwapUnsupported'
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks'
import { useActiveWeb3React } from "../../hooks";
import {
  useExpertModeManager,
  useUserArcherETHTip,
  useUserArcherGasPrice,
  useUserArcherUseRelay,
  useUserSingleHopOnly,
  useUserSlippageTolerance,
  useUserTransactionTTL,
} from '../../state/user/hooks'
import { ARCHER_RELAY_URI } from '../../constants'
import Web3Connect from '../../components/Web3Connect'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { Field } from '../../state/swap/actions'
import { ChainId, Currency, CurrencyAmount, JSBI, Token, TradeType, Trade as V2Trade } from '@sushiswap/sdk'
import useIsArgentWallet from "../../hooks/useIsArgentWallet";
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback'
import { warningSeverity } from '../../functions/prices'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { computeFiatValuePriceImpact } from '../../functions/trade'
import { AutoRow, RowBetween, RowFixed } from '../../components/Row'
import { ButtonConfirmed, ButtonError } from '../../components/Button'
import Loader from '../../components/Loader'
import { useSwapCallback } from "../../hooks/useSwapCallback";
import confirmPriceImpactWithoutFee from '../../features/swap/confirmPriceImpactWithoutFee'
import ReactGA from 'react-ga'
import useENSAddress from "../../hooks/useENSAddress";
import Column, { AutoColumn } from '../../components/Column'
import ProgressSteps from '../../components/ProgressSteps'
import { maxAmountSpend } from '../../functions/currency'
import ConfirmSwapModal from "../../features/swap/ConfirmSwapModal";
import {useSelector} from "react-redux";

const formDetailsConfig: FormDetailsConfigModel = {
  title: 'SWAP DETAILS',
  infoColumns: [
    { title: 'RATE', value: ' 1 DAI = .0592 ETH' },
    { title: 'SLIPPAGE', value: '.50%' },
    { title: 'FEE', value: '.034 ETH' },
    { title: 'MIN. TOKEN', value: '1200 DAI' }
  ]
}

const SwapTokensModal: React.FC = () => {

  const { account, chainId } = useActiveWeb3React()

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
  const [useArcher] = useUserArcherUseRelay()
  const { independentField, typedValue, recipient } = useSwapState()
  const [singleHopOnly] = useUserSingleHopOnly()

  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: V2Trade<Currency, Currency, TradeType> | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  const archerRelay = chainId ? ARCHER_RELAY_URI?.[chainId] : undefined
  const doArcher = archerRelay !== undefined && useArcher

  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    allowedSlippage,
  } = useDerivedSwapInfo(doArcher)

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const maxInputAmount: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const handleMaxInput = useCallback(() => {

    maxInputAmount && onUserInput(Field.INPUT, maxInputAmount.toExact())
  }, [maxInputAmount, onUserInput])

  const swapIsUnsupported = useIsSwapUnsupported(currencies?.INPUT, currencies?.OUTPUT)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
          [Field.INPUT]: parsedAmount,
          [Field.OUTPUT]: parsedAmount,
        }
        : {
          [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
          [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
        },
    [independentField, parsedAmount, showWrap, trade]
  )
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)


  const routeNotFound = !trade?.route
  // check whether the user has approved the router on the input token
  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage, doArcher)

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  )

  const fiatValueInput = useUSDCValue(parsedAmounts[Field.INPUT])
  const fiatValueOutput = useUSDCValue(parsedAmounts[Field.OUTPUT])
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput)
  const [isExpertMode] = useExpertModeManager()
  const { address: recipientAddress } = useENSAddress(recipient)

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

  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact
    )
  }, [priceImpact, trade])

  const isArgentWallet = useIsArgentWallet()
  const [ttl] = useUserTransactionTTL()
  const [archerETHTip] = useUserArcherETHTip()

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode)

  const signatureData = undefined

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    recipient,
    signatureData,
    doArcher ? ttl : undefined
  )

  const isValid = !swapInputError
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const handleApprove = useCallback(async () => {
    await approveCallback()
  }, [approveCallback])

  const handleSwap = useCallback(() => {
    if (!swapCallback) {
      return
    }
    if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) {
      return
    }
    setSwapState({
      attemptingTxn: true,
      tradeToConfirm,
      showConfirm,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    swapCallback()
      .then((hash) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: undefined,
          txHash: hash,
        })

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
                ? 'Swap w/o Send + recipient'
                : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            singleHopOnly ? 'SH' : 'MH',
          ].join('/'),
        })

        ReactGA.event({
          category: 'Routing',
          action: singleHopOnly ? 'Swap with multihop disabled' : 'Swap with multihop enabled',
        })
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [
    swapCallback,
    priceImpact,
    tradeToConfirm,
    showConfirm,
    recipient,
    recipientAddress,
    account,
    trade?.inputAmount?.currency?.symbol,
    trade?.outputAmount?.currency?.symbol,
    singleHopOnly,
  ])

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency)
    },
    [onCurrencySelection]
  )

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection]
  )

  const handleAcceptChanges = useCallback(() => {
    setSwapState({
      tradeToConfirm: trade,
      swapErrorMessage,
      txHash,
      attemptingTxn,
      showConfirm,
    })
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({
      showConfirm: false,
      tradeToConfirm,
      attemptingTxn,
      swapErrorMessage,
      txHash,
    })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash])


  return (
    <Modal isOpen={true}
      title={{ firstLine: 'swap', secondLine: showSettings ? 'settings' : 'tokens', secondLineSize: Sizes.SMALL }}
      description={''}
      formDetailsConfig={formDetailsConfig}>
      <ConfirmSwapModal
        isOpen={showConfirm}
        trade={trade}
        originalTrade={tradeToConfirm}
        onAcceptChanges={handleAcceptChanges}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        allowedSlippage={allowedSlippage}
        onConfirm={handleSwap}
        swapErrorMessage={swapErrorMessage}
        onDismiss={handleConfirmDismiss}
        minerBribe={doArcher ? archerETHTip : undefined}
      />
      <div className={`h-full relative`}>
        <div className={`${styles.body} ${showSettings ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`h-full flex flex-col`}>
            <div className={`w-full bg-gray-200 border-b-10 border-gray-100 p-10px relative p-20px rounded-tr-60 ${styles.assetForm}`}>
              <TokenForm
                  onMax={handleMaxInput}
                  operationTitle={'swap'}
                  selectedToken={currencies[Field.INPUT]}
                  onChangeToken={handleInputSelect}
                  amount={formattedAmounts[Field.INPUT]}
                  onChangeAmount={handleTypeInput}
                  allowEditAmount={true}
                  readonly={approved} />
              <div className={`absolute bg-gray-200 rounded-full overflow-hidden flex items-center justify-center border-10 border-gray-100 ${styles.swapForm}`}
                onClick={switchTokens}>
                <Image src={'/icons/arrowDown.svg'} width={47} height={47} alt={'Arrow'} />
                <Image className={'rotate-180'} src={'/icons/arrowDown.svg'} width={47} height={47} alt={'Arrow'} />
              </div>
            </div>
            <div className={`w-full relative z-10 ${styles.receiveForm}`}>
              <TokenForm operationTitle={'receive'} selectedToken={currencies[Field.OUTPUT]} onChangeToken={handleOutputSelect} amount={formattedAmounts[Field.OUTPUT]} onChangeAmount={handleTypeOutput} allowEditAmount={false} readonly={approved} />
            </div>
            <div className={'flex justify-end items-center mt-10px px-40px pt-15px'}>
              {!reviewed &&
                <div className={'cursor-pointer mr-93px flex items-center'}>
                  {(!approved && !approving) ? (
                    <div className={'flex items-center'} onClick={toggleSettings}>
                      <p className={'font-medium text-xl text-black tracking-normal mr-22px'}>SETTINGS</p>
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
              <div>
                {swapIsUnsupported ? (
                  <Button disabled>
                    Unsupported Asset
                  </Button>
                ) : !account ? (
                  <Web3Connect />
                ) : showWrap ? (
                  <Button disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP
                        ? "Wrap"
                        : wrapType === WrapType.UNWRAP
                          ? "Unwrap"
                          : null)}
                  </Button>
                ) : routeNotFound && userHasSpecifiedInputOutput ? (
                  <div style={{ textAlign: 'center' }}>
                    <div className="mb-1">Insufficient liquidity for this trade</div>
                    {singleHopOnly && <div className="mb-1">Try enabling multi-hop trades</div>}
                  </div>
                ) : showApproveFlow ? (
                  <RowBetween>
                    {approvalState !== ApprovalState.APPROVED && (
                      <ButtonConfirmed
                        onClick={handleApprove}
                        disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                      >
                        {approvalState === ApprovalState.PENDING ? (
                          <AutoRow gap="6px" justify="center">
                            Approving <Loader stroke="white" />
                          </AutoRow>
                        ) : (
                          `Approve ${currencies[Field.INPUT]?.symbol}`
                        )}
                      </ButtonConfirmed>
                    )}
                    {approvalState === ApprovalState.APPROVED && (
                      <ButtonError
                        onClick={() => {
                          if (isExpertMode) {
                            handleSwap()
                          } else {
                            setSwapState({
                              tradeToConfirm: trade,
                              attemptingTxn: false,
                              swapErrorMessage: undefined,
                              showConfirm: true,
                              txHash: undefined,
                            })
                          }
                        }}
                        disabled={
                          !isValid || approvalState !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                        }
                        error={isValid && priceImpactSeverity > 2}
                      >
                        {priceImpactSeverity > 3 && !isExpertMode
                          ? `Price Impact High`
                          : priceImpactSeverity > 2
                            ? `Swap Anyway`
                            : `Swap`}
                      </ButtonError>
                    )}
                  </RowBetween>
                ) : (
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap()
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        })
                      }
                    }}
                    disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                    error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                  >
                    {swapInputError
                      ? swapInputError
                      : priceImpactSeverity > 3 && !isExpertMode
                        ? `Price Impact Too High`
                        : priceImpactSeverity > 2
                          ? `Swap Anyway`
                          : `Swap`}
                  </ButtonError>
                )}
                {showApproveFlow && (
                  <Column style={{ marginTop: '1rem' }}>
                    <ProgressSteps steps={[approvalState === ApprovalState.APPROVED]} />
                  </Column>
                )}
                {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              </div>

              {/* <Button disabled={!filled} onClick={handleAction} notClickable={approving}>
                <p className={approving ? 'text-opacity-50' : ''}>{ctaText}</p>
              </Button> */}
            </div>
          </div>
        </div>
        <div className={`${styles.body} ${!showSettings ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className={`h-full flex flex-col py-22px pl-55px pr-37px`}>
            <Button type={ButtonType.GHOST}
              size={Sizes.SMALL}
              leftIcon={<Image src={'/icons/arrowLeft.svg'} alt={'Back'} width={16} height={24} />}
              onClick={toggleSettings}>
              <p className={'pl-16px'}>BACK</p>
            </Button>
            <div className={'mt-70px'}>
              <div className={'mb-31px'}>
                <Input
                  title={'Price Tolerance'}
                  suffix={'%'}
                  placeholder={'0'}
                  value={tolerance}
                  onChange={(val) => setTolerance(val)}
                  manageBlock={<button className={`${styles.yellowBtn}`}>AUTO</button>}
                />
              </div>
              <div className={'mb-31px'}>
                <Input
                  title={'Max Swap Time'}
                  suffix={'mins'}
                  placeholder={'0'}
                  value={maxSwapTime}
                  onChange={(val) => setMaxSwapTime(val)}
                  manageBlock={<button className={`${styles.yellowBtn}`}>MAX</button>}
                />
              </div>
              <Input
                title={'Disable Multiple Swaps'}
                readonly={true}
                placeholder={'true'}
                value={disableMultiSwaps ? 'Yes' : 'No'}
                manageBlock={<Toggle enabled={disableMultiSwaps} onChange={setDisableMultiSwaps} />}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default SwapTokensModal
