export default {
    hostName: 'Coin',
    hostIcon: 'https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png',
    agents: ['https://agent-t-044.coindefi.org'],
    assets: {
        ETH: {
            rpc: {
                url: 'https://ropsten.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'
            },
            api: {
                type: 'scraper',
                url: 'https://liquality.io/eth-ropsten-api'
            },
            network: 'ropsten',
            explorerPath: 'https://ropsten.etherscan.io/tx/0x'
        },
        BTC: {
            api: {
                url: 'https://btcscraper-t.coindefi.org/testnet/api'
            },
            batchApi: {
                url: 'https://btcscraper-batch-t.coindefi.org'
            },
            feeNumberOfBlocks: 2,
            network: 'bitcoin_testnet',
            explorerPath: 'https://blockstream.info/testnet/tx/'
        },
        DAI: {
            type: 'erc20',
            rpc: {
                url: 'https://ropsten.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'
            },
            api: {
                type: 'scraper',
                url: 'https://liquality.io/eth-ropsten-api'
            },
            contractAddress: '0xad6d458402f60fd3bd25163575031acdce07538d',
            network: 'ropsten',
            explorerPath: 'https://ropsten.etherscan.io/tx/0x'
        },
        COIN: {
            type: 'erc20',
            rpc: {
                url: 'https://ropsten.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f'
            },
            api: {
                type: 'scraper',
                url: 'https://liquality.io/eth-ropsten-api'
            },
            contractAddress: '0x212e4Ff4f9003eF018632A288cbF4Bb92962B3B1',
            network: 'ropsten',
            explorerPath: 'https://ropsten.etherscan.io/tx/0x'
        },
    },
    debug: true,
    defaultFee: 'average',
    injectFooter: `<p style="text-align: center;"><a href="https://github.com/liquality/chainabstractionlayer" target="_blank">Powered by ChainAbstractionLayer</a></p>`
}
