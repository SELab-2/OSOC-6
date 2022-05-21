import { useRouter } from "next/router";
import { useEditionApplicationPathTransformer } from "./utilHooks";
import { ParsedUrlQueryInput } from "node:querystring";
import useEdition from "./useGlobalEdition";
import useSWR from "swr";
import { getEditionOnUrl } from "../api/calls/editionCalls";

/**
 * TransitionOptions used by NextRouter.
 */
export interface TransitionOptions {
    shallow?: boolean;
    locale?: string | false;
    scroll?: boolean;
}

/**
 * UrlObject used by NextRouter.
 */
export interface UrlObject {
    auth?: string | null | undefined;
    hash?: string | null | undefined;
    host?: string | null | undefined;
    hostname?: string | null | undefined;
    href?: string | null | undefined;
    pathname?: string | null | undefined;
    protocol?: string | null | undefined;
    search?: string | null | undefined;
    slashes?: boolean | null | undefined;
    port?: string | number | null | undefined;
    query?: null | ParsedUrlQueryInput | undefined;
}

/**
 * Url used by NextRouter.
 */
export type Url = string | UrlObject

export type RouterAction = (
    url: Url,
    as?: string,
    options?: TransitionOptions
) => Promise<boolean>;

export function useRouterPush(): RouterAction {
    const router = useRouter();
    const [editionUrl] = useEdition();
    const { data: edition } = useSWR(editionUrl, getEditionOnUrl);

    return (url, as, options) => {

        console.log(url)
        console.log(router);

        if (edition?.name) {
            if (typeof url === "string") {
                return router.push({ href: url, query: { edition: edition?.name } }, as, options);
            } else {
                const newUrl = { ...url };
                newUrl.query = { ...(url.query || {}), edition: edition?.name };
                return router.push(newUrl, as, options);
            }
        } else {
            return router.push(url, as, options);
        }
    };
}

export function useRouterReplace(): RouterAction {
    const router = useRouter();
    const [editionUrl] = useEdition();
    const { data: edition } = useSWR(editionUrl, getEditionOnUrl);

    return (url, as, options) => {
        if (edition?.name) {
            if (typeof url === "string") {
                return router.replace({ href: url, query: { edition: edition?.name } }, as, options);
            } else {
                const newUrl = { ...url };
                newUrl.query = { ...(url.query || {}), edition: edition?.name };
                return router.replace(newUrl, as, options);
            }
        } else {
            return router.replace(url, as, options);
        }
    };
}
