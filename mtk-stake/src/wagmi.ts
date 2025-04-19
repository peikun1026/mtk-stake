import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "f488b2540ebca76cb6c75a6ddf10454b",
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  transports: {
    // 替换之前 不可用的 https://rpc.sepolia.org/
    [sepolia.id]: http(
      "https://sepolia.infura.io/v3/826f0639be6f42f18780b09f691892a5"
    ),
  },
  ssr: true,
});

export const defaultChainId = sepolia.id;
