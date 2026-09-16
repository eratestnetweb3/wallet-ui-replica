# Environment Template

The current application uses public Viem transports and does not require a secret to run. For production, configure public RPC endpoints through the deployment platform rather than committing them to the repository.

Recommended public configuration names are:

```text
VITE_ETHEREUM_RPC_URL
VITE_BASE_RPC_URL
VITE_BSC_RPC_URL
VITE_BASE_SEPOLIA_RPC_URL
VITE_PRICE_API_KEY
```

Never create frontend variables containing `PRIVATE_KEY`, `SEED_PHRASE`, `MNEMONIC`, or wallet custody credentials. Any variable prefixed with `VITE_` is visible to the browser and must be treated as public.
