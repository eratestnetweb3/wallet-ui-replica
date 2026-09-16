import { createRoot } from "react-dom/client";
import App from "./App";
import Web3Provider from "./components/Web3Provider";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Web3Provider>
    <App />
  </Web3Provider>,
);
