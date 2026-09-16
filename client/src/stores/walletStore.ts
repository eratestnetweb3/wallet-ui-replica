import { create } from "zustand";

export type WatchWallet = { address: `0x${string}`; label: string };
type WalletState = { watchWallets: WatchWallet[]; addWatchWallet: (wallet: WatchWallet) => void; removeWatchWallet: (address: string) => void; clearLocalState: () => void };

export const useWalletStore = create<WalletState>((set) => ({
  watchWallets: [],
  addWatchWallet: (wallet) => set((state) => ({ watchWallets: [...state.watchWallets, wallet] })),
  removeWatchWallet: (address) => set((state) => ({ watchWallets: state.watchWallets.filter((wallet) => wallet.address !== address) })),
  clearLocalState: () => set({ watchWallets: [] }),
}));
