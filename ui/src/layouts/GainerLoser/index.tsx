import styles from './gainerLoser.module.scss'
import {ReactNode, useState} from "react";
import {SearchInput, TokenListDropdown} from "../../components";
import {TokenModel} from "../../types/TokenModel";

const tokenList: TokenModel[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'DAI', name: 'DAI', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'COIN', name: 'COIN', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
]

interface LayoutProps {
  children: ReactNode;
  gainers?: boolean;
}

const GainerLoserLayout: React.FC<LayoutProps> = ({ children, gainers }) => {
  const [selectedToken, setSelectedToken] = useState<TokenModel>();
  const [search, setSearch] = useState<string>('');

  return (
    <div className={`flex justify-center pt-80px`}>
      <div className={`${styles.wrapper} border-10 border-white rounded-80 overflow-hidden`}>
        <div className={'flex items-start bg-white bg-opacity-80'}>
          <div className={'w-2/12 h-full h-10'}>

          </div>
          <div className={'w-10/12 pl-25px pt-50px'}>
            <div className={'flex justify-between items-top pr-77px'}>
              <div className={'flex justify-end items-center w-full'}>
                <div className={`${styles.searchWrapper}`}>
                  <SearchInput value={search} onChange={setSearch} />
                </div>
                <div className={`ml-25px rounded-full ${styles.tokenDropdownWrapper}`}>
                  <TokenListDropdown options={tokenList} onChange={setSelectedToken} value={selectedToken} />
                </div>
              </div>
            </div>
            <h2 className={'uppercase font-medium text-40px text-gray-800 mt-59px mb-14px tracking-normal pl-7px leading-10'}>
              {gainers ? 'Gainers' : 'Losers'}
            </h2>
            <div className={'pb-30px'}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GainerLoserLayout;
