import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Fuel, Loader2, Send, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useEstimateGas, useReadContract, useWriteContract } from "wagmi";
import { encodeFunctionData, formatUnits, isAddress, parseUnits } from "viem";
import { supportedChain } from "@/lib/web3";

const transferAbi = [{ type: "function", name: "transfer", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] }] as const;
const allowanceAbi = [{ type: "function", name: "allowance", stateMutability: "view", inputs: [{ name: "owner", type: "address" }, { name: "spender", type: "address" }], outputs: [{ type: "uint256" }] }] as const;
const decimalsAbi = [{ type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] }] as const;
const approveAbi = [{ type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] }] as const;

export default function ERC20TransferCard() {
  const { address, isConnected } = useAccount();
  const [tokenInput, setTokenInput] = useState("");
  const [spenderInput, setSpenderInput] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const tokenAddress = isAddress(tokenInput) ? tokenInput as `0x${string}` : undefined;
  const spender = isAddress(spenderInput) ? spenderInput as `0x${string}` : undefined;
  const recipientAddress = isAddress(recipient) ? recipient as `0x${string}` : undefined;
  const decimalsRead = useReadContract({ address: tokenAddress, abi: decimalsAbi, functionName: "decimals", chainId: supportedChain.id, query: { enabled: Boolean(tokenAddress), refetchInterval: 60_000 } });
  const decimals = typeof decimalsRead.data === "number" ? decimalsRead.data : 18;
  const amountUnits = amount && Number(amount) > 0 ? (() => { try { return parseUnits(amount, decimals); } catch { return undefined; } })() : undefined;
  const allowanceRead = useReadContract({ address: tokenAddress, abi: allowanceAbi, functionName: "allowance", args: address && spender ? [address, spender] : undefined, chainId: supportedChain.id, query: { enabled: Boolean(tokenAddress && address && spender), refetchInterval: 10_000 } });
  const transferData = recipientAddress && amountUnits !== undefined ? encodeFunctionData({ abi: transferAbi, functionName: "transfer", args: [recipientAddress, amountUnits] }) : undefined;
  const approveData = spender && amountUnits !== undefined ? encodeFunctionData({ abi: approveAbi, functionName: "approve", args: [spender, amountUnits] }) : undefined;
  const gasEstimate = useEstimateGas({ account: address, to: tokenAddress, data: transferData, chainId: supportedChain.id, query: { enabled: Boolean(address && tokenAddress && transferData) } });
  const approveGasEstimate = useEstimateGas({ account: address, to: tokenAddress, data: approveData, chainId: supportedChain.id, query: { enabled: Boolean(address && tokenAddress && approveData) } });
  const { writeContract, isPending: isWriting, data: txHash } = useWriteContract();

  useEffect(() => { if (txHash) toast.success("Transaction submitted", { description: "Wait for confirmation in your wallet." }); }, [txHash]);

  const approve = () => {
    if (!isConnected || !tokenAddress || !spender || amountUnits === undefined) return toast.error("Fill token, spender, and amount first");
    writeContract({ address: tokenAddress, abi: approveAbi, functionName: "approve", args: [spender, amountUnits], chainId: supportedChain.id });
  };
  const send = () => {
    if (!isConnected || !tokenAddress || !recipientAddress || amountUnits === undefined) return toast.error("Fill token, recipient, and amount first");
    writeContract({ address: tokenAddress, abi: transferAbi, functionName: "transfer", args: [recipientAddress, amountUnits], chainId: supportedChain.id });
  };
  const allowanceText = typeof allowanceRead.data === "bigint" ? formatUnits(allowanceRead.data, decimals) : "—";
  const hasAllowance = typeof allowanceRead.data === "bigint" && amountUnits !== undefined && allowanceRead.data >= amountUnits;

  return <section className="transfer-card"><div className="transfer-header"><div className="transfer-title"><span className="transfer-icon"><Send size={18} /></span><div><span className="section-kicker">TOKEN ACTIONS</span><h3>ERC-20 transfer</h3></div></div><span className="readonly-label"><ShieldCheck size={12} /> Wallet signs every step</span></div><div className="transfer-grid"><input placeholder="Token contract 0x..." value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} /><input placeholder="Spender / router 0x..." value={spenderInput} onChange={(e) => setSpenderInput(e.target.value)} /><input placeholder="Recipient 0x..." value={recipient} onChange={(e) => setRecipient(e.target.value)} /><input placeholder="Amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div><div className="allowance-row"><span><ShieldCheck size={13} /> Current allowance</span><b>{allowanceText}</b><span className={hasAllowance ? "allowance-good" : "allowance-needed"}>{hasAllowance ? <><CheckCircle2 size={13} /> Enough allowance</> : "Approve required"}</span></div><div className="gas-row"><span><Fuel size={13} /> Transfer gas estimate</span><b>{gasEstimate.data ? `~${gasEstimate.data.toString()} gas` : "Enter token, recipient & amount"}</b><span>{approveGasEstimate.data ? `Approve ~${approveGasEstimate.data.toString()} gas` : ""}</span></div><div className="transfer-actions"><button onClick={approve} disabled={isWriting || !spender || !tokenAddress || amountUnits === undefined}>{isWriting ? <Loader2 size={14} className="spin" /> : <ShieldCheck size={14} />} Approve spender</button><button className="transfer-send" onClick={send} disabled={isWriting || !recipientAddress || !tokenAddress || amountUnits === undefined}><Send size={14} /> Send token</button></div>{txHash && <div className="transfer-submitted"><CheckCircle2 size={14} /> Submitted: {txHash.slice(0, 10)}...{txHash.slice(-8)}</div>}<div className="transfer-note"><AlertCircle size={13} /> Test on Base Sepolia first. Never approve an unknown spender.</div></section>;
}
