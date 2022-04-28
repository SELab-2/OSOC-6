import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import RouteGuard from "../components/routeGuard";
import EditionGuard from "../components/editionGuard";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <RouteGuard>
            <EditionGuard>
                <Component {...pageProps} />
            </EditionGuard>
        </RouteGuard>
    );
}

export default MyApp;
