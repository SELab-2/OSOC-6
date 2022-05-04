import { FetcherResponse, PublicConfiguration } from "swr/dist/types";
import useEdition from "./useGlobalEdition";
import useSWR from "swr";
import { extractIdFromEditionUrl } from "../api/calls/editionCalls";
import { getQueryUrlFromParams } from "../api/calls/baseCalls";

export function useSwrWithEdition<T>(
    key: string | null,
    fetcher: ((args_0: string) => FetcherResponse<T>) | null,
    config?: Partial<PublicConfiguration<T, any, (args_0: string) => FetcherResponse<T>>>
) {
    const [edition] = useEdition();
    return useSWR(
        key
            ? getQueryUrlFromParams(key, {
                  edition: edition ? extractIdFromEditionUrl(edition._links.self.href) : undefined,
              })
            : null,
        fetcher,
        config
    );
}

export function useEditionPathTransformer(): (url: string) => string {
    const [edition] = useEdition();
    return (url) => getQueryUrlFromParams(url, { edition: edition?.name });
}
