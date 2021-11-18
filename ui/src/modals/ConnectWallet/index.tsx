import {Modal, ModalMenuItem} from "../../components"
import {ApplicationModal} from "../../state/modals/actions";

import styles from './communityFarm.module.scss'
import {Sizes} from "../../types/Sizes";
import React, {useEffect, useMemo, useState} from "react";
import {SUPPORTED_WALLETS} from "../../constants";
import {isMobile} from "react-device-detect";
import {injected, portis} from "../../connectors";
import Option from "../WalletModal/Option";
import {UnsupportedChainIdError, useWeb3React} from "@web3-react/core";
import {AbstractConnector} from "@web3-react/abstract-connector";
import ReactGA from "react-ga";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import {useRouter} from "next/router";

interface LinkItemModal {
  label: string;
  link?: ApplicationModal
}

const list: LinkItemModal[] = [
  { label: 'metamask' },
  { label: 'walletconncet' },
  { label: 'coinbase wallet' },
  { label: 'FORTMATIC' },
  { label: 'PORTIS' },
]

const ConnectWalletModal: React.FC = () => {
  const router = useRouter();
  const { account, activate } = useWeb3React()

  const [pendingWalletName, setPendingWalletName] = useState<string>();
  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()
  const [pendingError, setPendingError] = useState<boolean>()

  // const selectWallet = useCallback((item: LinkItemModal): void => {
  //   setSelectedWallet(item.label)
  // }, []);

  const tryActivation = async (connector: (() => Promise<AbstractConnector>) | AbstractConnector | undefined) => {
    let name = ''
    let conn = typeof connector === 'function' ? await connector() : connector

    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if (connector === SUPPORTED_WALLETS[key].connector) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    })
    setPendingWallet(conn) // set wallet for pending view
    setPendingWalletName(name);
    // setWalletView(WALLET_VIEWS.PENDING)

    // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
    if (conn instanceof WalletConnectConnector && conn.walletConnectProvider?.wc?.uri) {
      conn.walletConnectProvider = undefined
    }

    conn &&
    activate(conn, undefined, true).catch((error) => {
      if (error instanceof UnsupportedChainIdError) {
        activate(conn) // a little janky...can't use setError because the connector isn't set
      } else {
        setPendingError(true)
      }
    })
  }

  const options = useMemo(() => {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask

    const optionList = Object.keys(SUPPORTED_WALLETS).map((key) => {

      const option = SUPPORTED_WALLETS[key]

      // check for mobile options
      if (isMobile) {
        // disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return option;
          // return (
          //   <Option
          //     onClick={() => {
          //       option.connector !== connector && !option.href && tryActivation(option.connector)
          //     }}
          //     id={`connect-${key}`}
          //     key={key}
          //     active={option.connector && option.connector === connector}
          //     color={option.color}
          //     link={option.href}
          //     header={option.name}
          //     subheader={null}
          //     icon={'/images/wallets/' + option.iconName}
          //   />
          // )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return option;
            // return (
            //   <Option
            //     id={`connect-${key}`}
            //     key={key}
            //     color={'#E8831D'}
            //     header={'Install Metamask'}
            //     subheader={null}
            //     link={'https://metamask.io/'}
            //     icon="/images/wallets/metamask.png"
            //   />
            // )
          } else {
            return null // dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
      }

      // return rest of options
      // return (
      //   !isMobile &&
      //   !option.mobileOnly && (
      //     <Option
      //       id={`connect-${key}`}
      //       onClick={() => {
      //         option.connector === connector
      //           ? setWalletView(WALLET_VIEWS.ACCOUNT)
      //           : !option.href && tryActivation(option.connector)
      //       }}
      //       key={key}
      //       active={option.connector === connector}
      //       color={option.color}
      //       link={option.href}
      //       header={option.name}
      //       subheader={null} // use option.descriptio to bring back multi-line
      //       icon={'/images/wallets/' + option.iconName}
      //     />
      //   )
      // )
      return option;
    })
    return optionList.filter(x => x);
  }, []);

  const tryingToConnect = useMemo(() => pendingWalletName && !pendingError, [pendingWalletName, pendingError])

  useEffect(() => {
    if (account) {
      router.push('/')
    }
  }, [account]);

  return (
    <Modal isOpen={true}
           title={{firstLine:'connect', secondLine: 'wallet'}}
           description={'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet.'}
           size={Sizes.MEDIUM}
           mainIconName={"Factory"}>
      <div className={`h-full flex flex-col ${styles.form}`}>
        <div className={`w-full relative ${styles.changableBlock}`}>
          <div className={`${styles.body} ${tryingToConnect ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className={`w-full h-full overflow-y-scroll relative`}>
              {options.map((item, index) => (
                <div className={'mb-20px'} key={index}>
                  <ModalMenuItem label={item.name} onSelect={() => tryActivation(item.connector)} />
                </div>
              ))}
            </div>
          </div>
          <div className={`${styles.body} ${!tryingToConnect ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className={'h-full flex flex-col justify-center pb-30px'}>
              <p className={'font-medium text-40px text-gray-400 tracking-normal pl-6px mb-30px'}>Connecting…</p>
              <ModalMenuItem label={pendingWalletName} disabled={true} />
            </div>
          </div>
        </div>
        <p className={'font-medium text-xs text-gray-400 mt-10px pl-21px tracking-normal'}>
          Connecting a wallet acknowledges that you agree to HODL Valley’s <a className={'underline'} href="#">Terms of Service</a>, <a className={'underline'} href="#">Privacy Policy</a>, <a className={'underline'} href="#">User Agreement</a>, and <a className={'underline'} href="#">Disclaimer</a>.
        </p>
      </div>
    </Modal>
  )
}

export default ConnectWalletModal;
