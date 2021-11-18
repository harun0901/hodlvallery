/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import styles from "./tokenDropdown.module.scss"
import {FixedSizeList} from "react-window";
import { Sizes } from "../../types/Sizes";
import { shortenAddress } from "../../functions";
import { TokenModel } from "../../types/TokenModel";
import { Button, ButtonType } from "../index"
import Input from "./Input"

import { ChainId, Currency, NATIVE, Token } from '@sushiswap/sdk'
import CHAINLINK_TOKENS from '@sushiswap/chainlink-whitelist/dist/sushiswap-chainlink.whitelist.json';
import limitOrderPairList from '@sushiswap/limit-order-pair-list/dist/limit-order.pairlist.json';
import { useDerivedLimitOrderInfo } from "../../state/limit-order/hooks";
import { Field } from '../../state/swap/actions';
import useDebounce from "../../hooks/useDebounce";
import { useSortedTokensByQuery, filterTokens } from "../../functions/filtering";
import { useTokenComparator } from './sorting'
import { isAddress } from '../../functions'
import CurrencyLogo from "../CurrencyLogo";
import { useActiveWeb3React } from "../../hooks";
import { useAllTokens, useSearchInactiveTokenLists } from "../../hooks/Tokens";
import { useRouter } from "next/router";
import Balance from "../CurrencyBalance";
import {nativeBitcoin} from "../../crosschainswap/Bitcoin";

// const existingTokenList: TokenModel[] = [
//   { symbol: 'ETH', name: 'Ethereum', balance: 24325.92, price: 5187, icon: '/icons/assets/eth.svg', address: 'testETH' },
//   { symbol: 'DAI', name: 'DAI', balance: 32.15, price: 1000, icon: '/icons/assets/eth.svg', address: 'testDAI' }
// ]

// const freeTokenList: TokenModel[] = [
//   { symbol: 'ETH', name: 'Ethereum', balance: 24325.92, price: 5187, icon: '/icons/assets/eth.svg', address: 'testFreeETH' },
// ]

// export const bitcoin = new Bitcoin(1)

interface SelectTokensProps {
  onManageTokens: () => void;
  onAdd: (token: TokenModel) => void;
  onSelect: (token: TokenModel) => void;
}

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

