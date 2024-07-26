import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInForceRedirectUrl={
        import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
      }
      signUpForceRedirectUrl={
        import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL
      }
      signInFallbackRedirectUrl={
        import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
      }
      signUpFallbackRedirectUrl={
        import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
      }
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
