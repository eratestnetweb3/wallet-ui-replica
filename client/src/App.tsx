import { useEffect, useMemo, useState } from "react";
import { Link, Route, Router, Switch, useLocation } from "wouter";
import { useAccount, useBalance, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { formatUnits } from "viem";
import { BarChart3, Bell, ChevronDown, CircleHelp, Copy, ExternalLink, Eye, EyeOff, History, LayoutDashboard, Menu, Plus, PlugZap, Search, Send, Settings2, ShieldCheck, Sparkles, Wallet, X } from "lucide-react";
import { toast } from "sonner";
import { appChains, chainLabels, supportedChain } from "@/lib/web3";
import { useWalletStore } from "@/stores/walletStore";
import NotFound from "@/pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const nav = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Assets", href: "/assets", icon: Wallet },
  { label: "Activity", href: "/activity", icon: History },
  { label: "DApps", href: "/dapps", icon: PlugZap },
  { label: "Security", href: "/security", icon: ShieldCheck },
];

const tokens = [
  { name: "Ethereum", symbol: "ETH", amount: "0.8421", value: "$2,886.32", color: "#8b8cff", change: "+2.18%" },
  { name: "USD Coin", symbol: "USDC", amount: "2,420.00", value: "$2,420.00", color: "#4d9fff", change: "+0.01%" },
  { name: "Tether", symbol: "USDT", amount: "1,008.20", value: "$1,008.20", color: "#36c99b", change: "+0.02%" },
  { name: "Arbitrum", symbol: "ARB", amount: "412.60", value: "$418.50", color: "#5d9eff", change: "-1.20%" },
];

