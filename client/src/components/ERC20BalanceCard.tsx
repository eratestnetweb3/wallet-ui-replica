import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Clock3, Coins, Loader2, RefreshCw, SearchCheck } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits, isAddress } from "viem";
import { supportedChain } from "@/lib/web3";

const erc20MetadataAbi = [
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
] as const;

const erc20BalanceAbi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ name: "account", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

const savedTokenKey = "nexa-erc20-token";

export default function ERC20BalanceCard() {
  const { address, isConnected } = useAccount();
  const [tokenInput, setTokenInput] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");

  useEffect(() => {
    setTokenInput(localStorage.getItem(savedTokenKey) ?? "");
  }, []);

  const validToken = isAddress(tokenAddress);
  const contractAddress = validToken ? (tokenAddress as `0x${string}`) : undefined;
  const enabled = Boolean(isConnected && address && contractAddress);
  const queryOptions = { enabled, refetchInterval: 10_000 } as const;

  const symbolRead = useReadContract({ address: contractAddress, abi: erc20MetadataAbi, functionName: "symbol", chainId: supportedChain.id, query: queryOptions });
  const nameRead = useReadContract({ address: contractAddress, abi: erc20MetadataAbi, functionName: "name", chainId: supportedChain.id, query: queryOptions });
  const decimalsRead = useReadContract({ address: contractAddress, abi: erc20MetadataAbi, functionName: "decimals", chainId: supportedChain.id, query: queryOptions });
  const balanceRead = useReadContract({ address: contractAddress, abi: erc20BalanceAbi, functionName: "balanceOf", args: address ? [address] : undefined, chainId: supportedChain.id, query: queryOptions });

  const isLoading = symbolRead.isLoading || nameRead.isLoading || decimalsRead.isLoading || balanceRead.isLoading;
  const readError = symbolRead.error || nameRead.error || decimalsRead.error || balanceRead.error;
  const tokenDecimals = typeof decimalsRead.data === "number" ? decimalsRead.data : 18;
  const formattedBalance = typeof balanceRead.data === "bigint" ? formatUnits(balanceRead.data, tokenDecimals) : null;
  const shortBalance = useMemo(() => {
    if (formattedBalance === null) return "—";
    const numeric = Number(formattedBalance);
    return Number.isFinite(numeric) ? numeric.toLocaleString(undefined, { maximumFractionDigits: 6 }) : formattedBalance;
  }, [formattedBalance]);

  const loadToken = () => {
    const normalized = tokenInput.trim();
    if (!isAddress(normalized)) {
      toast.error("Enter a valid ERC-20 contract address");
      return;
    }
    localStorage.setItem(savedTokenKey, normalized);
    setTokenAddress(normalized);
    toast.success("Token contract loaded", { description: "Balance refreshes every 10 seconds." });
  };

  const refresh = () => {
    void Promise.all([symbolRead.refetch(), nameRead.refetch(), decimalsRead.refetch(), balanceRead.refetch()]);
    toast("Refreshing token balance");
  };

  return (
    <section className="erc20-card">
      <div className="erc20-header"><div className="erc20-title-wrap"><span className="erc20-icon"><Coins size={19} /></span><div><span className="section-kicker">SMART CONTRACT BALANCE</span><h3>ERC-20 token watch</h3></div></div><div className="erc20-chain"><span className="online-dot" />Base Sepolia</div></div>
      <div className="erc20-form"><input aria-label="ERC-20 token contract address" placeholder="Paste ERC-20 contract address 0x..." value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") loadToken(); }} /><button onClick={loadToken}><SearchCheck size={15} /> Load token</button></div>
      {!isConnected && <div className="erc20-empty"><AlertCircle size={15} /> Connect your wallet first to read its token balance.</div>}
      {isConnected && !validToken && <div className="erc20-empty"><AlertCircle size={15} /> Enter a token contract address on Base Sepolia to begin.</div>}
      {isConnected && validToken && <div className="erc20-result"><div className="erc20-asset"><span className="erc20-token-mark">{typeof symbolRead.data === "string" ? symbolRead.data.slice(0, 1) : "T"}</span><div><b>{typeof nameRead.data === "string" ? nameRead.data : "ERC-20 token"}</b><span>{typeof symbolRead.data === "string" ? symbolRead.data : "Loading symbol..."} · {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}</span></div></div><div className="erc20-balance"><span>Your balance</span><strong>{isLoading ? <Loader2 size={16} className="spin" /> : readError ? "Read error" : shortBalance}</strong><small>{typeof symbolRead.data === "string" ? symbolRead.data : "TOKEN"}</small></div><button className="erc20-refresh" onClick={refresh} aria-label="Refresh token balance"><RefreshCw size={15} /></button></div>}
      {readError && validToken && <div className="erc20-error"><AlertCircle size={14} /> This contract did not return a standard ERC-20 response on Base Sepolia.</div>}
      <div className="erc20-footer"><span><Clock3 size={12} /> Auto-refresh every 10 seconds</span><span>Read-only · no transaction requested</span></div>
    </section>
  );
}
