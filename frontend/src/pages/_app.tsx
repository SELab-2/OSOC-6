import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import RouteGuard from "../components/routeGuard";
import { SWRConfig } from "swr";
import { GlobalStateProvider } from "../context/globalContext";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
            value={{
                refreshInterval: 20,
            }}
        >
            <GlobalStateProvider>
                <RouteGuard>
                    <Component {...pageProps} />
                </RouteGuard>
            </GlobalStateProvider>
        </SWRConfig>
    );
}

export default MyApp;
