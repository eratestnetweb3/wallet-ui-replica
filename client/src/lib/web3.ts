import { createConfig, http } from "wagmi";
import { base, baseSepolia, bsc, mainnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const supportedChain = baseSepolia;
export const appChains = [mainnet, base, bsc, baseSepolia] as const;

export const chainLabels: Record<number, string> = {
  [mainnet.id]: "Ethereum",
  [base.id]: "Base",
  [bsc.id]: "BNB Chain",
  [baseSepolia.id]: "Base Sepolia",
};

export const wagmiConfig = createConfig({
  chains: appChains,
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [bsc.id]: http(),
    [baseSepolia.id]: http(),
  },
});
