/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import styles from "./tokenDropdown.module.scss"
import { Sizes } from "../../types/Sizes";
import { shortenAddress } from "../../functions";
import { TokenModel } from "../../types/TokenModel";
import { Button, ButtonType } from "../index"
import Input from "./Input";
import { useActiveWeb3React } from "../../hooks";
import { useAllTokens, useSearchInactiveTokenLists } from "../../hooks/Tokens";
import { useRouter } from "next/router";

import { ChainId, Currency, NATIVE, Token } from '@sushiswap/sdk'
import CHAINLINK_TOKENS from '@sushiswap/chainlink-whitelist/dist/sushiswap-chainlink.whitelist.json';
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json';
import { useDerivedLimitOrderInfo } from "../../state/limit-order/hooks";
import { Field } from '../../state/swap/actions';
import useDebounce from "../../hooks/useDebounce";
import { useSortedTokensByQuery, filterTokens } from "../../functions/filtering";
import { useTokenComparator } from './sorting'
import { isAddress } from '../../functions/validate'
import CurrencyLogo from "../CurrencyLogo";

// const existingTokenList: TokenModel[] = [
//   { symbol: 'ETH', name: 'Ethereum', balance: 24325.92, price: 5187, icon: '/icons/assets/eth.svg', address: 'testETH' },
//   { symbol: 'DAI', name: 'DAI', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' }
// ]

const areEqual = (first, second) => {
  if (first.length !== second.length) {
    return false
  }
  for (let i = 0; i < first.length; i++) {
    if (!second.includes(first[i])) {
      return false
    }
  }
  return true
}
interface ManageTokensProps {
  onManageList: () => void;
}

const ManageTokens: React.FC<ManageTokensProps> = ({ onManageList }) => {
  const { chainId } = useActiveWeb3React();
  let allTokens = useAllTokens()
  const { currencies } = useDerivedLimitOrderInfo()
  const [currencyInputPanelError, setCurrencyInputPanelError] = useState<string>()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const [invertSearchOrder] = useState<boolean>(false)
  const isAddressSearch = isAddress(debouncedQuery)

  const tokenComparator = useTokenComparator(invertSearchOrder)

  const [address, setAddress] = useState('');
  const [shortAddress, setShortAddress] = useState(address);
  const [focusedAddressInput, setFocusedAddressInput] = useState(false);
  const [filteredTokenList, setFilteredTokenList] = useState([]);

  const pairs = (limitOrderPairList.pairs[chainId] || []).map(([token0, token1]) => [token0.address, token1.address])

  useEffect(() => {
    if (
      pairs &&
      currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      !pairs.find((el) =>
        areEqual(el, [currencies[Field.INPUT].wrapped.address, currencies[Field.OUTPUT].wrapped.address])
      )
    ) {
      setCurrencyInputPanelError('Invalid pair')
    } else if (currencyInputPanelError === 'Invalid pair') {
      setCurrencyInputPanelError('')
    }
  }, [currencies, currencyInputPanelError, pairs])

  const router = useRouter()

  const currencyList = useMemo(() => {
    if (pairs.length === 0) return []
    return pairs.reduce((acc, [token0, token1]) => {
      acc.push(token0)
      acc.push(token1)
      return acc
    }, [])
  }, [pairs])

  if (router.asPath.startsWith('/kashi/create')) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      if (CHAINLINK_TOKENS[chainId].find((address) => address === key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }

  if (currencyList) {
    allTokens = Object.keys(allTokens).reduce((obj, key) => {
      if (currencyList.includes(key)) obj[key] = allTokens[key]
      return obj
    }, {})
  }


  const filteredTokens: Token[] = useMemo(() => {
    return filterTokens(Object.values(allTokens), debouncedQuery)
  }, [allTokens, debouncedQuery])

  const sortedTokens: Token[] = useMemo(() => {
    return filteredTokens.sort(tokenComparator)
  }, [filteredTokens, tokenComparator])

  const filteredSortedTokens = useSortedTokensByQuery(sortedTokens, debouncedQuery)

  const ether = useMemo(() => chainId && ![ChainId.CELO].includes(chainId) && NATIVE[chainId], [chainId])

  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if (s === '' || s === 'e' || s === 'et' || s === 'eth') {
      return ether ? [ether, ...filteredSortedTokens] : filteredSortedTokens
    }
    return filteredSortedTokens
  }, [debouncedQuery, ether, filteredSortedTokens])

  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 || (debouncedQuery.length > 2 && !isAddressSearch) ? debouncedQuery : undefined
  )

  useEffect(() => {
    setShortAddress(shortenAddress(address, 5))
    setFilteredTokenList([...filteredSortedTokensWithETH, ...filteredInactiveTokens])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const removeAllTokens = () => {
    console.log('REMOVED');
  }

  return (
    <div className={`relative ${styles.formWrapper}`}>
      <div className={'px-35px mt-7px'}>
        <Input value={focusedAddressInput ? address : shortAddress}
          onChange={(val) => { setAddress(val) }}
          placeholder={focusedAddressInput ? '' : 'Enter token contact address…'}
          onFocus={() => setFocusedAddressInput(true)}
          onBlur={() => setFocusedAddressInput(false)} />
      </div>
      <div className={'px-35px mt-26px'}>
        {!filteredTokenList.length &&
          <p className={'uppercase font-bold text-center text-gray-400 text-sm pt-2px'}>NO SEARCH RESULTS.</p>
        }
        {!!filteredTokenList.length &&
          <div className={'flex justify-between'}>
            <p className={'text-sm uppercase text-gray-400 font-bold'}>{filteredTokenList.length} tokens added</p>
            <p className={'text-sm uppercase text-gray-400 font-bold text-right cursor-pointer'} onClick={removeAllTokens}>remove all</p>
          </div>
        }
      </div>
      <div className={`px-35px mt-8px flex flex-col overflow-y-scroll ${styles.searchFormShort}`}>
        {filteredTokenList.map((token, index) => (
          <div className={'flex items-center justify-between pb-18px border-b-3 border-gray-260 mb-18px last:border-0 last:mb-0'} key={index}>
            <div className={'flex items-center'}>
              <CurrencyLogo currency={token} size={32} />
              <div className={'flex flex-col pl-8px pt-2px'}>
                <p className={'uppercase text-sm text-gray-400 font-bold'}>{token.name}</p>
                <p className={'uppercase text-15px text-gray-400 font-bold pt-1px'}>{token.symbol}</p>
              </div>
            </div>
            <div className={'flex items-center pr-10px -mt-9px'}>
              <div className={'mr-24px flex items-center justify-center'}>
                <Image src={'/icons/iconCrossTiny.svg'} width={21} height={21} />
              </div>
              <div className={'mt-5px'}>
                <Image src={'/icons/iconShare.svg'} width={29} height={29} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`relative mt-20px`}>
        <div className={'flex justify-center'}>
          <Button type={ButtonType.GHOST} size={Sizes.NORMAL} onClick={onManageList}>
            <p className={'tracking-wider'}>Manage lists</p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ManageTokens
