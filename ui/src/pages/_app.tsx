import { Fragment, FunctionComponent } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from '../state'
import { ToastContainer } from 'react-toastify'
import { useApollo } from "../analytics/core/apollo";
import 'react-toastify/dist/ReactToastify.min.css'
import '../styles/globals.scss'
import { ApolloProvider } from "@apollo/client";
import { NextComponentType, NextPageContext } from 'next'
import type { AppProps } from 'next/app'
import ReactGA from 'react-ga'
import Web3ReactManager from '../components/Web3ReactManager'
import { Web3ReactProvider } from '@web3-react/core'
import dynamic from 'next/dynamic'
import getLibrary from '../functions/getLibrary'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Dots from '../components/Dots'
import ListsUpdater from '../state/lists/updater'
import MulticallUpdater from '../state/multicall/updater'
import TransactionUpdater from '../state/transactions/updater'
import UserUpdater from '../state/user/updater'
import ApplicationUpdater from '../state/application/updater'
import Layout from "../layouts";
import {CrossChainClientProvider} from "../crosschainswap/cross.client.provider"

const Web3ProviderNetwork = dynamic(() => import('../components/Web3ProviderNetwork'), { ssr: false })

if (typeof window !== 'undefined' && !!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

export default function MyApp({
  Component,
  pageProps,
}: AppProps & {
  Component: NextComponentType<NextPageContext> & {
    Guard: FunctionComponent
    Layout: FunctionComponent
    Provider: FunctionComponent

  }
}) {
  const router = useRouter()

  const client = useApollo(pageProps.initialApolloState);

  const { pathname, query, locale } = router

  useEffect(() => {
    ReactGA.initialize(process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, { testMode: process.env.NODE_ENV === 'development' })

    const errorHandler = (error) => {
      ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true,
      })
    }

    window.addEventListener('error', errorHandler)

    return () => window.removeEventListener('error', errorHandler)
  }, [])

  useEffect(() => {
    ReactGA.pageview(`${pathname}${query}`)
  }, [pathname, query])

  // Allows for conditionally setting a provider to be hoisted per page
  const Provider = Component.Provider || Fragment

  // Allows for conditionally setting a guard to be hoisted per page
  const Guard = Component.Guard || Fragment

  return (
      <ApolloProvider client={client}>
        <Web3ReactProvider  getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <CrossChainClientProvider>
                <ReduxProvider store={store}>
                  <PersistGate loading={<Dots>loading</Dots>} persistor={persistor}>
                    <>
                      <ListsUpdater />
                      <UserUpdater />
                      <ApplicationUpdater />
                      <TransactionUpdater />
                      <MulticallUpdater />
                    </>
                    <Provider>
                      <Guard>
                        <Layout.Default>
                          <Component {...pageProps} />
                          <ToastContainer />
                        </Layout.Default>
                      </Guard>
                    </Provider>
                  </PersistGate>
                </ReduxProvider>
              </CrossChainClientProvider>

            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </ApolloProvider>
  )
}

// export default MyApp
