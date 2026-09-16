import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FeaturePage from "./pages/FeaturePage";

function useHashLocation(): [string, (to: string) => void] {
  const [location, setLocation] = useState(() => window.location.hash.slice(1) || "/");
  useEffect(() => {
    const onHashChange = () => setLocation(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return [location, (to: string) => { window.location.hash = to; }];
}

function Router() {
  return (
    <WouterRouter hook={useHashLocation}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/wallet-ui-replica/" component={Home} />
      <Route path="/wallet-ui-replica" component={Home} />
      <Route path="/wallet-ui-replica/markets" component={() => <FeaturePage type="Markets" />} />
      <Route path="/wallet-ui-replica/trade" component={() => <FeaturePage type="Trade" />} />
      <Route path="/wallet-ui-replica/pay" component={() => <FeaturePage type="Pay" />} />
      <Route path="/wallet-ui-replica/wallet" component={() => <FeaturePage type="Wallet" />} />
      <Route path="/wallet-ui-replica/settings" component={() => <FeaturePage type="Settings" />} />
      <Route path="/wallet-ui-replica/help" component={() => <FeaturePage type="Help center" />} />
      <Route path="/markets" component={() => <FeaturePage type="Markets" />} />
      <Route path="/trade" component={() => <FeaturePage type="Trade" />} />
      <Route path="/pay" component={() => <FeaturePage type="Pay" />} />
      <Route path="/wallet" component={() => <FeaturePage type="Wallet" />} />
      <Route path="/settings" component={() => <FeaturePage type="Settings" />} />
      <Route path="/help" component={() => <FeaturePage type="Help center" />} />
      <Route path="/404" component={NotFound} />
      <Route component={Home} />
    </Switch>
    </WouterRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
