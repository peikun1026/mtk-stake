import { sepolia } from "viem/chains";
import { PublicClient, createPublicClient, http } from "viem";

// 根据传入的chainId, 返回对应链的PublicClient实例对象，用于与合约进行只读交互，只配置了sepolia

export const getViemClient = (chainId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient;
  } = {
    [sepolia.id]: createPublicClient({
      chain: sepolia,
      transport: http(
        "https://sepolia.infura.io/v3/826f0639be6f42f18780b09f691892a5"
      ),
    }),
  };

  return clients[chainId];
};
