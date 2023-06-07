'use client'
import Navbar from '@/components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { polygon, polygonMumbai } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { LensConfig, development, production } from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';
import { LensProvider } from '@lens-protocol/react-web';
import Web3AuthConnectorInstance from '@/lib/Web3AuthConnectorInstance';

const { chains, provider } = configureChains([polygonMumbai, polygon], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  connectors: [
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     projectId: 'wagmi'
    //   }
    // }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    }),
    Web3AuthConnectorInstance(chains)
  ],
  provider,
});

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}><WagmiConfig client={client}>
        <LensProvider config={lensConfig}>
          <Navbar />
          {children}
        </LensProvider>
      </WagmiConfig>
      </body>
    </html>
  )
}
