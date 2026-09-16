import { useLocation } from "wouter";
import { ArrowLeft, ArrowUpRight, BarChart3, CheckCircle2, CircleHelp, CreditCard, ExternalLink, FileText, Gift, Globe2, History, LayoutDashboard, LockKeyhole, Network, Search, Settings2, ShieldCheck, Sparkles, TrendingUp, WalletCards, Zap } from "lucide-react";
import Web3WalletCard from "@/components/Web3WalletCard";
import ERC20BalanceCard from "@/components/ERC20BalanceCard";
import ChainFavoritesCard from "@/components/ChainFavoritesCard";
import ERC20TransferCard from "@/components/ERC20TransferCard";

const base = "/wallet-ui-replica";
const nav = [
  ["Home", "", LayoutDashboard], ["Markets", "/markets", TrendingUp], ["Trade", "/trade", Zap], ["Pay", "/pay", CreditCard], ["Wallet", "/wallet", WalletCards],
] as const;

const pageData: Record<string, { kicker: string; title: string; description: string }> = {
  Markets: { kicker: "DISCOVER THE MARKET", title: "Markets", description: "Track live prices, favorite assets, and the networks where you deploy capital." },
  Trade: { kicker: "EXECUTE WITH CONFIDENCE", title: "Trade", description: "Swap, bridge, and manage approvals with clear route details before you sign." },
  Pay: { kicker: "PAY ANYWHERE", title: "Pay", description: "Send crypto, scan a QR code, and review every transaction before it leaves your wallet." },
  Wallet: { kicker: "YOUR ASSET CONTROL CENTER", title: "Wallet", description: "Inspect on-chain balances, manage token approvals, and keep your portfolio organized." },
  Settings: { kicker: "CONTROL CENTER", title: "Settings", description: "Configure security, preferences, networks, and the way Nexa behaves." },
  "Help center": { kicker: "NEXA SUPPORT", title: "Help center", description: "Guides and safety checks for connecting, transacting, and using DeFi responsibly." },
};

