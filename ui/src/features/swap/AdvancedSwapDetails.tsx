import { ChainId, Currency, Ether, Percent, TradeType, Trade as V2Trade, CurrencyAmount } from '@sushiswap/sdk'
import React, { useMemo } from 'react'
import { RowBetween, RowFixed } from '../../components/Row'

import FormattedPriceImpact from './FormattedPriceImpact'
import SwapRoute from './SwapRoute'
import { computeRealizedLPFeePercent } from '../../functions/prices'

export interface AdvancedSwapDetailsProps {
  trade?: V2Trade<Currency, Currency, TradeType>
  allowedSlippage: Percent
  minerBribe?: string
}

export function AdvancedSwapDetails({ trade, allowedSlippage, minerBribe }: AdvancedSwapDetailsProps) {
  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined }

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade)
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent)

    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent)

    return { priceImpact, realizedLPFee }
  }, [trade])

  return !trade ? null : (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center justify-between">
        <SwapRoute trade={trade} />
      </div>

      <RowBetween>
        <RowFixed>
          <div className="text-sm text-secondary">
            {trade.tradeType === TradeType.EXACT_INPUT ? "Minimum received" : "Maximum sent"}
          </div>
        </RowFixed>
        <RowFixed>
          <div className="text-sm font-bold text-high-emphesis">
            {trade.tradeType === TradeType.EXACT_INPUT
              ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
              : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
          </div>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <div className="text-sm text-secondary">Price Impact</div>
        </RowFixed>
        <FormattedPriceImpact priceImpact={priceImpact} />
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <div className="text-sm text-secondary">Liquidity Provider Fee</div>
        </RowFixed>
        <div className="text-sm font-bold text-high-emphesis">
          {realizedLPFee
            ? `${realizedLPFee.divide(6).multiply(5).toSignificant(4)} ${realizedLPFee.currency.symbol}`
            : '-'}
        </div>
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <div className="text-sm text-secondary">xSUSHI Fee</div>
        </RowFixed>
        <div className="text-sm font-bold text-high-emphesis">
          {realizedLPFee ? `${realizedLPFee.divide(6).toSignificant(4)} ${realizedLPFee.currency.symbol}` : '-'}
        </div>
      </RowBetween>

      <RowBetween>
        <RowFixed>
          <div className="text-sm text-secondary">Slippage tolerance</div>
        </RowFixed>
        <div className="text-sm font-bold text-high-emphesis">{allowedSlippage.toFixed(2)}%</div>
      </RowBetween>

      {minerBribe && (
        <RowBetween>
          <RowFixed>
            <div className="text-sm text-secondary">Miner Tip</div>
          </RowFixed>
          <div className="text-sm font-bold text-high-emphesis">
            {CurrencyAmount.fromRawAmount(Ether.onChain(ChainId.MAINNET), minerBribe).toFixed(4)} ETH
          </div>
        </RowBetween>
      )}
    </div>
  )
}
