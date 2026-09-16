import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import Web3WalletCard from "@/components/Web3WalletCard";
import ERC20BalanceCard from "@/components/ERC20BalanceCard";
import ChainFavoritesCard from "@/components/ChainFavoritesCard";
import ERC20TransferCard from "@/components/ERC20TransferCard";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  Copy,
  CreditCard,
  Gift,
  Globe2,
  Grid2X2,
  Home as HomeIcon,
  LayoutGrid,
  Menu,
  MoreHorizontal,
  QrCode,
  ScanLine,
  Search,
  Send,
  Settings2,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type IconType = typeof HomeIcon;

const navItems: { label: string; icon: IconType }[] = [
  { label: "Home", icon: HomeIcon },
  { label: "Markets", icon: TrendingUp },
  { label: "Trade", icon: Zap },
  { label: "Pay", icon: CreditCard },
  { label: "Wallet", icon: WalletCards },
];

const quickActions: { label: string; icon: IconType; tone: string }[] = [
  { label: "QR pay", icon: QrCode, tone: "bg-mint-soft text-mint-strong" },
  { label: "Rewards", icon: Gift, tone: "bg-lilac text-lilac-strong" },
  { label: "dApps", icon: Globe2, tone: "bg-blue-soft text-blue-strong" },
  { label: "eSIM", icon: Zap, tone: "bg-peach text-peach-strong" },
  { label: "More", icon: MoreHorizontal, tone: "bg-ink text-white" },
];

const marketAssets = [
  { name: "ARGUS", symbol: "ARGUS", price: "$0.0842", change: "+18.42%", color: "#b7f45b", chart: "M2 27 C 15 23, 17 18, 29 21 S 42 8, 52 15 S 68 10, 81 4" },
  { name: "Bitcoin", symbol: "BTC", price: "$104,832", change: "+4.06%", color: "#f3b34f", chart: "M2 24 C 16 25, 20 16, 31 20 S 46 16, 57 10 S 71 15, 81 3" },
  { name: "Ethereum", symbol: "ETH", price: "$3,428.20", change: "+2.18%", color: "#a9a6ff", chart: "M2 25 C 15 21, 19 28, 30 18 S 46 20, 55 16 S 68 17, 81 8" },
];

const holdings = [
  { name: "USD Coin", ticker: "USDC", amount: "2,420.00", value: "$2,420.00", color: "#2775ca", icon: "◉", change: "+0.01%" },
  { name: "Tether", ticker: "USDT", amount: "1,008.20", value: "$1,008.20", color: "#26a17b", icon: "₮", change: "+0.02%" },
  { name: "Ethereum", ticker: "ETH", amount: "0.8421", value: "$2,886.32", color: "#8b8bff", icon: "◆", change: "+2.18%" },
  { name: "Solana", ticker: "SOL", amount: "4.92", value: "$789.40", color: "#111827", icon: "≋", change: "+6.12%" },
];

function MiniChart({ path, color = "#6eb52c" }: { path: string; color?: string }) {
  return (
    <svg className="h-9 w-[82px] overflow-visible" viewBox="0 0 84 30" fill="none" aria-hidden="true">
      <path d={path} stroke={color} strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  );
}

