import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { queryClient } from "./api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import "@mysten/dapp-kit/dist/index.css";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import "./index.css";

// const vh = window.innerHeight * 0.01;
// document.documentElement.style.setProperty("--vh", `${vh}px`);

const app = createRoot(document.getElementById("root")!);

app.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Toaster />

      <App />
    </BrowserRouter>
  </QueryClientProvider>
);
