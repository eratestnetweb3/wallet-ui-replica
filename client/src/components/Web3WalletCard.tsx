import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  LockKeyhole,
  Network,
  PlugZap,
  Send,
  WalletCards,
} from "lucide-react";
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, isAddress, parseEther } from "viem";
import { supportedChain } from "@/lib/web3";

function shortAddress(address?: string) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";
}

export default function Web3WalletCard() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: balance, isLoading: isBalanceLoading } = useBalance({ address, chainId: supportedChain.id, query: { enabled: Boolean(address) } });
  const { data: hash, sendTransaction, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const wrongNetwork = isConnected && chainId !== supportedChain.id;

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard?.writeText(address);
    toast.success("Address copied");
  };

  const submitTransfer = () => {
    if (!isConnected || wrongNetwork) return toast.error(`Switch to ${supportedChain.name} first`);
    if (!isAddress(recipient)) return toast.error("Enter a valid recipient address");
    if (!amount || Number(amount) <= 0) return toast.error("Enter an amount greater than 0");
    try {
      sendTransaction({ to: recipient as `0x${string}`, value: parseEther(amount) });
    } catch {
      toast.error("Transaction could not be prepared");
    }
  };

  if (!isConnected) {
    return (
      <section className="web3-card disconnected-web3">
        <div className="web3-icon"><PlugZap size={20} /></div>
        <div className="web3-copy"><span className="section-kicker">LIVE WALLET MODE</span><h3>Connect your wallet to unlock DeFi</h3><p>Use MetaMask, Brave Wallet, or any injected EVM wallet. Your keys stay in your wallet.</p></div>
        <button className="web3-connect-button" onClick={() => connect({ connector: connectors[0] })} disabled={isConnecting}><WalletCards size={16} />{isConnecting ? "Connecting..." : "Connect wallet"}</button>
      </section>
    );
  }

  return (
    <section className="web3-card connected-web3">
      <div className="web3-wallet-meta"><div className="web3-icon connected"><CheckCircle2 size={20} /></div><div className="web3-copy"><span className="section-kicker">CONNECTED WALLET</span><h3>{shortAddress(address)}</h3><button className="address-copy" onClick={copyAddress}>{address} <Copy size={12} /></button></div></div>
      <div className="web3-balance"><span>BASE SEPOLIA BALANCE</span><strong>{isBalanceLoading ? "Loading..." : `${balance ? Number(formatUnits(balance.value, balance.decimals)).toFixed(4) : "0.0000"} ${balance?.symbol ?? "ETH"}`}</strong><small>Testnet only · no real funds</small></div>
      <div className="web3-actions"><div className="network-status"><Network size={14} /><span className={wrongNetwork ? "network-wrong" : "network-ok"}>{wrongNetwork ? "Wrong network" : supportedChain.name}</span>{wrongNetwork && <button onClick={() => switchChain({ chainId: supportedChain.id })}>{isSwitching ? "Switching..." : "Switch"}</button>}</div><button className="disconnect-web3" onClick={() => disconnect()}>Disconnect</button></div>
      <div className="web3-send"><div className="send-title"><Send size={14} /><b>Send testnet ETH</b><span>Signs in your wallet</span></div><div className="send-fields"><input aria-label="Recipient address" placeholder="Recipient 0x..." value={recipient} onChange={(e) => setRecipient(e.target.value)} /><input aria-label="Amount in ETH" inputMode="decimal" placeholder="0.001 ETH" value={amount} onChange={(e) => setAmount(e.target.value)} /><button onClick={submitTransfer} disabled={isSending || isConfirming || wrongNetwork}>{isSending || isConfirming ? <Loader2 size={15} className="spin" /> : <ArrowUpRight size={15} />} {isConfirmed ? "Confirmed" : "Send"}</button></div>{hash && <a className="tx-link" href={`https://sepolia.basescan.org/tx/${hash}`} target="_blank" rel="noreferrer">View transaction <ExternalLink size={12} /></a>}</div>
      <div className="web3-safe-note"><LockKeyhole size={13} /> Never share your seed phrase or private key with this app.</div>
    </section>
  );
}
