import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronRight, CircleDollarSign, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAccount, useSwitchChain } from "wagmi";
import { base, baseSepolia, bsc, mainnet } from "wagmi/chains";
import { chainLabels } from "@/lib/web3";

const chains = [mainnet, base, bsc, baseSepolia];
const favoriteTokens = [
  { symbol: "ETH", name: "Ethereum", ids: "ethereum", color: "#8b8bff", fallback: 3428.2 },
  { symbol: "BTC", name: "Bitcoin", ids: "bitcoin", color: "#f3b34f", fallback: 104832 },
  { symbol: "USDC", name: "USD Coin", ids: "usd-coin", color: "#2775ca", fallback: 1 },
  { symbol: "BNB", name: "BNB", ids: "binancecoin", color: "#f0c44f", fallback: 682.1 },
];

type Prices = Record<string, { usd: number; usd_24h_change?: number }>;

export default function ChainFavoritesCard() {
  const { chainId, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const [prices, setPrices] = useState<Prices>({});
  const [isLoading, setIsLoading] = useState(true);
  const activeChain = chainId && chainLabels[chainId] ? chainLabels[chainId] : "Base Sepolia";

  const loadPrices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin,binancecoin&vs_currencies=usd&include_24hr_change=true");
      if (!response.ok) throw new Error("Price service unavailable");
      setPrices(await response.json() as Prices);
    } catch {
      setPrices(Object.fromEntries(favoriteTokens.map((token) => [token.ids, { usd: token.fallback, usd_24h_change: 0 }])));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPrices();
    const timer = window.setInterval(() => void loadPrices(), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const formatted = useMemo(() => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }), []);

  return (
    <section className="favorites-card"><div className="favorites-header"><div className="favorites-title"><span className="favorites-icon"><Activity size={18} /></span><div><span className="section-kicker">NETWORK & MARKETS</span><h3>Favorites</h3></div></div><button className="favorites-refresh" onClick={() => void loadPrices()} aria-label="Refresh prices">{isLoading ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />} Live</button></div><div className="chain-selector">{chains.map((chain) => <button key={chain.id} className={chainId === chain.id || (!isConnected && chain.id === baseSepolia.id) ? "selected" : ""} onClick={() => { switchChain({ chainId: chain.id }); toast(`Switching to ${chain.name}`); }} disabled={isPending}><span className={`chain-dot chain-${chain.id}`} />{chain.name === "BNB Smart Chain" ? "BNB Chain" : chain.name}{chain.id === chainId && <span className="chain-check">✓</span>}</button>)}</div><div className="favorites-list">{favoriteTokens.map((token) => { const quote = prices[token.ids]; const change = quote?.usd_24h_change ?? 0; return <div className="favorite-row" key={token.symbol}><span className="favorite-coin" style={{ background: token.color }}>{token.symbol.slice(0, 1)}</span><div className="favorite-name"><b>{token.name}</b><span>{token.symbol}</span></div><div className="favorite-price"><b>{quote ? formatted.format(quote.usd) : "—"}</b><span className={change >= 0 ? "positive" : "negative"}>{change >= 0 ? "+" : ""}{change.toFixed(2)}%</span></div><ChevronRight size={15} className="favorite-arrow" /></div>; })}</div><div className="favorites-footer"><span><CircleDollarSign size={12} /> Prices via CoinGecko · refreshes every 30s</span><span>{activeChain}</span></div></section>
  );
}
