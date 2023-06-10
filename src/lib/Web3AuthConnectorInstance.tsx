import { useCallback, useEffect, useState } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WALLET_ADAPTERS } from '@web3auth/base'
import { Web3Provider } from '@ethersproject/providers'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Chain } from 'wagmi'
const clientId =
  'BM_UR18KDju5ZqxoqfNR42ufXCsWx437bAtjI5Oj6YgqAcKdqTR9q3Jiq8LsExBtgvu0wqI-Lda6oMeeWKGOOyA' // get from https://dashboard.web3auth.io

/**
 * Replace Web3 react so we can merge web3auth and web3-react
 *
 * @returns web3 structure shared to various classes; replaces useWeb3React
 */
export default function Web3AuthConnectorInstance(chains: Chain[]) {
  const auth = new Web3Auth({
    clientId,
    web3AuthNetwork: 'testnet', // mainnet, aqua, celeste, cyan or testnet
    chainConfig: {
      // chainNamespace: CHAIN_NAMESPACES.EIP155,
      // chainId: '0x13881',
      // rpcTarget: 'https://rpc-mumbai.maticvigil.com' // This is the public RPC we have added, please pass on your own endpoint while creating an app
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: "0x" + chains[0].id.toString(16),
      rpcTarget: "https://rpc-mumbai.maticvigil.com/", //chains[0].rpcUrls.default.http[0], // This is the public RPC we have added, please pass on your own endpoint while creating an app
      displayName: chains[0].name,
      tickerName: chains[0].nativeCurrency?.name,
      ticker: chains[0].nativeCurrency?.symbol,
    },
    uiConfig: {
      theme: 'light',
      loginMethodsOrder: ['google'],
      appName: 'R8 My STAK',
      appLogo: '/images/logo.png' // Your App Logo Here
    }
  })

  const openloginAdapter = new OpenloginAdapter({
    // loginSettings: {
    //   mfaLevel: 'default' // Pass on the mfa level of your choice: default, optional, mandatory, none
    // },
    adapterSettings: {
      loginConfig: {
        // Add login configs corresponding to the provider
        // Google login
        google: {
          name: 'Google Login', // The desired name you want to show on the login button
          verifier: 'mad-google', // Please create a verifier on the developer dashboard and pass the name here
          typeOfLogin: 'google', // Pass on the login provider of the verifier you've created
          clientId: '125971468645-acluenumtcs9s3m7qcshtmgvfkcgsoj6.apps.googleusercontent.com' // use your app client id you got from google
        }
        // Add other login providers here
      }
    }
  })
  auth.configureAdapter(openloginAdapter)
  // await auth.initModal({
  //   modalConfig: {
  //     [WALLET_ADAPTERS.OPENLOGIN]: {
  //       label: 'openlogin',
  //       loginMethods: {
  //         google: {
  //           name: 'google login',
  //           logoDark: 'url to your custom logo which will shown in dark mode'
  //         }
  //       },
  //       // setting it to false will hide all social login methods from modal.
  //       showOnModal: true
  //     }
  //   }
  // })
  return new Web3AuthConnector({
    chains,
    options: {
      web3AuthInstance: auth
    }
  })
}
