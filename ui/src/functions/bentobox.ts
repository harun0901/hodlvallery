import { BigNumber } from '@ethersproject/bignumber'

export function toAmount(token, shares: BigNumber): BigNumber {
  return BigNumber.from(token.bentoShare).isZero()
    ? BigNumber.from(0)
    : BigNumber.from(shares)
      .mul(BigNumber.from(token.bentoAmount))
      .div(BigNumber.from(token.bentoShare))
}

export function toShare(token, amount: BigNumber): BigNumber {
  return BigNumber.from(token.bentoAmount).isZero()
    ? BigNumber.from(0)
    : BigNumber.from(amount)
      .mul(BigNumber.from(token.bentoShare))
      .div(BigNumber.from(token.bentoAmount))
}
