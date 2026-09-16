# Nexa Wallet UI — Handoff Package

## Ringkasan

Nexa Wallet UI adalah frontend React 19 + Vite + Tailwind 4 untuk wallet Web3/DeFi. Aplikasi ini memiliki dashboard premium, navigasi multi-halaman, koneksi injected wallet, Base Sepolia sebagai jaringan testing, dukungan Ethereum/Base/BNB Chain, pembacaan saldo native, pembacaan saldo ERC-20, daftar token favorit dengan harga live, transfer ERC-20, allowance, approve, dan estimasi gas.

Aplikasi saat ini adalah **frontend wallet client**. Tidak ada private key, seed phrase, database, atau backend custody di dalam aplikasi. Semua transaksi harus ditandatangani oleh wallet pengguna seperti MetaMask.

## Struktur fitur utama

| Area | Lokasi | Fungsi |
|---|---|---|
| Router dan provider | `client/src/App.tsx`, `client/src/main.tsx` | Error boundary, tema, hash routing, Wagmi provider, React Query |
| Dashboard | `client/src/pages/Home.tsx` | Saldo demo, aktivitas, portfolio, promo, shortcut |
| Halaman resmi | `client/src/pages/FeaturePage.tsx` | Markets, Trade, Pay, Wallet, Settings, Help center |
| Konfigurasi chain | `client/src/lib/web3.ts` | Ethereum, Base, BNB Chain, Base Sepolia, injected connector |
| Koneksi wallet | `client/src/components/Web3WalletCard.tsx` | Connect, disconnect, switch network, native ETH balance, send testnet ETH |
| Saldo ERC-20 | `client/src/components/ERC20BalanceCard.tsx` | `name`, `symbol`, `decimals`, `balanceOf`, refresh 10 detik |
| Favorites dan harga | `client/src/components/ChainFavoritesCard.tsx` | ETH, BTC, USDC, BNB, CoinGecko refresh 30 detik |
| Transfer ERC-20 | `client/src/components/ERC20TransferCard.tsx` | Allowance, approve, transfer, gas estimate |
| Tampilan | `client/src/index.css` | Tema, layout, responsive design, animation, component styles |

## Menjalankan secara lokal

Gunakan Node.js 22 atau versi LTS yang kompatibel, lalu jalankan:

```bash
pnpm install
pnpm check
pnpm dev
```

Preview development biasanya tersedia pada `http://localhost:3000/`.

Untuk production build:

```bash
GITHUB_PAGES=true pnpm build
```

## Routing

Karena deployment menggunakan GitHub Pages, aplikasi memakai hash routing. Contoh URL:

```text
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/markets
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/trade
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/pay
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/wallet
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/settings
https://eratestnetweb3.github.io/wallet-ui-replica/#/wallet-ui-replica/help
```

Hash routing dipilih agar URL halaman dapat dibuka langsung tanpa 404 pada GitHub Pages.

## Web3 configuration

Default chain untuk fitur testing adalah Base Sepolia. Konfigurasi saat ini memakai public RPC melalui `http()` dari Viem. Untuk production, sebaiknya gunakan RPC provider resmi dan rate limit yang sesuai.

Chain yang dikonfigurasi:

- Ethereum Mainnet, chain ID `1`
- Base, chain ID `8453`
- BNB Chain, chain ID `56`
- Base Sepolia, chain ID `84532`

Connector saat ini adalah injected wallet. Ini mendukung wallet browser seperti MetaMask, Brave Wallet, dan provider EVM injected lainnya.

## Cara menguji wallet

1. Buka aplikasi melalui browser yang memiliki MetaMask atau injected EVM wallet.
2. Klik **Connect wallet**.
3. Untuk pengujian aman, pilih **Base Sepolia**.
4. Masukkan alamat ERC-20 Base Sepolia pada panel **ERC-20 token watch**.
5. Masukkan contract token, spender, recipient, dan amount pada panel **ERC-20 transfer**.
6. Periksa allowance dan gas estimate.
7. Hanya klik **Approve spender** jika alamat spender sudah diverifikasi.
8. Lanjutkan dengan **Send token** setelah detail transaksi benar.

Jangan menggunakan private key atau seed phrase di environment frontend. Jangan menguji transfer dengan dana mainnet sebelum audit dan pengujian testnet selesai.

## Batasan saat ini

Saldo total dashboard masih memakai data presentasi statis. Portfolio aggregation lintas token belum otomatis dijumlahkan dari blockchain. Token favorites menggunakan CoinGecko untuk harga, sehingga rate limit atau kegagalan layanan dapat menampilkan fallback. Transfer ERC-20 membutuhkan pengguna mengisi address token, spender, recipient, dan amount. Swap dan bridge belum terhubung ke DEX aggregator nyata.

## Rekomendasi pengembangan berikutnya

Tambahkan indexer seperti Alchemy, Moralis, Covalent, atau The Graph untuk transaction history dan portfolio aggregation. Gunakan DEX aggregator seperti 0x atau 1inch untuk quote, slippage, route, approval target, dan swap execution. Tambahkan simulasi transaksi sebelum signing, allowance revoke, token list resmi, address book, fiat on-ramp, push notification, dan security review.

Untuk mainnet, gunakan contract address resmi yang sudah diverifikasi. Tambahkan chain validation, gas sponsorship policy, slippage limit, transaction simulation, error mapping, analytics privacy controls, dan audit independen.

## Perintah pemeriksaan

```bash
pnpm check
GITHUB_PAGES=true pnpm build
```

Kedua perintah tersebut harus berhasil sebelum deployment.

## Catatan untuk AI atau coding tool lain

Saat meminta AI lain melanjutkan aplikasi, berikan file ini bersama `AI_CONTEXT.md`. Minta AI mempertahankan React 19, TypeScript strict mode, Wagmi/Viem, Base Sepolia sebagai default testing chain, hash routing GitHub Pages, dan larangan menyimpan private key. Minta AI mengubah file frontend secara modular dan menjalankan `pnpm check` serta `GITHUB_PAGES=true pnpm build` setelah perubahan.
