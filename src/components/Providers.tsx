'use client'
import React from 'react'
import { ChainId, AzuroSDKProvider } from '@azuro-org/sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy, gnosis, polygon, arbitrum } from 'wagmi/chains'
import { WagmiProvider } from 'wagmi'

import { BetslipProvider } from '@/context/betslip'
import { defineChain } from 'viem'

export const chiliz = /*#__PURE__*/ defineChain({
  id: 88888,
  name: 'Chiliz Chain',
  network: 'chiliz-chain',
  nativeCurrency: {
    decimals: 18,
    name: 'CHZ',
    symbol: 'CHZ',
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.ankr.com/chiliz',
        'https://chiliz-rpc.publicnode.com',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Chiliz Explorer',
      url: 'https://scan.chiliz.com',
      apiUrl: 'https://scan.chiliz.com/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 8080847,
    },
  },
})

const { wallets } = getDefaultWallets()

const chains = [
  polygonAmoy,
  gnosis,
  polygon,
  arbitrum,
  chiliz
] as const

const wagmiConfig = getDefaultConfig({
  appName: 'Azuro-Chiliz',
  projectId: '225beb01569c7bc66625d6c678820236', // get your own project ID - https://cloud.walletconnect.com/sign-in
  wallets,
  chains,
  ssr: false,
})

const queryClient = new QueryClient()

type ProvidersProps = {
  children: React.ReactNode
  initialChainId?: string
  initialLiveState?: boolean
}

export function Providers(props: ProvidersProps) {
  const { children, initialChainId, initialLiveState } = props
  console.log("initialChainId::", initialChainId);
  console.log("chains::", chains);
  const chainId = initialChainId &&
                  chains.find(chain => chain.id === +initialChainId) ? +initialChainId as ChainId : polygonAmoy.id

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AzuroSDKProvider initialChainId={chainId} initialLiveState={initialLiveState}>
            <BetslipProvider>
              {children}
            </BetslipProvider>
          </AzuroSDKProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
