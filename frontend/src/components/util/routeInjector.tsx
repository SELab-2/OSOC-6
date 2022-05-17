import useEdition from "../../hooks/useGlobalEdition";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import apiPaths from "../../properties/apiPaths";
import { getAllEditionsFromPage, getEditionByName, getEditionOnUrl } from "../../api/calls/editionCalls";
import { useEffect } from "react";
import applicationPaths from "../../properties/applicationPaths";
import useTranslation from "next-translate/useTranslation";
import { useCurrentUser } from "../../hooks/useCurrentUser";

export default function RouteInjector({ children }: any) {
    const { error: userError } = useCurrentUser(true);
    const userIsLoggedIn: boolean = !userError;

    const { t } = useTranslation("common");
    const [contextEditionUrl, setContextEditionUrl] = useEdition();
    console.log(contextEditionUrl);
    const { data: contextEdition, error: contextEditionError } = useSWR(
        userIsLoggedIn ? contextEditionUrl : null,
        getEditionOnUrl
    );

    const contextEditionName = contextEdition?.name;
    const hadContextError = !!contextEditionError;

    const router = useRouter();
    const replace = router.replace;
    const query = router.query as { edition?: string };
    const routerEditionName = query.edition;
    const { data: fetchedRouterEdition, error: fetchedEditionError } = useSWR(
        userIsLoggedIn ? routerEditionName : null,
        getEditionByName
    );
    const fetchedRouterEditionUrl = fetchedRouterEdition?._links?.self?.href;
    const hadRouterError = !!fetchedEditionError;

    const { data: availableEditions, error: availableEditionsError } = useSWR(
        !contextEditionUrl && !routerEditionName && userIsLoggedIn
            ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" })
            : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(0);
    const latestEditionName = latestEdition?.name;

    console.log(contextEditionError || fetchedEditionError || availableEditionsError);

    useEffect(() => {
        // The edition in your path is set, but you don't have the context, or they differ. -> set context
        if (fetchedRouterEditionUrl && contextEditionUrl !== fetchedRouterEditionUrl) {
            setContextEditionUrl(fetchedRouterEditionUrl);
        }

        // You can not get the edition with the name in the path
        // -> You probably need to update the edition name because it was altered.
        // -> Should be handled by transformer, but we save guard here.
        if (hadRouterError && contextEditionName && contextEditionName !== routerEditionName) {
            replace({
                query: { ...query, edition: contextEditionName },
            }).catch(console.log);
        }

        // You do not have a path edition set but your config edition is set and defined -> set path edition
        if (contextEditionName && !routerEditionName) {
            replace({
                query: { ...query, edition: contextEditionName },
            }).catch(console.log);
        }

        // You can not get the edition that is saved in the context -> Might be because it was removed.
        // -> Clear the context edition. It's not worth holding on to.
        if (hadContextError && contextEditionUrl) {
            setContextEditionUrl(null);
        }

        // You have no context edition and no path edition. But are able to see editions.
        if (!contextEditionUrl && !routerEditionName && latestEditionName) {
            replace({
                query: {
                    ...query,
                    edition: latestEditionName,
                },
            }).catch(console.log);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        fetchedRouterEditionUrl,
        hadRouterError,
        contextEditionName,
        contextEditionUrl,
        hadContextError,
        latestEditionName,
    ]);
    // console.log([fetchedRouterEditionUrl, hadRouterError, contextEditionName, contextEditionUrl, hadContextError, latestEditionName])

    if (availableEditionsError) {
        console.log(availableEditionsError);
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
