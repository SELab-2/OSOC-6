import useEdition from "../../hooks/useGlobalEdition";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import apiPaths from "../../properties/apiPaths";
import { getAllEditionsFromPage, getEditionByName, getEditionOnUrl } from "../../api/calls/editionCalls";
import { useEffect } from "react";
import applicationPaths from "../../properties/applicationPaths";
import useTranslation from "next-translate/useTranslation";

export default function RouteInjector({ children }: any) {
    const { t } = useTranslation("common");
    const [contextEditionUrl, setContextEditionUrl] = useEdition();
    const { data: contextEdition, error: contextEditionError } = useSWR(contextEditionUrl, getEditionOnUrl);

    const contextEditionName = contextEdition?.name;

    const router = useRouter();
    const replace = router.replace;
    const query = router.query as { edition?: string };
    const routerEditionName = query.edition;
    const { data: fetchedRouterEdition, error: fetchedEditionError } = useSWR(
        routerEditionName,
        getEditionByName
    );
    const fetchedRouterEditionUrl = fetchedRouterEdition?._links?.self?.href;

    const { data: availableEditions, error: availableEditionsError } = useSWR(
        !contextEditionUrl && !routerEditionName
            ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" })
            : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(0);
    const latestEditionName = latestEdition?.name;

    useEffect(() => {
        // The edition in your path is set, but you don't have the context, or they differ.
        if (fetchedRouterEditionUrl && contextEditionUrl !== fetchedRouterEditionUrl) {
            setContextEditionUrl(fetchedRouterEditionUrl);
        }

        // You do not have a path edition set but your config edition is set.
        if (contextEditionName && !routerEditionName) {
            replace({
                query: { ...query, edition: contextEditionName },
            }).catch(console.log);
        }

        // You have no context edition and no path edition.
        if (!contextEditionUrl && !routerEditionName && latestEditionName) {
            console.log("nope");
            replace({
                query: {
                    ...query,
                    edition: latestEditionName,
                },
            }).catch(console.log);
        }
    }, [fetchedRouterEditionUrl, contextEditionName, contextEditionUrl, latestEditionName]);

    if (fetchedEditionError || availableEditionsError || contextEditionError) {
        console.log(fetchedEditionError || availableEditionsError || contextEditionError);
        return null;
    }

    if (availableEditions && availableEditions.length === 0) {
        if (router.pathname !== "/" + applicationPaths.home) {
            return <div>{t("no edition")}</div>;
        } else {
            return children;
        }
    }

    return children;
}
