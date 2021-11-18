import { Currency, CurrencyAmount } from '@sushiswap/sdk'
import { useActiveWeb3React } from "../../hooks";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import Loader from '../../components/Loader'
import { useCrossChainClient } from "../../crosschainswap/cross.client.provider";

function ShowBalance({ balance }: { balance: CurrencyAmount<Currency> }) {

  return (
    <div className="whitespace-nowrap overflow-hidden max-w-[5rem] overflow-ellipsis text-blue-400 tracking-wider	font-medium text-15px" title={balance.toExact()}>
      {balance.toSignificant(4)}
    </div>
  )
}

const Balance = ({ currency }) => {
  const { account } = useActiveWeb3React();
  const {activeWalletDetails} = useCrossChainClient()

  const balance = useCurrencyBalance(account ?? undefined, currency)

  if (currency.symbol === 'BTC') {

    const balance = {
      currency: 'BTC',
      toSignificant: ()=>{
        return activeWalletDetails.networkBalance.toString()
      },
      toExact: ()=>{
        return 0
      }
    }
    return (
        <div className="flex items-center justify-end">
          {balance ? <ShowBalance balance={balance} /> : account ? <Loader /> : null}
        </div>
    )
  }
  return (
    <div className="flex items-center justify-end">
      {balance ? <ShowBalance balance={balance} /> : account ? <Loader /> : null}
    </div>
  )
}

export default Balance;
