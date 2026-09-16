# AI Context — Nexa Wallet UI

You are continuing development of a React 19 + TypeScript + Vite + Tailwind 4 Web3 wallet frontend named Nexa Wallet.

## Product intent

Make the interface feel like a production-grade Web3 DeFi wallet. Preserve the premium light visual system: warm off-white background, dark ink navigation, lime accent, soft borders, rounded cards, clear hierarchy, responsive mobile behavior, and concise micro-interactions.

## Existing capabilities

- Injected wallet connection through Wagmi.
- Viem contract reads and writes.
- React Query through Wagmi provider.
- Ethereum, Base, BNB Chain, and Base Sepolia configured.
- Base Sepolia is the safe default testing chain.
- Native ETH balance and testnet ETH send flow.
- ERC-20 `name`, `symbol`, `decimals`, and `balanceOf` reads.
- ERC-20 allowance read, approve, transfer, and gas estimation.
- Favorite token prices through CoinGecko with 30-second refresh.
- Hash routing for GitHub Pages.
- Multi-page screens: Home, Markets, Trade, Pay, Wallet, Settings, Help center.

## Important safety rules

Never add private keys, seed phrases, custody logic, or automatic signing. Transactions must be explicitly signed by the connected wallet. Keep testnet as the default while developing. Validate chain IDs, addresses, amounts, spender addresses, gas, slippage, and transaction state. Do not silently switch to mainnet.

## Important files

- `client/src/App.tsx`: app providers, hash routing, route map.
- `client/src/pages/Home.tsx`: dashboard and dashboard navigation.
- `client/src/pages/FeaturePage.tsx`: feature-page shell and feature screens.
- `client/src/lib/web3.ts`: chains, labels, wagmi configuration.
- `client/src/components/Web3Provider.tsx`: Wagmi and React Query providers.
- `client/src/components/Web3WalletCard.tsx`: wallet connect, network switch, native balance, testnet send.
- `client/src/components/ERC20BalanceCard.tsx`: ERC-20 read-only balance watcher.
- `client/src/components/ChainFavoritesCard.tsx`: chains, favorites, CoinGecko prices.
- `client/src/components/ERC20TransferCard.tsx`: allowance, approve, transfer, gas estimates.
- `client/src/index.css`: all visual styling.
- `WALLET_HANDOFF.md`: full implementation and operational handoff.

## Development requirements

Use modular React components. Keep server code untouched unless explicitly required. Do not put assets in `client/public` except small configuration files. Run these checks after changes:

```bash
pnpm check
GITHUB_PAGES=true pnpm build
```

## Suggested next improvements

Implement a real token registry with verified contract addresses and chain-specific decimals. Add a DEX aggregator with quote, route, price impact, minimum received, slippage protection, approval target, transaction simulation, and receipt tracking. Add a portfolio indexer and transaction history. Add account abstraction or sponsored gas only after the explicit signing and security model is documented.
