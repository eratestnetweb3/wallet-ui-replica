import { createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

export const supportedChain = baseSepolia;

export const wagmiConfig = createConfig({
  chains: [supportedChain],
  connectors: [injected({ shimDisconnect: true })],
  transports: {
    [supportedChain.id]: http(),
  },
});