function CoinMark({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className="coin-mark" style={{ background: color }}>{children}</span>;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [active, setActive] = useState("Home");
  const [showMore, setShowMore] = useState(false);
  const [hideBalance, setHideBalance] = useState(false);
  const [query, setQuery] = useState("");
  const [assetTab, setAssetTab] = useState("Crypto");

  const filteredHoldings = useMemo(() => holdings.filter((item) => `${item.name} ${item.ticker}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const action = (label: string) => {
    if (label === "More") setShowMore(true);
    else if (label === "Rewards") setLocation("/wallet-ui-replica/pay");
    else if (label === "dApps") setLocation("/wallet-ui-replica/trade");
    else if (label === "QR pay") setLocation("/wallet-ui-replica/pay");
    else toast.success(`${label} is ready`, { description: "This action is now part of the wallet flow." });
  };

  return (
    <div className="wallet-shell">
      <aside className="sidebar">
        <div className="brand-lockup"><div className="brand-mark"><span /></div><span>nexa</span></div>
        <div className="account-pill"><div className="avatar">S</div><div className="account-copy"><b>samira.eth</b><span>0x84...a3E9</span></div><ChevronDown size={16} /></div>
        <div className="sidebar-label">Workspace</div>
        <nav className="side-nav">
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); if (label !== "Home") setLocation(`/wallet-ui-replica/${label.toLowerCase()}`); }}><Icon size={18} /><span>{label}</span>{label === "Trade" && <span className="nav-dot" />}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <button className="side-link" onClick={() => setLocation("/wallet-ui-replica/help")}><CircleHelp size={18} /><span>Help center</span></button>
        <button className="side-link" onClick={() => setLocation("/wallet-ui-replica/settings")}><Settings2 size={18} /><span>Settings</span></button>
        <div className="sidebar-footer"><div className="secure-badge"><span className="secure-dot" /> Secured by Nexa Guard</div><span className="version">v2.4.0</span></div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => toast("Menu is available on desktop view")}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Wallet</span><span className="slash">/</span><b>{active}</b></div>
          <div className="top-actions">
            <label className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assets, features..." /></label>
            <button className="icon-button"><ScanLine size={18} /></button>
            <button className="icon-button notification"><Bell size={18} /><i /></button>
            <div className="top-avatar">S</div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="hero-grid">
            <div className="balance-panel">
              <div className="eyebrow-row"><span className="eyebrow">TOTAL BALANCE</span><button className="eye-toggle" onClick={() => setHideBalance(!hideBalance)}>{hideBalance ? "Show" : "Hide"}</button></div>
              <div className="balance-value">{hideBalance ? "••••••" : "$8,438.05"}</div>
              <div className="balance-change"><span>↘</span> -$29.98 <b>-0.35%</b><span className="change-caption">Today</span></div>
              <div className="balance-actions"><button className="primary-action" onClick={() => toast.success("Deposit flow opened")}><ArrowDownToLine size={16} /> Add funds</button><button className="secondary-action" onClick={() => toast("Portfolio analytics coming soon")}><Grid2X2 size={16} /> Analytics</button></div>
            </div>
            <div className="mini-stat-card"><div className="stat-top"><span>PORTFOLIO APY</span><Sparkles size={16} /></div><strong>8.42%</strong><p><span>+1.28%</span> this month</p><MiniChart color="#a9a6ff" path="M2 26 C 14 21, 18 25, 28 18 S 43 21, 54 12 S 67 14, 82 3" /></div>
            <div className="mini-stat-card dark-stat"><div className="stat-top"><span>REWARDS EARNED</span><Gift size={16} /></div><strong>$124.80</strong><p><span>+ $18.20</span> this month</p><div className="reward-orb"><span /></div></div>
          </section>

          <Web3WalletCard />
          <ERC20BalanceCard />
          <ChainFavoritesCard />
          <ERC20TransferCard />

          <section className="quick-row">{quickActions.map(({ label, icon: Icon, tone }) => <button className="quick-action" key={label} onClick={() => action(label)}><span className={`quick-icon ${tone}`}><Icon size={20} /></span><span>{label}</span></button>)}</section>

          <section className="promo-banner"><div className="promo-copy"><span className="promo-kicker"><Zap size={13} /> NEXA DROP</span><h2>Trade more.<br /><em>Pay less.</em></h2><p>Enjoy 0 fees on your first 5 swaps this week.</p><button onClick={() => toast.success("Promo activated")}>Explore offer <ArrowUpRight size={15} /></button></div><div className="promo-art"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-coin">N</div><div className="art-star">✦</div><div className="art-spark">✧</div></div><div className="promo-index"><b>01</b><span /><span /><span /></div></section>

          <section className="section-block market-section"><div className="section-head"><div><span className="section-kicker">MARKETS</span><h2>Happening now <span className="live-dot" /></h2></div><button className="text-button" onClick={() => setLocation("/wallet-ui-replica/markets")}>View all <ArrowUpRight size={15} /></button></div><div className="market-grid">{marketAssets.map((asset) => <button className="market-card" key={asset.symbol} onClick={() => setLocation("/wallet-ui-replica/markets")}><div className="market-card-top"><CoinMark color={asset.color}>{asset.symbol.slice(0, 1)}</CoinMark><span className="market-more">•••</span></div><div className="market-name">{asset.name}<small>{asset.symbol}</small></div><div className="market-bottom"><div><b>{asset.price}</b><span className="positive">{asset.change}</span></div><MiniChart color={asset.color} path={asset.chart} /></div></button>)}</div></section>

          <section className="section-block portfolio-section"><div className="section-head"><div><span className="section-kicker">YOUR ASSETS</span><h2>Portfolio</h2></div><div className="tab-row">{["Crypto", "Stocks", "Perps"].map((tab) => <button className={assetTab === tab ? "selected" : ""} key={tab} onClick={() => setAssetTab(tab)}>{tab}</button>)}</div></div><div className="portfolio-card"><div className="portfolio-head"><span>Asset</span><span>Balance</span><span>24h change</span></div>{assetTab !== "Crypto" ? <div className="empty-state"><Sparkles size={20} /><span>{assetTab} markets are being curated for you.</span></div> : filteredHoldings.map((item) => <button className="holding-row" key={item.ticker} onClick={() => toast(`${item.name} selected`)}><div className="holding-asset"><CoinMark color={item.color}>{item.icon}</CoinMark><div><b>{item.name}</b><span>{item.ticker}</span></div></div><div className="holding-balance"><b>{item.amount}</b><span>{item.value}</span></div><div className="holding-change"><MiniChart path="M2 22 C 14 20, 20 25, 30 16 S 46 20, 58 11 S 72 14, 82 5" /><span className="positive">{item.change}</span></div><ArrowUpRight className="row-arrow" size={16} /></button>)}</div></section>

          <section className="bottom-grid"><div className="activity-card"><div className="section-head"><div><span className="section-kicker">ACTIVITY</span><h2>Recent activity</h2></div><button className="text-button" onClick={() => toast("Activity history opened")}>See all <ArrowUpRight size={15} /></button></div><div className="activity-list"><div className="activity-item"><span className="activity-icon mint"><ArrowDownToLine size={16} /></span><div><b>Received USDC</b><span>Today, 10:42 AM</span></div><strong className="positive">+$420.00</strong></div><div className="activity-item"><span className="activity-icon lilac"><Send size={16} /></span><div><b>Sent ETH</b><span>Yesterday, 04:18 PM</span></div><strong>-$186.40</strong></div><div className="activity-item"><span className="activity-icon peach"><ShoppingBag size={16} /></span><div><b>Paid with QR</b><span>Sep 14, 12:05 PM</span></div><strong>-$24.90</strong></div></div></div><div className="network-card"><div className="section-kicker">NETWORKS</div><h2>Connected chains</h2><div className="network-visual"><div className="network-lines" /><div className="network-circle central">N</div>{["ETH", "SOL", "BASE", "BNB"].map((chain, i) => <div className={`network-circle node node-${i}`} key={chain}>{chain.slice(0, 1)}</div>)}</div><div className="network-footer"><span><i className="online-dot" /> All systems operational</span><button onClick={() => toast("Network manager opened")}>Manage <ArrowUpRight size={14} /></button></div></div></section>
        </div>
        <footer className="mobile-nav">{navItems.map(({ label, icon: Icon }) => <button className={active === label ? "active" : ""} key={label} onClick={() => { setActive(label); if (label !== "Home") setLocation(`/wallet-ui-replica/${label.toLowerCase()}`); }}><Icon size={19} /><span>{label}</span></button>)}</footer>
      </main>

      {showMore && <div className="drawer-backdrop" onClick={() => setShowMore(false)}><div className="more-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="section-kicker">NEXA TOOLS</span><h2>Everything in one place</h2></div><button className="close-button" onClick={() => setShowMore(false)}><X size={19} /></button></div><div className="drawer-grid">{[{ label: "Send", icon: Send, tone: "bg-mint-soft" }, { label: "Receive", icon: ArrowDownToLine, tone: "bg-blue-soft" }, { label: "Buy crypto", icon: WalletCards, tone: "bg-lilac" }, { label: "Card", icon: CreditCard, tone: "bg-peach" }, { label: "Swap + Bridge", icon: Zap, tone: "bg-yellow-soft" }, { label: "Shop", icon: ShoppingBag, tone: "bg-pink-soft" }, { label: "Scan QR", icon: ScanLine, tone: "bg-mint-soft" }, { label: "Address book", icon: Copy, tone: "bg-blue-soft" }].map(({ label, icon: Icon, tone }) => <button key={label} onClick={() => { setShowMore(false); setLocation(label === "Swap + Bridge" ? "/wallet-ui-replica/trade" : "/wallet-ui-replica/pay"); }}><span className={`drawer-icon ${tone}`}><Icon size={20} /></span><b>{label}</b></button>)}</div><div className="drawer-tip"><Sparkles size={16} /><span><b>New:</b> Smart routing now saves an average of 0.18% per swap.</span></div></div></div>}
    </div>
  );
}
