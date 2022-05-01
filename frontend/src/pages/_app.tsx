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
                refreshInterval: 5_000,
            }}
        >
            <GlobalStateProvider>
                <RouteInjector>
                    <RouteGuard>
                        <Component {...pageProps} />
                    </RouteGuard>
                </RouteInjector>
            </GlobalStateProvider>
        </SWRConfig>
    );
}

export default MyApp;
