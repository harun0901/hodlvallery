import styles from './analytics.module.scss'
import {ReactNode, useCallback, useState} from "react";
import {useRouter} from "next/router";
import {Button, ButtonType, SearchInput, TokenListDropdown} from "../../components";
import {TokenModel} from "../../types/TokenModel";
import {Sizes} from "../../types/Sizes";
import Image from "next/image";

const tokenList: TokenModel[] = [
  { symbol: 'ETH', name: 'Ethereum', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'DAI', name: 'DAI', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'BTC', name: 'Bitcoin', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
  { symbol: 'COIN', name: 'COIN', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' },
]

interface LayoutProps {
  children: ReactNode;
  pairs?: boolean;
  tokens?: boolean;
  pools?: boolean;
}

const AnalyticsLayout: React.FC<LayoutProps> = ({ children, pairs, tokens, pools }) => {
  const router = useRouter();

  const [selectedToken, setSelectedToken] = useState<TokenModel>();
  const [search, setSearch] = useState<string>('');

  const handleBack = useCallback(() => {
    if (pairs) return router.push('/network');
    if (tokens) return router.push('/tokens');
    if (pools) return router.push('/pools');
    return router.push('/');
  }, [router, pairs, tokens, pools]);

  return (
    <div className={`flex justify-center pt-80px`}>
      <div className={`${styles.wrapper} border-10 border-white rounded-80 overflow-hidden`}>
        <div className={'flex items-start bg-white bg-opacity-80'}>
          <div className={'w-2/12 h-full h-10'}>

          </div>
          <div className={'w-10/12'}>
            <div className={'flex justify-between items-top pr-77px pt-77px'}>
              <Button type={ButtonType.GHOST}
                      size={Sizes.SMALL}
                      leftIcon={<Image src={'/icons/arrowLeft.svg'} alt={'Back'} width={16} height={24} />}
                      onClick={handleBack}>
                <p className={'pl-16px'}>BACK</p>
              </Button>
              <div className={'flex justify-end items-center'}>
                <div className={`${styles.searchWrapper}`}>
                  <SearchInput value={search} onChange={setSearch} />
                </div>
                <div className={`ml-25px rounded-full ${styles.tokenDropdownWrapper}`}>
                  <TokenListDropdown options={tokenList} onChange={setSelectedToken} value={selectedToken} />
                </div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsLayout
