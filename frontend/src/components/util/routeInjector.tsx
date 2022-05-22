import useEdition from "../../hooks/useGlobalEdition";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getQueryUrlFromParams } from "../../api/calls/baseCalls";
import apiPaths from "../../properties/apiPaths";
import { getAllEditionsFromPage, getEditionByName, getEditionOnUrl } from "../../api/calls/editionCalls";
import { useEffect } from "react";
import applicationPaths from "../../properties/applicationPaths";
import useTranslation from "next-translate/useTranslation";
import { capitalize } from "../../utility/stringUtil";
import { Button } from "react-bootstrap";
import NavBar from "./navBar";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { pathIsAuthException } from "../../utility/pathUtil";
import { useSwrForEntityList } from "../../hooks/utilHooks";

export default function RouteInjector({ children }: any) {
    const router = useRouter();
    const replace = router.replace;

    const { error: userError } = useCurrentUser(true);
    const injectorActive: boolean = !userError && !pathIsAuthException(router.asPath);

    const { t } = useTranslation("common");
    const [contextEditionUrl, setContextEditionUrl] = useEdition();
    const { data: contextEdition, error: contextEditionError } = useSWR(
        injectorActive ? contextEditionUrl : null,
        getEditionOnUrl
    );

    const contextEditionName = contextEdition?.name;
    const hadContextError = !!contextEditionError;

    const query = router.query as { edition?: string };
    const routerEditionName = query.edition;
    const { data: fetchedRouterEdition, error: fetchedEditionError } = useSWR(
        injectorActive ? routerEditionName : null,
        getEditionByName
    );
    const fetchedRouterEditionUrl = fetchedRouterEdition?._links?.self?.href;
    const hadRouterError = !!fetchedEditionError;

    const { data: availableEditions, error: availableEditionsError } = useSwrForEntityList(
        !contextEditionUrl && !routerEditionName && injectorActive
            ? getQueryUrlFromParams(apiPaths.editions, { sort: "year" })
            : null,
        getAllEditionsFromPage
    );
    const latestEdition = availableEditions?.at(availableEditions?.length - 1);
    const latestEditionName = latestEdition?.name;

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

        // You have no context edition and no path edition, but are able to see editions.
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

    if (availableEditionsError) {
        console.log(availableEditionsError);
        return null;
    }

    if (availableEditions && availableEditions.length === 0) {
        if (
            router.pathname !== "/" + applicationPaths.home &&
            router.pathname !== "/" + applicationPaths.editionCreate
        ) {
            return (
                <>
                    <NavBar />
                    <div data-testid="no-edition" style={{ textAlign: "center", padding: "15em 0" }}>
                        <div style={{ padding: "10px", fontWeight: "bold", fontSize: "130%" }}>
                            {capitalize(t("no edition"))}
                        </div>
                        <Button href={applicationPaths.editionCreate}>
                            {capitalize(t("create new edition"))}
                        </Button>
                    </div>
                </>
            );
        } else {
            return children;
        }
    }

    return children;
}
