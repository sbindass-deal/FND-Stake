import React from "react";
import '../src/Assets/css/bootstrap.min.css'
import '../src/Assets/fonts/ic_style.css'
import '../src/Assets/css/progresscircle.css'
import '../src/Assets/css/style.css'
import '../src/Assets/css/responsive.css'
import Layout from './Components/Layout'
import { useState } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { infuraId, server } from "./config";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  polygonMumbai
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [mainnet, polygon, optimism, arbitrum, goerli, polygonMumbai],
  [infuraProvider({ apiKey: infuraId }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "FNDSTAKE",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});
function App() {
  const [isNewPostFormOpen, setIsNewPostFormOpen] = useState(false);

  // prettier-ignore
  return (
    <>
      <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
        <Layout></Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
