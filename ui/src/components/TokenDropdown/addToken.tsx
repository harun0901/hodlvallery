/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";
import styles from "./tokenDropdown.module.scss"
import {Sizes} from "../../types/Sizes";
import {shortenAddress} from "../../functions";
import {TokenModel} from "../../types/TokenModel";
import {Button, ButtonType} from "../index"
import {useCallback} from "react";

interface AddTokenProps {
  token?: TokenModel;
  onAdd: (token: TokenModel) => void;
}


const AddToken: React.FC<AddTokenProps> = ({token, onAdd}) => {
  const handleAdd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(token);
  }, [onAdd, token]);

  return token ? (
    <div className={'flex flex-col items-center'}>
      <div className={'flex items-center -ml-10px'}>
        <Image src={token.icon} width={49} height={49} />
        <div className={'flex flex-col pl-12px'}>
          <p className={'uppercase text-3xl text-gray-400 font-medium'}>{token.symbol}</p>
          <p className={'uppercase text-15px text-gray-400 font-medium -mt-2px'}>{token.name}</p>
          <p className={'text-base text-underline font-medium text-gray-400 tracking-normal underline mt-2px'}>{shortenAddress(token.address, 6)}</p>
        </div>
      </div>
      <div className={'mt-20px px-41px'}>
        <div className={`bg-red-400 border-4 border-red-500 pt-19px pl-21px pr-30px pb-20px ${styles.warningMsg}`}>
          <div className={'flex items-center justify-center pr-25px'}>
            <Image src={'/icons/iconWarning.svg'} alt={'Warning'} width={25} height={22} />
            <p className={'ml-12px uppercase text-xl text-white font-medium tracking-normal'}>WARNING</p>
          </div>
          <p className={'text-xs text-white font-medium tracking-normal mt-7px'}>This token is not on any active token lists. Please ensure this is the token you would like to add.</p>
        </div>
      </div>
      <div className={`relative mt-29px`}>
        <div className={'flex justify-center'}>
          <Button type={ButtonType.GHOST} size={Sizes.NORMAL} onClick={handleAdd}>
            <p className={'tracking-wider'}>Add</p>
          </Button>
        </div>
      </div>
    </div>
  ): null;
}

export default AddToken;
