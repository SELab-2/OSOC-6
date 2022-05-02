import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import RouteGuard from "../components/routeGuard";
import { SWRConfig } from "swr";
import { GlobalStateProvider } from "../context/globalContext";
import RouteInjector from "../components/routeInjector";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                refreshInterval: 10_000,
            }}
        >
            <GlobalStateProvider>
                <RouteGuard>
                    <RouteInjector>
                        <Component {...pageProps} />
                    </RouteInjector>
                </RouteGuard>
            </GlobalStateProvider>
        </SWRConfig>
    );
}

export default MyApp;
