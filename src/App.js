import '../src/Assets/css/bootstrap.min.css'
import '../src/Assets/fonts/ic_style.css'
import '../src/Assets/css/progresscircle.css'
import '../src/Assets/css/style.css'
import '../src/Assets/css/responsive.css'
import Layout from './Components/Layout'

import { infuraId, server } from './config'

import '@rainbow-me/rainbowkit/dist/index.css';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, WagmiConfig, createClient, WagmiProvider, configureChains  } from "wagmi";
import { infuraProvider } from 'wagmi/providers/infura'
import { connectorsForWallets, wallet } from '@rainbow-me/rainbowkit';

  const { chains, provider } = configureChains(
    [chain.mainnet, chain.goerli],
    [
      infuraProvider({ apiKey: infuraId }),
      jsonRpcProvider({
        rpc: (chain) => {
          return { http: chain.rpcUrls.default };
        },
      }),
    ]
  );

function App() {

  const connectors = connectorsForWallets([
    {
      groupName: 'Recommended',
      wallets: [
        wallet.injected({chains}),
        wallet.metaMask({chains}),
        wallet.walletConnect({ chains }),
        wallet.coinbase({chains, appName:"Luckdraw dapp"}),
        wallet.trust({chains}),
        wallet.ledger({chains})
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });


  return (
    <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains} theme={midnightTheme()}>
        <Layout></Layout>
        </RainbowKitProvider>
      </WagmiConfig>
  );
}

export default App;