function Side({ active }: { active: string }) {
  const [, setLocation] = useLocation();
  return <aside className="sidebar"><button className="brand-lockup brand-button" onClick={() => setLocation(`${base}/`)}><div className="brand-mark"><span /></div><span>nexa</span></button><div className="account-pill"><div className="avatar">S</div><div className="account-copy"><b>samira.eth</b><span>0x84...a3E9</span></div></div><div className="sidebar-label">Workspace</div><nav className="side-nav">{nav.map(([label, path, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => setLocation(`${base}${path || "/"}`)}><Icon size={18} /><span>{label}</span>{label === "Trade" && <span className="nav-dot" />}</button>)}</nav><div className="sidebar-spacer" /><button className={`side-link ${active === "Help center" ? "active-side" : ""}`} onClick={() => setLocation(`${base}/help`)}><CircleHelp size={18} /><span>Help center</span></button><button className={`side-link ${active === "Settings" ? "active-side" : ""}`} onClick={() => setLocation(`${base}/settings`)}><Settings2 size={18} /><span>Settings</span></button><div className="sidebar-footer"><div className="secure-badge"><span className="secure-dot" /> Secured by Nexa Guard</div><span className="version">v2.4.0</span></div></aside>;
}

function Top({ active }: { active: string }) {
  const [, setLocation] = useLocation();
  return <header className="topbar"><button className="mobile-menu" onClick={() => setLocation(`${base}/`)}><ArrowLeft size={19} /></button><div className="breadcrumb"><span>Wallet</span><span className="slash">/</span><b>{active}</b></div><div className="top-actions"><label className="search-box"><Search size={16} /><input placeholder="Search assets, features..." /></label><button className="icon-button"><Network size={18} /></button><button className="icon-button"><ShieldCheck size={18} /></button><div className="top-avatar">S</div></div></header>;
}

function BackButton() { const [, setLocation] = useLocation(); return <button className="back-button" onClick={() => setLocation(`${base}/`)}><ArrowLeft size={15} /> Back to dashboard</button>; }

function MarketsPage() { return <><ChainFavoritesCard /><div className="feature-grid-two"><div className="feature-card"><div className="feature-card-icon green"><BarChart3 size={19} /></div><span className="section-kicker">MARKET INTELLIGENCE</span><h3>Live market overview</h3><p>Compare momentum, volume, and network availability before you open a trade.</p><button className="feature-cta">Open screener <ArrowUpRight size={14} /></button></div><div className="feature-card dark-feature"><span className="section-kicker">CURATED FOR YOU</span><h3>Top movers</h3><div className="mover-line"><b>ARGUS</b><span className="positive">+18.42%</span></div><div className="mover-line"><b>ETH</b><span className="positive">+2.18%</span></div><div className="mover-line"><b>BTC</b><span className="positive">+4.06%</span></div></div></div></>; }
function TradePage() { return <><div className="feature-hero"><div><span className="section-kicker">NEXA ROUTER</span><h3>Trade without guesswork.</h3><p>Choose a route, review price impact, and sign only after the quote is clear.</p></div><div className="feature-hero-orb"><Zap size={28} /></div></div><ERC20TransferCard /><div className="feature-card"><div className="feature-card-icon lilac"><History size={19} /></div><span className="section-kicker">TRADE ACTIVITY</span><h3>Recent swaps & bridges</h3><p>Your signed activity will appear here after connecting a wallet.</p><button className="feature-cta">View transaction history <ArrowUpRight size={14} /></button></div></>; }
function PayPage() { return <><Web3WalletCard /><div className="feature-grid-two"><div className="feature-card"><div className="feature-card-icon blue"><CreditCard size={19} /></div><span className="section-kicker">PAYMENTS</span><h3>Send and receive</h3><p>Share your address or scan a QR code. Every payment is previewed before signing.</p><button className="feature-cta">Open QR pay <ArrowUpRight size={14} /></button></div><div className="feature-card"><div className="feature-card-icon peach"><Gift size={19} /></div><span className="section-kicker">REWARDS</span><h3>Earn while you use Nexa</h3><p>Track eligible rewards, campaigns, and your monthly earning progress.</p><button className="feature-cta">Explore rewards <ArrowUpRight size={14} /></button></div></div></>; }
function WalletPage() { return <><Web3WalletCard /><ERC20BalanceCard /><ERC20TransferCard /><div className="feature-card"><div className="feature-card-icon green"><FileText size={19} /></div><span className="section-kicker">ON-CHAIN RECORDS</span><h3>Activity and approvals</h3><p>Review transactions, token permissions, and network status in one place.</p><button className="feature-cta">Open activity <ArrowUpRight size={14} /></button></div></>; }
function SettingsPage() { return <div className="settings-list"><div className="setting-row"><span className="setting-icon"><LockKeyhole size={18} /></span><div><b>Security center</b><p>Session protection, wallet permissions, and signing warnings.</p></div><ArrowUpRight size={16} /></div><div className="setting-row"><span className="setting-icon"><Network size={18} /></span><div><b>Networks</b><p>Manage Ethereum, Base, BNB Chain, and Base Sepolia.</p></div><ArrowUpRight size={16} /></div><div className="setting-row"><span className="setting-icon"><Globe2 size={18} /></span><div><b>Display preferences</b><p>Currency, language, notifications, and privacy preferences.</p></div><ArrowUpRight size={16} /></div></div>; }
function HelpPage() { return <div className="help-grid"><div className="feature-card"><div className="feature-card-icon blue"><CircleHelp size={19} /></div><span className="section-kicker">START HERE</span><h3>Using Nexa safely</h3><p>Nexa never asks for your seed phrase. Always verify the network, contract, spender, and amount before signing.</p><button className="feature-cta">Read safety guide <ExternalLink size={14} /></button></div><div className="feature-card"><div className="feature-card-icon lilac"><Sparkles size={19} /></div><span className="section-kicker">DEFI BASICS</span><h3>Understand approvals</h3><p>Learn why token approvals exist, how allowance works, and how to revoke permissions.</p><button className="feature-cta">Open guide <ExternalLink size={14} /></button></div></div>; }

export default function FeaturePage({ type }: { type: string }) {
  const data = pageData[type] ?? pageData.Markets;
  const content = type === "Markets" ? <MarketsPage /> : type === "Trade" ? <TradePage /> : type === "Pay" ? <PayPage /> : type === "Wallet" ? <WalletPage /> : type === "Settings" ? <SettingsPage /> : <HelpPage />;
  return <div className="wallet-shell"><Side active={type} /><main className="main-content"><Top active={data.title} /><div className="content-wrap feature-content"><BackButton /><section className="page-intro"><span className="section-kicker">{data.kicker}</span><h1>{data.title}</h1><p>{data.description}</p></section>{content}</div></main></div>;
}
