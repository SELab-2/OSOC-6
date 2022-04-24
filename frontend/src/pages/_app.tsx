import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import RouteGuard from "../components/routeGuard";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <RouteGuard>
            <Component {...pageProps} />;
        </RouteGuard>
    );
}

export default MyApp;
