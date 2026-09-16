import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FeaturePage from "./pages/FeaturePage";

function Router() {
  return (
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
