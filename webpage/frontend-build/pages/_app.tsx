import type { AppProps } from "next/app";
import "../app/globals.css";
import { RoleProvider } from "../src/context/RoleContext";
import { RealtimeProvider } from "../src/context/RealtimeContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoleProvider>
      <RealtimeProvider>
        <Component {...pageProps} />
      </RealtimeProvider>
    </RoleProvider>
  );
}
