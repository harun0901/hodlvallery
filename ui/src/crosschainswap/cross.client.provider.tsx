import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getClient, getNetworkClient} from "./chainClient";
import { assets as cryptoassets , chains, unitToCurrency } from '@liquality/cryptoassets'
import {useWeb3React} from "@web3-react/core";

const CrossChainClientContext = React.createContext(null);
interface Props {
    children: any;
}
export const  CrossChainClientProvider = (props: Props) => {
    const [activeWalletDetails, setActiveWalletDetails] = useState({
        allAddresses: [],
        networkBalance: 0,
        balance: 0,

        unitNetworkBalance: 0,
        unitBalance: 0
    });
    const { active, library } = useWeb3React()



    useEffect(()=>{
        getWalletDetailsAfterConnection('BTC');
    }, [active, library?.provider?.isCoinWallet])

    const getWalletDetailsAfterConnection = async (currencyCode) => {
        if (active && library?.provider?.isCoinWallet) {
            const wallet = 'coin';

            const currency = cryptoassets[currencyCode]

            const chain = chains[currency.chain]
            const client = getClient(currencyCode, wallet)

            const networkClient = getNetworkClient(currencyCode, wallet)

            const addressesPerCall = 100
            const unusedAddress = await client.wallet.getUnusedAddress()

            let allAddresses = await client.wallet.getUsedAddresses(addressesPerCall)


            allAddresses = [ ...new Set([ unusedAddress, ...allAddresses ].map(a => a.address)) ]
            allAddresses = allAddresses.map(address => chain.formatAddress(address))

            // if (wallets[party].addresses[0] !== null) { // Preserve the preset address for party B
            //     const expectedAddress = wallets[party].addresses[0]
            //     if (allAddresses.includes(expectedAddress)) {
            //         allAddresses = [expectedAddress, ...allAddresses.filter(address => address !== expectedAddress)]
            //     }
            // }

            const balance = await client.chain.getBalance(allAddresses)
            const networkBalance = networkClient === client ? balance : await networkClient.chain.getBalance(allAddresses)
            setActiveWalletDetails({
                allAddresses,
                networkBalance: unitToCurrency(currency, networkBalance),
                balance: unitToCurrency(currency, balance),

                unitNetworkBalance: networkBalance.toString(),
                unitBalance:balance.toString(),
            })
        } else {
            setActiveWalletDetails({
                allAddresses: [],
                networkBalance: 0,
                balance: 0,

                unitNetworkBalance: 0,
                unitBalance: 0
            })
        }

    }

    const btcClient = useMemo(()=>{

        if (active && library?.provider?.isCoinWallet) {
            return getClient('BTC', 'coin')
        }
        return undefined

    }, [active, library?.provider?.isCoinWallet])

    const ethClient = useMemo(()=>{

        if (active && library?.provider?.isCoinWallet) {
            return getClient('ETH', 'coin')
        }
        return undefined
    }, [active, library?.provider?.isCoinWallet])

    const erc20Client = useMemo(()=>{

        if (active && library?.provider?.isCoinWallet) {
            return getClient('DAI', 'coin')
        }
        return undefined
    }, [active, library?.provider?.isCoinWallet])

    return (
        <CrossChainClientContext.Provider
            value={{
                btcClient,
                ethClient,
                erc20Client,
                activeWalletDetails
            }}
        >
            {props.children}
        </CrossChainClientContext.Provider>
    );
}
export const useCrossChainClient = () => React.useContext(CrossChainClientContext)
