# Orbit Wallet UI

Dashboard wallet Web3 non-custodial dengan visual dark premium, multi-chain EVM, watch-only address, dan alur signing melalui wallet eksternal.

## Install dan menjalankan

```bash
npm install
npm run type-check
npm run dev
```

Build production:

```bash
npm run build
npm run preview
```

Aplikasi menggunakan hash routing agar kompatibel dengan GitHub Pages.

## Fitur

- Connect/disconnect MetaMask, Rabby, atau injected EIP-1193 wallet melalui Wagmi.
- Network selector dan dukungan Ethereum, Sepolia, Polygon, BNB Chain, Arbitrum, Optimism, serta Base melalui konfigurasi Wagmi.
- Overview portfolio, asset allocation, activity, security notice, dan responsive mobile layout.
- Watch-only wallet untuk public address EVM dengan validasi dan pencegahan duplikasi.
- Zustand typed store tanpa `persist`; tidak menyimpan credential maupun secret.
- Tidak meminta, membaca, menampilkan, atau menyimpan seed phrase/private key.

## Wallet connection flow

1. Klik **Connect wallet**.
2. Browser wallet eksternal akan menampilkan approval EIP-1193.
3. Aplikasi hanya membaca address, chain, dan balance publik.
4. Pergantian account atau network ditangani oleh Wagmi.
5. Semua transaksi harus dikonfirmasi dan ditandatangani di wallet eksternal.

Jika MetaMask/Rabby belum terpasang, aplikasi menampilkan peringatan install wallet. Jangan memasukkan seed phrase di website ini.

## Watch-only wallet

Gunakan **Watch address** dan masukkan public EVM address (`0x...`). Address tersebut hanya untuk observasi dan tidak memiliki kemampuan signing. Data watch-only hidup di runtime Zustand dan akan hilang ketika sesi aplikasi di-reset.

## Testnet guidance dan security note

Aplikasi ini adalah frontend wallet client, bukan custodial wallet. Jangan pernah memasukkan private key, seed phrase, password, atau credential ke source code, environment variable frontend, localStorage, maupun form aplikasi.

Sebelum menguji transaksi:

- gunakan Sepolia atau testnet lain;
- gunakan wallet testnet terpisah;
- verifikasi chain, recipient, token contract, allowance, dan estimasi gas;
- jangan gunakan dana utama;
- lakukan audit dan transaction simulation sebelum penggunaan mainnet.

Tampilan portfolio/activity dapat berisi data presentasi sampai indexer atau RPC portfolio provider terintegrasi. Karena itu project ini belum boleh disebut production-ready hanya berdasarkan build yang berhasil.
