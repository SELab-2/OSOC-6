import { FetcherResponse, PublicConfiguration } from "swr/dist/types";
import useEdition from "./useGlobalEdition";
import useSWR, { useSWRConfig } from "swr";
import { extractIdFromEditionUrl, getEditionOnUrl } from "../api/calls/editionCalls";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";
import { useRouter } from "next/router";
import { IEdition } from "../api/entities/EditionEntity";
import { IBaseEntity } from "../api/entities/BaseEntities";

export function useSwrForEntityList<T extends IBaseEntity[]>(
    url: string | null,
    fetcher: ((args_0: string) => FetcherResponse<T>) | null,
    config?: Partial<PublicConfiguration<T, any, (args_0: string) => FetcherResponse<T>>>
) {
    const { mutate } = useSWRConfig();
    const swrResponse = useSWR(url, fetcher, config);
    if (swrResponse.data) {
        Promise.all(swrResponse.data.map((entity) => mutate(entity._links.self.href))).catch(console.log);
    }
    return swrResponse;
}

export function useSwrForEntityListWithEdition<T extends IBaseEntity[]>(
    url: string | null,
    fetcher: ((args_0: string) => FetcherResponse<T>) | null,
    config?: Partial<PublicConfiguration<T, any, (args_0: string) => FetcherResponse<T>>>
) {
    const apiTransformer = useEditionAPIUrlTransformer();
    return useSWR(url ? apiTransformer(url) : null, fetcher, config);
}

/**
 * useSWR wrapper that fills in the global edition as an edition query.
 * Note: this should only be used on search paths. These are paths containing `/search/`
 * @param url the query url that should be edition enabled. [Null] if the fetch should not be performed.
 * @param fetcher the fetcher function as defined in the SWR documentation.
 * @param config the SWR config object as defined in the SWR documentation.
 */
export function useSwrWithEdition<T>(
    url: string | null,
    fetcher: ((args_0: string) => FetcherResponse<T>) | null,
    config?: Partial<PublicConfiguration<T, any, (args_0: string) => FetcherResponse<T>>>
) {
    const apiTransformer = useEditionAPIUrlTransformer();
    return useSWR(url ? apiTransformer(url) : null, fetcher, config);
}

/**
 * Hook returning an API url transformer.
 * The transformer makes sure an api url has the needed query parameter.
 */
export function useEditionAPIUrlTransformer(): (url: string) => string {
    const [editionUrl] = useEdition();
    return (url) =>
        getQueryUrlFromParams(url, {
            edition: editionUrl ? extractIdFromEditionUrl(editionUrl) : undefined,
        });
}

/**
 * Hook returning an application path transformer.
 * The transformer makes sure an application path has the needed query parameter.
 */
export function useEditionApplicationPathTransformer(): (url: string) => string {
    const [editionUrl] = useEdition();
    const { data: edition } = useSWR(editionUrl, getEditionOnUrl);
    return (url) => getQueryUrlFromParams(url, { edition: edition?.name });
}

/**
 * Set the global context and change the url so the
 * right edition name is in the url.
 */
export function useGlobalEditionSetter(): (edition: IEdition) => Promise<void> {
    const router = useRouter();
    const [contextEdition, setContextEdition] = useEdition();

    async function setGlobalStateAndUrl(edition: IEdition) {
        const replace = router.replace;
        const query = router.query as { edition?: string };

        setContextEdition(edition._links.self.href);

        await replace({
            query: { ...query, edition: edition.name },
        });
    }

    return setGlobalStateAndUrl;
}
