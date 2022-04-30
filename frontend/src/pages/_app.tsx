import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import RouteGuard from "../components/routeGuard";
import { SWRConfig } from "swr";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig value={{
            refreshInterval: 20
        }}>
            <RouteGuard>
                <Component {...pageProps} />
            </RouteGuard>
        </SWRConfig>
    );
}

export default MyApp;
