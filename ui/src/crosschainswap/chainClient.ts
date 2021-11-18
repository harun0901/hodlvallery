/* global localStorage */

import { Client } from '@liquality/client'
import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinEsploraSwapFindProvider } from '@liquality/bitcoin-esplora-swap-find-provider'
import { BitcoinRpcProvider } from '@liquality/bitcoin-rpc-provider'
import { BitcoinWalletApiProvider } from '@liquality/bitcoin-wallet-api-provider'
import { BitcoinSwapProvider } from '@liquality/bitcoin-swap-provider'
import { BitcoinNodeWalletProvider } from '@liquality/bitcoin-node-wallet-provider'
import { BitcoinRpcFeeProvider } from '@liquality/bitcoin-rpc-fee-provider'
import { BitcoinFeeApiProvider } from '@liquality/bitcoin-fee-api-provider'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'

import { EthereumRpcProvider } from '@liquality/ethereum-rpc-provider'
import { EthereumNetworks } from '@liquality/ethereum-networks'
import { EthereumSwapProvider } from '@liquality/ethereum-swap-provider'
import { EthereumScraperSwapFindProvider } from '@liquality/ethereum-scraper-swap-find-provider'
import { EthereumErc20Provider } from '@liquality/ethereum-erc20-provider'
import { EthereumErc20SwapProvider } from '@liquality/ethereum-erc20-swap-provider'
import { EthereumErc20ScraperSwapFindProvider } from '@liquality/ethereum-erc20-scraper-swap-find-provider'
import { EthereumWalletApiProvider } from '@liquality/ethereum-wallet-api-provider'
import { EthereumRpcFeeProvider } from '@liquality/ethereum-rpc-fee-provider'
import { EthereumGasNowFeeProvider } from '@liquality/ethereum-gas-now-fee-provider'


import config from './config'

function getBitcoinDataProvider (btcConfig) {
    if (btcConfig.api) {
        return new BitcoinEsploraBatchApiProvider({ url: btcConfig.api.url, batchUrl: btcConfig.batchApi.url, network: BitcoinNetworks[btcConfig.network], numberOfBlockConfirmation: btcConfig.feeNumberOfBlocks })
    } else if (btcConfig.rpc) {
        return new BitcoinRpcProvider({ uri: btcConfig.rpc.url, username: btcConfig.rpc.username, password: btcConfig.rpc.password, feeBlockConfirmations: btcConfig.feeNumberOfBlocks })
    }
}

function getBitcoinLedgerDerivationPath (addressType, network) {
    if (addressType === 'bech32') {
        return `m/84'/${network.coinType}'/0'`
    }
    if (addressType === 'legacy') {
        return `m/44'/${network.coinType}'/0'`
    }
}

function createBtcClient (asset, wallet) {
    const btcConfig = config.assets.BTC
    const network = BitcoinNetworks[btcConfig.network]

    const btcClient = new Client()
   if (wallet === 'bitcoin_node') {
        if (btcConfig.rpc.addressType === 'p2sh-segwit') {
            throw new Error('Wrapped segwit addresses (p2sh-segwit) are currently unsupported.')
        }
        if (btcConfig.api) btcClient.addProvider(new BitcoinEsploraBatchApiProvider({ url: btcConfig.api.url, network: network, numberOfBlockConfirmation: btcConfig.feeNumberOfBlocks }))
        btcClient.addProvider(new BitcoinRpcProvider({ uri: btcConfig.rpc.url, username: btcConfig.rpc.username, password: btcConfig.rpc.password, feeBlockConfirmations: btcConfig.feeNumberOfBlocks }))
        btcClient.addProvider(new BitcoinNodeWalletProvider({ network, uri: btcConfig.rpc.url, username: btcConfig.rpc.username, password: btcConfig.rpc.password, addressType: btcConfig.rpc.addressType }))
    } else if (wallet === 'liquality' || wallet === 'coin') {
        btcClient.addProvider(getBitcoinDataProvider(btcConfig))
        btcClient.addProvider(new BitcoinWalletApiProvider({ network, addressType: 'bech32' }))
    } else {
        // Verify functions required when wallet not connected
        btcClient.addProvider(getBitcoinDataProvider(btcConfig))
    }
    btcClient.addProvider(new BitcoinSwapProvider({ network, mode: btcConfig.swapMode }))
    if (btcConfig.api) btcClient.addProvider(new BitcoinEsploraSwapFindProvider(btcConfig.api.url))

    if (network.isTestnet) btcClient.addProvider(new BitcoinRpcFeeProvider())
    else btcClient.addProvider(new BitcoinFeeApiProvider('https://liquality.io/swap/mempool/v1/fees/recommended'))

    return btcClient
}

function createEthClient (asset, wallet) {
    const assetConfig = config.assets[asset]
    const network = EthereumNetworks[assetConfig.network]
    const isERC20 = assetConfig.type === 'erc20'
    const ethClient = new Client()
    ethClient.addProvider(new EthereumRpcProvider({ uri: assetConfig.rpc.url }))
    if (wallet === 'coin') {
        ethClient.addProvider(new EthereumWalletApiProvider(window.eth, network))
    }
    if (isERC20) {
        ethClient.addProvider(new EthereumErc20Provider(assetConfig.contractAddress))
        ethClient.addProvider(new EthereumErc20SwapProvider())
    } else {
        ethClient.addProvider(new EthereumSwapProvider())
    }

    if (assetConfig.api && assetConfig.api.type === 'scraper') {
        if (isERC20) ethClient.addProvider(new EthereumErc20ScraperSwapFindProvider(assetConfig.api.url))
        else ethClient.addProvider(new EthereumScraperSwapFindProvider(assetConfig.api.url))
    }

    const FeeProvider = network.isTestnet || asset === 'RBTC' || asset === 'MATIC'
        ? EthereumRpcFeeProvider
        : EthereumGasNowFeeProvider

    ethClient.addProvider(new FeeProvider())

    return ethClient
}

const clientCreators = {
    BTC: createBtcClient,
    ETH: createEthClient,
    RBTC: createEthClient,
    erc20: createEthClient,
    MATIC: createEthClient
}

const clients = {}

function getClient (asset, wallet) {
    if (!(asset in clients)) {
        clients[asset] = {}
    }
    if (wallet in clients[asset]) return clients[asset][wallet]
    const assetConfig = config.assets[asset]
    const creator = clientCreators[asset] || clientCreators[assetConfig.type]
    const client = creator(asset, wallet)
    clients[asset][wallet] = client
    return client
}

function getNetworkClient (asset, wallet) {
    const assetConfig = config.assets[asset]
    if (assetConfig.type === 'erc20') {
        return getClient('ETH', wallet)
    } else {
        return getClient(asset, wallet)
    }
}

export { getClient, getNetworkClient }
