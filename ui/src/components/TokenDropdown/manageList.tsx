/* eslint-disable jsx-a11y/alt-text */
import {useCallback, useEffect, useState} from "react";
import Image from "next/image";
import styles from "./tokenDropdown.module.scss"
import {Sizes} from "../../types/Sizes";
import {shortenAddress} from "../../functions";
import {TokenModel} from "../../types/TokenModel";
import {Button, ButtonType} from "../index"
import AddToken from './addToken'
import Input from "./Input";

interface ContractModel {
  name: string;
  icon: string;
  tokens: number;
  enabled: boolean;
  link: string;
}

interface ManageListProps {
  onManageTokens: () => void;
}

const ManageList: React.FC<ManageListProps> = ({ onManageTokens }) => {
  const [contractList, setContractList] = useState<ContractModel[]>([
    { name: 'COINGECKO', tokens: 4369, icon: '/icons/assets/eth.svg', enabled: false, link: 'https://coingecko' },
    { name: 'CMC DEFI', tokens: 1494, icon: '/icons/assets/eth.svg', enabled: true, link: 'https://cmcdefi' },
    { name: 'CMC DEFI', tokens: 1494, icon: '/icons/assets/eth.svg', enabled: true, link: 'https://cmcdeficopy' }
  ]);
  const [address, setAddress] = useState('');
  const [shortAddress, setShortAddress] = useState(address);
  const [focusedAddressInput, setFocusedAddressInput] = useState(false);
  const [filteredTokenList, setFilteredTokenList] = useState(contractList);

  useEffect(() => {
    setShortAddress(shortenAddress(address, 5))
    setFilteredTokenList(contractList.filter(x => x.link.includes(address)))
  }, [address, contractList]);

  const toggleList = (link :string):void => {
    const index = contractList.findIndex(x => x.link === link);
    if (index > -1) {
      const copy = [...contractList];
      copy[index].enabled = !copy[index].enabled;
      setContractList(copy);
    }
  }

  return (
    <div className={`relative ${styles.formWrapper}`}>
      <div className={'px-35px mt-7px'}>
        <Input value={focusedAddressInput ? address : shortAddress}
               onChange={(val) => {setAddress(val)}}
               placeholder={focusedAddressInput ? '' : 'Enter https:// or ipfs:// or ENS name…'}
               onFocus={() => setFocusedAddressInput(true)}
               onBlur={() => setFocusedAddressInput(false)} />
      </div>
      <div className={`px-35px mt-24px flex flex-col overflow-y-scroll ${styles.searchForm}`}>
        {!filteredTokenList.length &&
        <p className={'uppercase font-bold text-center text-gray-400 text-sm pt-2px'}>NO SEARCH RESULTS.</p>
        }
        {filteredTokenList.map((token, index) => (
          <div className={'flex items-center justify-between pb-18px border-b-3 border-gray-260 mb-18px last:border-0 last:mb-0'} key={index}>
            <div className={'flex items-center'}>
              <Image src={token.icon} width={32} height={32} />
              <div className={'flex flex-col pl-8px pt-2px'}>
                <p className={'uppercase text-sm text-gray-400 font-bold'}>{token.name}</p>
                <p className={'uppercase text-15px text-gray-400 font-bold pt-1px'}>{token.tokens} Tokens</p>
              </div>
            </div>
            <div className={'flex items-center -mt-9px'}>
              <div className={'mr-24px flex items-center justify-center'}>
                <Image src={'/icons/iconCrossTiny.svg'} width={21} height={21} />
              </div>
              <div className={'mr-18px mt-3px'}>
                <Image src={'/icons/iconShare.svg'} width={29} height={29} />
              </div>
              <button
                onClick={() => toggleList(token.link)}
                className={`uppercase font-medium text-sm flex justify-center items-center -mt-3px ${styles.onOffbutton} ${token.enabled ? 'text-white bg-gray-400' : 'text-gray-310 border-3 border-gray-270'}`}>
                {token.enabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className={`relative mt-20px`}>
        <div className={'flex justify-center'}>
          <Button type={ButtonType.GHOST} size={Sizes.NORMAL} onClick={onManageTokens}>
            <p className={'tracking-wider'}>Manage Tokens</p>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ManageList
