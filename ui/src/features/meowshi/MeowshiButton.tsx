import { ApprovalState, useActiveWeb3React } from '../../hooks'
import { Field, MeowshiState } from '../../pages/tools/meowshi'
import React, { FC, useMemo, useState } from 'react'
import { SUSHI, XSUSHI } from '../../constants'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../modals/TransactionConfirmationModal'

import Button from '../../components/Button'
import { ChainId } from '@sushiswap/sdk'
import Dots from '../../components/Dots'
import { ethers } from 'ethers'
import { tryParseAmount } from '../../functions'
import useMeowshi from '../../hooks/useMeowshi'
import { useTokenBalance } from '../../state/wallet/hooks'

interface MeowshiButtonProps {
  meowshiState: MeowshiState
}

const MeowshiButton: FC<MeowshiButtonProps> = ({ meowshiState }) => {
  const { currencies, meow: doMeow, fields } = meowshiState
  const [modalState, setModalState] = useState({
    attemptingTxn: false,
    txHash: '',
    open: false,
  })
  const { account, chainId } = useActiveWeb3React()
  const sushiBalance = useTokenBalance(account, SUSHI[ChainId.MAINNET])
  const xSushiBalance = useTokenBalance(account, XSUSHI)
  const { approvalState, approve, meow, unmeow, meowSushi, unmeowSushi } = useMeowshi(
    currencies[Field.INPUT] === SUSHI[ChainId.MAINNET]
  )
  const balance = useTokenBalance(account, currencies[Field.INPUT])
  const parsedInputAmount = tryParseAmount(fields[Field.INPUT], currencies[Field.INPUT])
  const parsedOutputAmount = tryParseAmount(fields[Field.OUTPUT], currencies[Field.OUTPUT])

  const closeModal = () => {
    setModalState((prevState) => ({
      ...prevState,
      open: false,
    }))
  }

  const handleSubmit = async () => {
    setModalState({
      attemptingTxn: true,
      open: true,
      txHash: '',
    })

    let tx
    if (doMeow) {
      if (currencies[Field.INPUT]?.symbol === 'SUSHI') {
        tx = await meowSushi({
          value: ethers.utils.parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          decimals: sushiBalance.currency.decimals,
        })
      }
      if (currencies[Field.INPUT]?.symbol === 'xSUSHI') {
        tx = await meow({
          value: ethers.utils.parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          decimals: xSushiBalance.currency.decimals,
        })
      }
    } else {
      if (currencies[Field.OUTPUT]?.symbol === 'SUSHI') {
        tx = await unmeowSushi({
          value: ethers.utils.parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          decimals: xSushiBalance.currency.decimals,
        })
      }
      if (currencies[Field.OUTPUT]?.symbol === 'xSUSHI') {
        tx = await unmeow({
          value: ethers.utils.parseUnits(fields[Field.INPUT], sushiBalance.currency.decimals),
          decimals: xSushiBalance.currency.decimals,
        })
      }
    }

    if (tx?.hash) {
      setModalState((prevState) => ({
        ...prevState,
        attemptingTxn: false,
        txHash: tx.hash,
      }))
    } else {
      closeModal()
    }
  }

  const buttonDisabledText = useMemo(() => {
    if (!balance) return `Loading Balance`
    if (parsedInputAmount?.greaterThan(balance)) return `Insufficient Balance`
    if (!parsedInputAmount?.greaterThan(0)) return `Please enter an amount`
    return null
  }, [balance, parsedInputAmount])

  if (!account)
    return (
      <Button onClick={approve} disabled={true}>
        Connect to wallet
      </Button>
    )

  if (chainId !== ChainId.MAINNET)
    return (
      <Button onClick={approve} disabled={true}>
        Network not supported yet
      </Button>
    )

  if (approvalState === ApprovalState.PENDING)
    return (
      <Button disabled={true}>
        <Dots>Approving</Dots>
      </Button>
    )

  if (approvalState === ApprovalState.NOT_APPROVED)
    return (
      <Button onClick={approve} disabled={!!buttonDisabledText}>
        {buttonDisabledText || `Approve`}
      </Button>
    )

  if (approvalState === ApprovalState.APPROVED)
    return (
      <>
        <TransactionConfirmationModal
          isOpen={modalState.open}
          onDismiss={closeModal}
          attemptingTxn={modalState.attemptingTxn}
          hash={modalState.txHash}
          content={() => (
            <ConfirmationModalContent
              title={`Confirm convert`}
              onDismiss={closeModal}
              topContent={() => <span />}
              bottomContent={() => <span />}
            />
          )}
          pendingText={`Converting ${parsedInputAmount?.toSignificant(6, { groupSeparator: ',' })} ${
              meowshiState.currencies[Field.INPUT]?.symbol
            } for ${parsedOutputAmount?.toSignificant(6, { groupSeparator: ',' })} ${
              meowshiState.currencies[Field.OUTPUT]?.symbol
            }`
          }
        />
        <Button onClick={handleSubmit} disabled={!!buttonDisabledText}>
          {buttonDisabledText || `Convert`}
        </Button>
      </>
    )
}

export default MeowshiButton
