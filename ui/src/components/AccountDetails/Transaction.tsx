import React, { FC, useCallback, useMemo } from 'react'
import { DateTime } from "luxon";

import { ARCHER_RELAY_URI } from '../../constants'
import { AppDispatch } from '../../state'
import ExternalLink from '../ExternalLink'
import { TransactionDetails } from '../../state/transactions/reducer'
import { finalizeTransaction } from '../../state/transactions/actions'
import { getExplorerLink } from '../../functions/explorer'
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React'
import { useAllTransactions } from '../../state/transactions/hooks'
import { useDispatch } from 'react-redux'

const calculateSecondsUntilDeadline = (tx: TransactionDetails): number => {
  if (tx?.archer?.deadline && tx?.addedTime) {
    const millisecondsUntilUntilDeadline = tx.archer.deadline * 1000 - Date.now()
    return millisecondsUntilUntilDeadline < 0 ? -1 : Math.ceil(millisecondsUntilUntilDeadline / 1000)
  }
  return -1
}

const Transaction: FC<{ hash: string }> = ({ hash }) => {
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const dispatch = useDispatch<AppDispatch>()

  const tx = allTransactions?.[hash]
  console.log('TX: ', tx)
  const summary = tx?.summary
  const pending = !tx?.receipt
  const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
  const archer = tx?.archer
  const secondsUntilDeadline = useMemo(() => calculateSecondsUntilDeadline(tx), [tx])
  const mined = tx?.receipt && tx.receipt.status !== 1337
  const cancelled = tx?.receipt && tx.receipt.status === 1337
  const expired = secondsUntilDeadline === -1

  const cancelPending = useCallback(() => {
    const relayURI = ARCHER_RELAY_URI[chainId]
    if (!relayURI) return

    const body = JSON.stringify({
      method: 'archer_cancelTx',
      tx: archer?.rawTransaction,
    })
    fetch(relayURI, {
      method: 'POST',
      body,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ARCHER_API_KEY ?? '',
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        dispatch(
          finalizeTransaction({
            chainId,
            hash,
            receipt: {
              blockHash: '',
              blockNumber: 0,
              contractAddress: '',
              from: '',
              status: 1337,
              to: '',
              transactionHash: '',
              transactionIndex: 0,
            },
          })
        )
      })
      .catch((err) => console.error(err))
  }, [dispatch, chainId, archer, hash])

  const getFormattedDate = useCallback((date: number): string => {
    const luxonDate = DateTime.fromSeconds(date / 1000);
    const suffix = luxonDate.day === 1 ? 'st' : luxonDate.day === 2 ? 'nd' : luxonDate.day === 3 ? 'rd' : 'th'
    return `${luxonDate.toFormat("MMMM d")}${suffix} at ${luxonDate.toFormat("TT")}`
  }, []);

  if (!chainId) return null
  {/*<p className='text-gray-300 text-sm pl-2px underline'>Swapped {transaction.quantityFrom} {transaction.from} for {transaction.quantityTo} {transaction.to} on {getFormattedDate(transaction.timestamp)}</p>*/}

  return (
    <>
      <ExternalLink href={getExplorerLink(chainId, hash, 'transaction')} className="flex items-center gap-2">
        <p className='text-gray-300 text-sm pl-2px underline'>{summary ?? hash} on {getFormattedDate(tx.addedTime)}</p>
        {/*<Typography variant="sm" className="flex items-center hover:underline py-0.5">*/}
        {/*  {summary ?? hash} ↗*/}
        {/*</Typography>*/}
        {/*<Typography variant="sm" className="flex items-center hover:underline py-0.5">*/}
        {/*  {summary ?? hash} ↗*/}
        {/*</Typography>*/}
        {/*<div*/}
        {/*  className={classNames(*/}
        {/*    pending ? 'text-primary' : success ? 'text-green' : cancelled ? 'text-red' : 'text-red'*/}
        {/*  )}*/}
        {/*>*/}
        {/*  {pending ? (*/}
        {/*    <Loader />*/}
        {/*  ) : success ? (*/}
        {/*    <CheckCircleIcon width={16} height={16} />*/}
        {/*  ) : cancelled ? (*/}
        {/*    <XCircleIcon width={16} height={16} />*/}
        {/*  ) : (*/}
        {/*    <ExclamationIcon width={16} height={16} />*/}
        {/*  )}*/}
        {/*</div>*/}
      </ExternalLink>
      {/*{archer && (*/}
      {/*  <Typography variant="sm" weight={400} className="flex justify-between items-center text-decoration-none pb-1">*/}
      {/*    {`#${archer.nonce} - Tip ${CurrencyAmount.fromRawAmount(*/}
      {/*      Ether.onChain(ChainId.MAINNET),*/}
      {/*      archer.ethTip*/}
      {/*    ).toSignificant(6)} ETH`}*/}
      {/*    {pending ? (*/}
      {/*      <>*/}
      {/*        {secondsUntilDeadline >= 60 ? (*/}
      {/*          <span className="text-high-emphesis">&#128337; {`${Math.ceil(secondsUntilDeadline / 60)} mins`} </span>*/}
      {/*        ) : (*/}
      {/*          <span className="text-high-emphesis">&#128337; {`<1 min`} </span>*/}
      {/*        )}*/}
      {/*        <div className="cursor-pointer flex items-center" onClick={cancelPending}>*/}
      {/*          Cancel*/}
      {/*        </div>*/}
      {/*      </>*/}
      {/*    ) : cancelled ? (*/}
      {/*      <span className="text-red">Cancelled</span>*/}
      {/*    ) : (*/}
      {/*      !mined && expired && <span className="text-red">Expired</span>*/}
      {/*    )}*/}
      {/*  </Typography>*/}
      {/*)}*/}
    </>
  )
}

export default Transaction
