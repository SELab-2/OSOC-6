import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { SWRConfig } from "swr";
import { GlobalStateProvider } from "../context/globalContext";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { capitalize_complete } from "../utility/stringUtil";

function MyApp({ Component, pageProps }: AppProps) {
    const { t } = useTranslation("common");
    return (
        <div className={"app"}>
            <Head>
                <title>{capitalize_complete(t("tool name"))}</title>
                <link rel="icon" type="image/x-icon" href="/resources/osoc-logo.svg" />
            </Head>
            <SWRConfig
                value={{
                    refreshInterval: 10_000,
                }}
            >
                <GlobalStateProvider>
                    <Component {...pageProps} />
                </GlobalStateProvider>
            </SWRConfig>
        </div>
    );
}

export default MyApp;