function shortAddress(address?: string) { return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"; }

function WalletDashboard() {
  const [location] = useLocation();
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: balance } = useBalance({ address, chainId: chainId ?? supportedChain.id, query: { enabled: Boolean(address) } });
  const [hideBalance, setHideBalance] = useState(false);
  const [watchAddress, setWatchAddress] = useState("");
  const [showWatchForm, setShowWatchForm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { watchWallets, addWatchWallet, removeWatchWallet } = useWalletStore();
  const activeLabel = nav.find((item) => item.href === location)?.label ?? "Overview";
  const isWrongNetwork = isConnected && chainId !== supportedChain.id;
  const nativeBalance = balance ? Number(formatUnits(balance.value, balance.decimals)).toFixed(4) : "0.0000";
  const visibleTokens = useMemo(() => tokens, []);

  const connectWallet = () => {
    const connector = connectors[0];
    if (!connector) return toast.error("Browser wallet tidak ditemukan. Install MetaMask atau Rabby.");
    connect({ connector });
  };
  const addWatchOnly = () => {
    const normalized = watchAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(normalized)) return toast.error("Masukkan public address EVM yang valid.");
    if (watchWallets.some((wallet) => wallet.address.toLowerCase() === normalized.toLowerCase())) return toast.error("Address sudah terdaftar.");
    addWatchWallet({ address: normalized, label: `Watch ${watchWallets.length + 1}` });
    setWatchAddress(""); setShowWatchForm(false); toast.success("Watch-only wallet ditambahkan.");
  };
  const copy = async () => { if (address) { await navigator.clipboard?.writeText(address); toast.success("Address disalin"); } };

  return <div className="app-shell">
    <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand"><span className="brand-orb">◈</span><span>orbit<span className="brand-accent">.</span></span></div>
      <div className="profile-chip"><span className="profile-avatar">{isConnected ? "C" : "G"}</span><div><b>{isConnected ? "Connected wallet" : "Guest workspace"}</b><small>{shortAddress(address)}</small></div><ChevronDown size={15} /></div>
      <p className="nav-caption">WORKSPACE</p><nav>{nav.map(({ label, href, icon: Icon }) => <Link key={href} href={href} className={location === href ? "nav-item active" : "nav-item"} onClick={() => setMobileOpen(false)}><Icon size={18} /><span>{label}</span>{label === "Security" && <span className="nav-dot" />}</Link>)}</nav>
      <div className="sidebar-spacer" /><Link href="/settings" className="nav-item"><Settings2 size={18} /><span>Settings</span></Link><Link href="/help" className="nav-item"><CircleHelp size={18} /><span>Help center</span></Link>
      <div className="secure-pill"><ShieldCheck size={15} /><span>Non-custodial by design</span></div>
    </aside>
    {mobileOpen && <button className="mobile-backdrop" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <main className="app-main">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div><span className="breadcrumb">Workspace / </span><strong>{activeLabel}</strong></div><div className="topbar-actions"><label className="search"><Search size={16} /><input placeholder="Search assets..." /></label><button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button><button className="network-select" onClick={() => switchChain?.({ chainId: supportedChain.id })}>{isSwitching ? "Switching..." : (chainLabels[chainId ?? supportedChain.id] ?? "Select network")}<ChevronDown size={15} /></button><button className="wallet-badge" onClick={isConnected ? () => disconnect() : connectWallet}><span className={isConnected ? "status-dot" : "status-dot muted"} />{isConnected ? shortAddress(address) : "Connect wallet"}</button></div></header>
      <div className="page-content"><div className="page-heading"><div><p className="eyebrow">{isConnected ? "LIVE ON-CHAIN OVERVIEW" : "PRIVATE WALLET WORKSPACE"}</p><h1>{activeLabel}</h1><p className="muted">A calm, clear view of your digital assets and permissions.</p></div><button className="primary-btn" onClick={connectWallet} disabled={isPending}><Plus size={17} />{isPending ? "Connecting..." : "Connect wallet"}</button></div>
        {isWrongNetwork && <div className="warning-banner"><ShieldCheck size={18} /><div><b>Network mismatch</b><span>Switch to {supportedChain.name} before signing transactions.</span></div><button onClick={() => switchChain({ chainId: supportedChain.id })}>Switch network</button></div>}
        <section className="metrics-grid"><div className="balance-card"><div className="card-top"><span className="eyebrow">TOTAL PORTFOLIO</span><button className="ghost-icon" onClick={() => setHideBalance(!hideBalance)} aria-label="Toggle balance">{hideBalance ? <Eye size={17} /> : <EyeOff size={17} />}</button></div><strong className="balance-number">{hideBalance ? "••••••" : "$8,438.05"}</strong><div className="positive">↗ +$182.40 <span>+2.21% today</span></div><div className="balance-footer"><span><span className="status-dot" /> {isConnected ? "Wallet synced" : "Demo data"}</span><button onClick={copy}><Copy size={14} /> {shortAddress(address)}</button></div></div><div className="metric-card"><span className="eyebrow">24H PERFORMANCE</span><strong>+$182.40</strong><span className="positive">+2.21%</span><div className="sparkline">╱╲╱╲╱╲╱</div></div><div className="metric-card violet"><span className="eyebrow">NETWORK STATUS</span><strong>{isWrongNetwork ? "Review" : "Healthy"}</strong><span>{chainLabels[chainId ?? supportedChain.id] ?? "EVM network"}</span><div className="health"><i /><i /><i /><i /><i /><i /></div></div></section>
        <div className="content-grid"><section className="panel assets-panel"><div className="panel-heading"><div><p className="eyebrow">ASSET ALLOCATION</p><h2>Your assets</h2></div><Link href="/assets" className="text-link">View all <ExternalLink size={14} /></Link></div><div className="allocation"><div className="donut"><span>$8.4k<small>total value</small></span></div><div className="legend"><span><i className="legend-eth" /> ETH <b>34.2%</b></span><span><i className="legend-usdc" /> Stablecoins <b>40.6%</b></span><span><i className="legend-arb" /> L2 tokens <b>25.2%</b></span></div></div>{visibleTokens.slice(0, 3).map((token) => <div className="token-row" key={token.symbol}><span className="token-icon" style={{ background: token.color }}>{token.symbol.slice(0, 1)}</span><div className="token-name"><b>{token.name}</b><small>{token.symbol}</small></div><div className="token-amount"><b>{token.amount}</b><small>{token.value}</small></div><span className="token-change">{token.change}</span></div>)}</section><section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>Latest transactions</h2></div><Link href="/activity" className="text-link">See history <ExternalLink size={14} /></Link></div><div className="activity-row"><span className="activity-icon sent"><Send size={17} /></span><div><b>Sent ETH</b><small>To 0x71...9C2A · 2 min ago</small></div><strong>-0.12 ETH</strong></div><div className="activity-row"><span className="activity-icon swap"><Sparkles size={17} /></span><div><b>Swapped USDC</b><small>via 1inch · Yesterday</small></div><strong>+0.08 ETH</strong></div><div className="activity-row"><span className="activity-icon received"><Wallet size={17} /></span><div><b>Received USDC</b><small>From 0xA4...11D0 · 2 days ago</small></div><strong>+420 USDC</strong></div><div className="security-note"><ShieldCheck size={17} /><span>Always review the recipient, network, and estimated gas in your external wallet before confirming.</span></div></section></div>
        <section className="bottom-row"><div className="panel quick-panel"><p className="eyebrow">QUICK ACTIONS</p><div className="quick-actions"><button onClick={() => toast("Send flow tersedia di halaman Wallet") }><Send size={18} /><b>Send</b><small>Transfer assets</small></button><Link href="/dapps"><PlugZap size={18} /><b>Connect DApp</b><small>Review permissions</small></Link><button onClick={() => setShowWatchForm(true)}><Eye size={18} /><b>Watch address</b><small>Track publicly</small></button></div></div><div className="panel watch-panel"><div className="panel-heading"><div><p className="eyebrow">WATCH-ONLY</p><h2>Public addresses</h2></div><button className="ghost-icon" onClick={() => setShowWatchForm(!showWatchForm)}><Plus size={17} /></button></div>{watchWallets.length === 0 ? <p className="muted">No watch-only wallets yet. Public addresses never grant signing access.</p> : watchWallets.map((wallet) => <div className="watch-row" key={wallet.address}><Eye size={15} /><span>{wallet.label}<small>{shortAddress(wallet.address)}</small></span><button onClick={() => removeWatchWallet(wallet.address)}><X size={15} /></button></div>)}{showWatchForm && <div className="watch-form"><input value={watchAddress} onChange={(event) => setWatchAddress(event.target.value)} placeholder="0x public address" /><button onClick={addWatchOnly}>Add</button></div>}</div></section>
      </div>
    </main>
  </div>;
}

function AppRouter() { return <Router hook={() => { const [path, setPath] = useState(window.location.hash.slice(1) || "/"); useEffect(() => { const fn = () => setPath(window.location.hash.slice(1) || "/"); window.addEventListener("hashchange", fn); return () => window.removeEventListener("hashchange", fn); }, []); return [path, (next: string) => { window.location.hash = next; }] as [string, (next: string) => void]; }}><Switch><Route path="/:rest*" component={WalletDashboard} /><Route component={NotFound} /></Switch></Router>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><AppRouter /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