const SelectTokens: React.FC<SelectTokensProps> = ({ onAdd, onManageTokens, onSelect }) => {
  const { chainId, library } = useActiveWeb3React();

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

  const handleAdd = useCallback((e, token) => {
    e.stopPropagation();
    onAdd(token);
  }, [onAdd]);

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

  if (currencyList.length) {
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

  const extraCustomAssets = []
  if (library?.provider?.isCoinWallet) {
    extraCustomAssets.push(nativeBitcoin[chainId])
  }
  const filteredSortedTokensWithETH: Currency[] = useMemo(() => {
    const s = debouncedQuery.toLowerCase().trim()
    if (s === '' || s === 'e' || s === 'et' || s === 'eth') {
      return ether ? [ether, ...extraCustomAssets, ...filteredSortedTokens] : filteredSortedTokens
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

  const Row = useCallback(
    function TokenRow({ data, index, style }) {
      // const row: Currency | BreakLine = data[index]
      //
      // if (isBreakLine(row)) {
      //   return <BreakLineComponent style={style} />
      // }
      //
      // const currency = row
      //
      // const isSelected = Boolean(currency && selectedCurrency && selectedCurrency.equals(currency))
      // const otherSelected = Boolean(currency && otherCurrency && otherCurrency.equals(currency))
      // const handleSelect = () => currency && onCurrencySelect(currency)
      //
      // const token = currency?.wrapped
      //
      // const showImport = index > currencies.length
      //
      // if (showImport && token) {
      //   return (
      //     <ImportRow style={style} token={token} showImportView={showImportView} setImportToken={setImportToken} dim />
      //   )
      // } else if (currency) {
      //   return (
      //     <CurrencyRow
      //       style={style}
      //       currency={currency}
      //       isSelected={isSelected}
      //       onSelect={handleSelect}
      //       otherSelected={otherSelected}
      //     />
      //   )
      // } else {
      //   return null
      // }
      const row = data[index];
      // const token = row?.isToken ? row.tokenInfo : row;
      const token = row;

      return (
        <div className={'flex items-end justify-between pb-18px border-b-3 border-gray-260 mb-18px last:border-0 last:mb-0'} key={index}
             style={style}
             onClick={() => onSelect(token)}>
          <div className={'flex items-center'}>
            <CurrencyLogo currency={token} size={32} />
            {/* <Image src={token.icon} width={32} height={32} /> */}
            <div className={'flex flex-col pl-8px pt-2px'}>
              <p className={'uppercase text-sm text-gray-400 font-bold'}>{token.name}</p>
              <p className={'uppercase text-15px text-gray-400 font-bold pt-1px'}>{token.symbol}</p>
            </div>
          </div>
          <Balance currency={token} />
          {/* {existingTokenList.some(x => x.address === token.address) ?
              <p className={'font-medium text-15px text-right text-blue-400'}>{token.balance}</p>
              :
              <Button type={ButtonType.GHOST} size={Sizes.EXTRA_SMALL} onClick={(e) => handleAdd(e, token)}>
                <p className={'tracking-wider'}>ADD</p>
              </Button>
            } */}
        </div>
      )
    },
    []
  )

  return (
    <div className={`relative ${styles.formWrapper}`}>
      <div className={'px-35px mt-7px'}>
        <Input value={focusedAddressInput ? address : shortAddress}
          onChange={(val) => { setAddress(val) }}
          placeholder={focusedAddressInput ? '' : 'Enter token contact address…'}
          onFocus={() => setFocusedAddressInput(true)}
          onBlur={() => setFocusedAddressInput(false)} />
      </div>
      <div className={`px-35px mt-24px flex flex-col overflow-y-scroll ${styles.searchForm}`}>
        {!filteredTokenList.length &&
          <p className={'uppercase font-bold text-center text-gray-400 text-sm pt-2px'}>
            NO SEARCH RESULTS.
          </p>
        }
        {!!filteredTokenList.length &&
          <FixedSizeList
            width={"100%"}
            height={160}
            itemData={filteredTokenList}
            itemCount={filteredTokenList.length}
            itemSize={70}
          >
            {Row}
          </FixedSizeList>
        }
        {/*{filteredTokenList.map((token, index) => (*/}
        {/*  <div className={'flex items-end justify-between pb-18px border-b-3 border-gray-260 mb-18px last:border-0 last:mb-0'} key={index}*/}
        {/*    onClick={() => onSelect(token)}>*/}
        {/*    <div className={'flex items-center'}>*/}
        {/*      /!*<CurrencyLogo currency={token} size={32} />*!/*/}
        {/*      /!* <Image src={token.icon} width={32} height={32} /> *!/*/}
        {/*      <div className={'flex flex-col pl-8px pt-2px'}>*/}
        {/*        <p className={'uppercase text-sm text-gray-400 font-bold'}>{token.name}</p>*/}
        {/*        <p className={'uppercase text-15px text-gray-400 font-bold pt-1px'}>{token.symbol}</p>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    <Balance currency={token} />*/}
        {/*    /!* {existingTokenList.some(x => x.address === token.address) ?*/}
        {/*      <p className={'font-medium text-15px text-right text-blue-400'}>{token.balance}</p>*/}
        {/*      :*/}
        {/*      <Button type={ButtonType.GHOST} size={Sizes.EXTRA_SMALL} onClick={(e) => handleAdd(e, token)}>*/}
        {/*        <p className={'tracking-wider'}>ADD</p>*/}
        {/*      </Button>*/}
        {/*    } *!/*/}
        {/*  </div>*/}
        {/*))}*/}
      </div>
      <div className={`relative mt-20px`}>
        <div className={'flex justify-center'} onClick={onManageTokens}>
          <Button type={ButtonType.GHOST} size={Sizes.NORMAL}>
            <p className={'tracking-wider'}>Manage</p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SelectTokens
